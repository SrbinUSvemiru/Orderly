export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window?.localStorage?.getItem(key);
    if (item) {
      return JSON.parse(item);
    } else {
      return defaultValue;
    }
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T) => {
  window?.localStorage?.setItem(key, JSON.stringify(value));
};
