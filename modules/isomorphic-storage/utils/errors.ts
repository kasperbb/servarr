import { createValidatorErrorMessage } from './create-validator-error-message';

export class IsomorphicStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'IsomorphicStorageError';
    Object.setPrototypeOf(this, IsomorphicStorageError.prototype);
  }
}

export class IsomorphicStorageValidatorError extends IsomorphicStorageError {
  constructor(key: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'IsomorphicStorageValidatorError';
    this.message = createValidatorErrorMessage(key, message);
    Object.setPrototypeOf(this, IsomorphicStorageValidatorError.prototype);
  }
}
