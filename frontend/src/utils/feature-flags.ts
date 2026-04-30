const parseFlag = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
};

export const featureFlags = {
  darkMode: parseFlag(process.env.NEXT_PUBLIC_FEATURE_DARK_MODE, true),
  // fileUpload: Example of another feature flag
};
