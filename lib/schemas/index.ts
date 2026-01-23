// Central export for all validation schemas
export { CustomerSchema, type Customer } from './customer';
export { ProductSearchSchema, type ProductSearchInput } from './search';
export {
  createErrorResponse,
  type ErrorCode,
  type ErrorDetail,
  type ErrorResponse
} from './errors';
