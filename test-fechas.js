const baseUrl = 'http://localhost:5000/api';
let token = '';

async function testFechas() {
  console.log('═══════════════════════════════════════');
  console.log('  TEST DE FILTRO DE FECHAS - DIAGNÓSTICO');
  console.log('═══════════════════════════════════════\n');

  // 1. Login
  console.log('1️⃣  Haciendo login...');
  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@clientbase.com',
      password: 'admin123'
    })
  });
  
  const loginData = await loginResponse.json();
  token = loginData.token;
  console.log('✅ Login exitoso\n');

  // 2. Ver TODOS los clientes y sus fechas
  console.log('2️⃣  Obteniendo TODOS los clientes...');
  const allResponse = await fetch(`${baseUrl}/clients?limit=50`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const allData = await allResponse.json();
  console.log(`📊 Total de clientes: ${allData.pagination.total}\n`);
  
  console.log('📅 FECHAS EN LA BASE DE DATOS:');
  console.log('─'.repeat(80));
  allData.clients.forEach((client, index) => {
    const date = new Date(client.date);
    const dateStr = date.toISOString().split('T')[0];
    console.log(`${(index + 1).toString().padStart(2)}. ${client.name.padEnd(30)} │ ${dateStr}`);
  });
  
  console.log('\n');

  // 3. Test filtro por fecha específica
  const testDate = '2025-10-22';  // Fecha que sabemos que existe
  console.log(`3️⃣  TEST: Filtrar por fecha ${testDate}`);
  console.log('─'.repeat(80));
  
  const filterResponse = await fetch(
    `${baseUrl}/clients?startDate=${testDate}&endDate=${testDate}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  const filterData = await filterResponse.json();
  console.log(`Clientes encontrados: ${filterData.pagination.total}`);
  
  if (filterData.clients.length > 0) {
    console.log('\n✅ CLIENTES ENCONTRADOS:');
    filterData.clients.forEach(client => {
      const date = new Date(client.date);
      console.log(`  - ${client.name} │ ${date.toISOString().split('T')[0]}`);
    });
  } else {
    console.log('❌ NO se encontraron clientes (puede ser el problema)');
  }

  console.log('\n');

  // 4. Test con otra fecha
  const testDate2 = '2025-02-01';
  console.log(`4️⃣  TEST: Filtrar por fecha ${testDate2}`);
  console.log('─'.repeat(80));
  
  const filter2Response = await fetch(
    `${baseUrl}/clients?startDate=${testDate2}&endDate=${testDate2}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  const filter2Data = await filter2Response.json();
  console.log(`Clientes encontrados: ${filter2Data.pagination.total}`);
  
  if (filter2Data.clients.length > 0) {
    console.log('\n✅ CLIENTES ENCONTRADOS:');
    filter2Data.clients.forEach(client => {
      const date = new Date(client.date);
      console.log(`  - ${client.name} │ ${date.toISOString().split('T')[0]}`);
    });
  } else {
    console.log('❌ NO se encontraron clientes');
  }

  console.log('\n');
  console.log('═══════════════════════════════════════');
  console.log('  DIAGNÓSTICO COMPLETO');
  console.log('═══════════════════════════════════════');
  console.log('\n📋 CONCLUSIONES:');
  console.log('1. Si se encontraron clientes → ✅ Backend funciona');
  console.log('2. Si NO se encontraron → ❌ Problema en el backend');
  console.log('3. Si en Postman funciona pero en frontend no → ❌ Frontend');
  console.log('\n');
}

testFechas().catch(console.error);

