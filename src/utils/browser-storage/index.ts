// Import other utils
import * as ObjectUtils from "../object";

// Import types
import type { TUpdateObjectOptions } from "../object/types";

type TUpdateItemOptions = TUpdateObjectOptions;

/**
 * Use this function to get data from storage.
 * @param key
 * @returns
 */
function __getItem<T>(storage: Storage, key: string) {
  const dataString = storage.getItem(key);

  if (!dataString) return null;

  return JSON.parse(dataString) as T;
}

/**
 * __Use Local Storage__
 *
 * Use this function to save data in storage.
 * @param key
 * @param data
 */
function __setItem(storage: Storage, key: string, data: any) {
  data = JSON.stringify(data);
  storage.setItem(key, data);
}

/**
 * Use this function to remove data from storage.
 * @param key
 * @returns
 */
function __removeItem(storage: Storage, key: string) {
  storage.removeItem(key);
  return true;
}

/**
 * Use this function to update an item in storage.
 * @param key
 * @param data
 * @returns
 */
function __updateItem<T>(
  storage: Storage,
  key: string,
  data: T,
  opt?: TUpdateItemOptions
) {
  if (!data) return;

  let storedData = __getItem<T>(storage, key);

  if (!storedData) {
    __setItem(storage, key, data);
    return data;
  }

  storedData = ObjectUtils.updateObject(storedData, data, opt);

  // Set new item
  __setItem(storage, key, storedData);

  return storedData;
}

// /**
//  * Give `index` to this function and receive the `index`-th item's name.
//  * @param index
//  * @returns
//  */
// function __keyName(storage: Storage, index: number) {
//   return storage.key(index);
// }

/**
 * Use this function to clear all items in storage.
 */
function __clearAll(storage: Storage) {
  storage.clear();
}

/**
 * Use this function to get length of local storage.
 * @returns
 */
function __getLength(storage: Storage) {
  return storage.length;
}

/**
 * __Use Local Storage__
 *
 * Use this function to save data in local storage.
 * @param key
 * @param data
 */
export function setItem(key: string, data: any) {
  __setItem(localStorage, key, data);
}

/**
 * __Use Session Storage__
 *
 * Use this function to save data in session storage.
 * @param key
 * @param data
 */
export function setTempItem(key: string, data: any) {
  __setItem(sessionStorage, key, data);
}

/**
 * __Use Local Storage__
 *
 * Use this function to get data from local storage.
 * @param key
 * @returns
 */
export function getItem<T>(key: string) {
  return __getItem<T>(localStorage, key);
}

/**
 * __Use Session Storage__
 *
 * Use this function to get data from session storage.
 * @param key
 * @returns
 */
export function getTempItem<T>(key: string) {
  return __getItem<T>(sessionStorage, key);
}

/**
 * __Use Local Storage__
 *
 * Use this function to remove data from local storage.
 * @param key
 * @returns
 */
export function removeItem(key: string) {
  return __removeItem(localStorage, key);
}

/**
 * __Use Session Storage__
 *
 * Use this function to remove data from session storage.
 * @param key
 * @returns
 */
export function removeTempItem(key: string) {
  return __removeItem(sessionStorage, key);
}

/**
 * __Use Local Storage__
 *
 * Use this function to clear all items in local storage.
 */
export function clearAllItem() {
  __clearAll(localStorage);
}

/**
 * __Use Session Storage__
 *
 * Use this function to clear all items in session storage.
 */
export function clearAllTempItem() {
  __clearAll(sessionStorage);
}

/**
 * __Use Local Storage__
 *
 * Use this function to update an item in local storage.
 * @param key
 * @param data
 * @returns
 */
export function updateItem<T>(
  key: string,
  data: Partial<T>,
  opt?: TUpdateItemOptions
) {
  opt = ObjectUtils.setDefaultValues(opt, { canOverrideValues: true });
  return __updateItem(localStorage, key, data, opt);
}

/**
 * __Use Local Storage__
 *
 * Use this function to update an item in local storage.
 * @param key
 * @param data
 * @returns
 */
export function updateTempItem<T>(
  key: string,
  data: Partial<T>,
  opt?: TUpdateItemOptions
) {
  opt = ObjectUtils.setDefaultValues(opt, { canOverrideValues: true });
  return __updateItem(sessionStorage, key, data, opt);
}

/**
 * __Use Local Storage__
 *
 * Use this function to get length of local storage.
 * @returns
 */
export function countItem() {
  return __getLength(localStorage);
}

/**
 * __Use Session Storage__
 *
 * Use this function to get length of session storage.
 * @returns
 */
export function countTempItem() {
  return __getLength(sessionStorage);
}
