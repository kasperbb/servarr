export function isValidSettings(settings: object) {
  return Object.values(settings).some((setting) => {
    return setting !== '';
  });
}

export function assertValidSettings<T extends object>(settings: T): asserts settings is T {
  if (!isValidSettings(settings)) {
    throw new Error('Invalid settings, did you forget to set them?');
  }
}
