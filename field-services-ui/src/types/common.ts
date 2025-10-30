/**
 * Common types used across the application
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Error response
 */
export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  errors?: Record<string, string[]>;
}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}
