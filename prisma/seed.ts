import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@clientbase.com' },
    update: {},
    create: {
      email: 'admin@clientbase.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario administrador creado:', adminUser.email);

  const userPassword = await bcrypt.hash('user123', 10);

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@clientbase.com' },
    update: {},
    create: {
      email: 'user@clientbase.com',
      password: userPassword,
      name: 'Usuario Demo',
      role: 'USER',
    },
  });

  console.log('✅ Usuario normal creado:', normalUser.email);

  const providers = [
    'TechCorp',
    'CloudWave',
    'DataNest',
    'NextGen Systems',
    'SkyNet Solutions',
    'Digital Dynamics',
    'Innovation Labs',
  ];

  for (const providerName of providers) {
    await prisma.provider.upsert({
      where: { name: providerName },
      update: {},
      create: { name: providerName },
    });
  }

  console.log('✅ Proveedores creados');

  const allProviders = await prisma.provider.findMany();

  const clients = [
    {
      name: 'TechCorp Solutions',
      email: 'techcorpsolutions@gmail.com',
      phone: '+34 952 88 62 30',
      company: 'TechCorp Solutions',
      status: 'ACTIVE' as const,
      price: 1000,
      address: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA',
      date: new Date('2025-02-01'),
    },
    {
      name: 'CloudWave Solutions',
      email: 'info@cloudwavesolutions.com',
      phone: '+34 965 44 33 22',
      company: 'CloudWave Solutions',
      status: 'ACTIVE' as const,
      price: 3000,
      address: '456 Cloud Ave',
      city: 'Seattle',
      country: 'USA',
      date: new Date('2025-07-18'),
    },
    {
      name: 'DataNest Innovations',
      email: 'hello@datanestinnovations.com',
      phone: '+34 912 34 56 78',
      company: 'DataNest Innovations',
      status: 'ACTIVE' as const,
      price: 2500,
      address: '789 Data Blvd',
      city: 'Austin',
      country: 'USA',
      date: new Date('2025-10-22'),
    },
    {
      name: 'TechCorp Solutions',
      email: 'techcorpsolutions2@gmail.com',
      phone: '+34 952 88 62 30',
      company: 'TechCorp Solutions',
      status: 'INACTIVE' as const,
      price: 1000,
      address: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA',
      date: new Date('2025-02-01'),
    },
    {
      name: 'NextGen Systems',
      email: 'hello@nextgensystems.org',
      phone: '+34 660 58 78 50',
      company: 'NextGen Systems',
      status: 'ACTIVE' as const,
      price: 5000,
      address: '321 Innovation Dr',
      city: 'Boston',
      country: 'USA',
      date: new Date('2025-12-15'),
    },
    {
      name: 'SmartGrid Technologies',
      email: 'support@smartgridtech.com',
      phone: '+34 660 11 22 33',
      company: 'SmartGrid Technologies',
      status: 'ACTIVE' as const,
      price: 6750,
      address: '654 Network St',
      city: 'New York',
      country: 'USA',
      date: new Date('2026-01-30'),
    },
    {
      name: 'Visionary Designs',
      email: 'info@visionarydesigns.com',
      phone: '+34 650 98 09 00',
      company: 'Visionary Designs',
      status: 'ACTIVE' as const,
      price: 3800,
      address: '987 Digital Way',
      city: 'Los Angeles',
      country: 'USA',
      date: new Date('2026-02-20'),
    },
    {
      name: 'TechCorp Solutions',
      email: 'techcorpsolutions3@gmail.com',
      phone: '+34 952 88 62 30',
      company: 'TechCorp Solutions',
      status: 'INACTIVE' as const,
      price: 1000,
      address: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA',
      date: new Date('2025-02-01'),
    },
    {
      name: 'EcoTech Innovations',
      email: 'info@ecotechinnovations.com',
      phone: '+34 660 55 43 33',
      company: 'EcoTech Innovations',
      status: 'ACTIVE' as const,
      price: 3300,
      address: '258 Global Blvd',
      city: 'Miami',
      country: 'USA',
      date: new Date('2026-04-25'),
    },
    {
      name: 'AgileSoft Solutions',
      email: 'law@agssoft.com',
      phone: '+34 660 69 88 77',
      company: 'AgileSoft Solutions',
      status: 'ACTIVE' as const,
      price: 4600,
      address: '369 Smart Ave',
      city: 'Denver',
      country: 'USA',
      date: new Date('2026-05-12'),
    },
    {
      name: 'Future Systems Corp',
      email: 'contact@futuresystems.com',
      phone: '+1-555-0110',
      company: 'Future Systems',
      status: 'ACTIVE' as const,
      price: 23500,
      address: '741 Future Dr',
      city: 'Portland',
      country: 'USA',
    },
    {
      name: 'Tech Innovators',
      email: 'info@techinnovators.com',
      phone: '+1-555-0111',
      company: 'Tech Innovators LLC',
      status: 'INACTIVE' as const,
      price: 16000,
      address: '852 Tech Plaza',
      city: 'Phoenix',
      country: 'USA',
    },
    {
      name: 'Cloud Masters',
      email: 'hello@cloudmasters.com',
      phone: '+1-555-0112',
      company: 'Cloud Masters Inc',
      status: 'ACTIVE' as const,
      price: 26500,
      address: '963 Cloud Court',
      city: 'Atlanta',
      country: 'USA',
    },
    {
      name: 'Data Wizards',
      email: 'contact@datawizards.com',
      phone: '+1-555-0113',
      company: 'Data Wizards Corp',
      status: 'ACTIVE' as const,
      price: 20000,
      address: '159 Wizard Way',
      city: 'Dallas',
      country: 'USA',
    },
    {
      name: 'Digital Pioneers',
      email: 'info@digitalpioners.com',
      phone: '+1-555-0114',
      company: 'Digital Pioneers Ltd',
      status: 'ACTIVE' as const,
      price: 24000,
      address: '357 Pioneer Path',
      city: 'Houston',
      country: 'USA',
    },
    {
      name: 'Tech Titans',
      email: 'hello@techtitans.com',
      phone: '+1-555-0115',
      company: 'Tech Titans LLC',
      status: 'ACTIVE' as const,
      price: 29000,
      address: '486 Titan Tower',
      city: 'Philadelphia',
      country: 'USA',
    },
    {
      name: 'Cloud Architects',
      email: 'contact@cloudarchitects.com',
      phone: '+1-555-0116',
      company: 'Cloud Architects Inc',
      status: 'INACTIVE' as const,
      price: 18500,
      address: '597 Architect Ave',
      city: 'San Diego',
      country: 'USA',
    },
    {
      name: 'Data Engineers Pro',
      email: 'info@dataengineers.com',
      phone: '+1-555-0117',
      company: 'Data Engineers Professional',
      status: 'ACTIVE' as const,
      price: 27000,
      address: '608 Engineer Blvd',
      city: 'San Jose',
      country: 'USA',
    },
    {
      name: 'Smart Tech Solutions',
      email: 'hello@smarttech.com',
      phone: '+1-555-0118',
      company: 'Smart Tech LLC',
      status: 'ACTIVE' as const,
      price: 21500,
      address: '719 Smart Street',
      city: 'Columbus',
      country: 'USA',
    },
    {
      name: 'Future Cloud Inc',
      email: 'contact@futurecloud.com',
      phone: '+1-555-0119',
      company: 'Future Cloud Corporation',
      status: 'ACTIVE' as const,
      price: 25500,
      address: '820 Future Road',
      city: 'Indianapolis',
      country: 'USA',
    },
    {
      name: 'Innovation Tech',
      email: 'info@innovationtech.com',
      phone: '+1-555-0120',
      company: 'Innovation Tech Ltd',
      status: 'ACTIVE' as const,
      price: 22500,
      address: '931 Innovation Lane',
      city: 'Charlotte',
      country: 'USA',
    },
    {
      name: 'Digital Masters Corp',
      email: 'hello@digitalmasters.com',
      phone: '+1-555-0121',
      company: 'Digital Masters',
      status: 'INACTIVE' as const,
      price: 19000,
      address: '042 Masters Plaza',
      city: 'Detroit',
      country: 'USA',
    },
    {
      name: 'Tech Visionaries',
      email: 'contact@techvisionaries.com',
      phone: '+1-555-0122',
      company: 'Tech Visionaries Inc',
      status: 'ACTIVE' as const,
      price: 31000,
      address: '153 Visionary Way',
      city: 'Nashville',
      country: 'USA',
    },
  ];

  for (const clientData of clients) {
    const randomProvider = allProviders[Math.floor(Math.random() * allProviders.length)];

    await prisma.client.upsert({
      where: { email: clientData.email },
      update: {},
      create: {
        ...clientData,
        providerId: randomProvider.id,
      },
    });
  }

  console.log(`✅ ${clients.length} clientes creados`);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📝 Credenciales de acceso:');
  console.log('   Admin:');
  console.log('   - Email: admin@clientbase.com');
  console.log('   - Password: admin123');
  console.log('\n   Usuario:');
  console.log('   - Email: user@clientbase.com');
  console.log('   - Password: user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

