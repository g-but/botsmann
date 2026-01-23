// Central export for all validation schemas
export { CustomerSchema, type Customer } from './customer';
export { WaitlistSchema, type WaitlistInput } from './waitlist';
export { ProductSearchSchema, type ProductSearchInput } from './search';
export {
  createErrorResponse,
  type ErrorCode,
  type ErrorDetail,
  type ErrorResponse
} from './errors';
