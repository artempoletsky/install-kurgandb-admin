"use client"

type FormDataToDictOptions = {
  removeActionField?: boolean,
  keysToRemove?: string[],
}

export function formDataToDict(formData: FormData,
  options: FormDataToDictOptions = {
    removeActionField: false,
    keysToRemove: []
  }): Record<string, string> {
  const result: Record<string, string> = {};

  formData.forEach((value, key) => {

    if (options.keysToRemove?.includes(key)) {
      return;
    }
    if (options.removeActionField && key.startsWith("$ACTION_ID_")) {
      return;
    }
    result[key] = value.toString()
  });
  return result;
}

export function blinkBoolean(setter: (b: boolean) => void, timeout = 1000) {
  setter(true);
  setTimeout(() => {
    setter(false);
  }, timeout);
}
