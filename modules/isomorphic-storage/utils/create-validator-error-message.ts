export function createValidatorErrorMessage(key: string, message: string) {
  return `Invalid value for key "${key}" - ${message}`;
}
