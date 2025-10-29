import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ClientFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  providerId?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
}

