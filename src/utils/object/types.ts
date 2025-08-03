type TToStringOptions = {
  /**
   * Seperator between `key` and `value`.
   */
  kvSeperator: string;
  /**
   * Seperator between `properties`.
   */
  seperator: string;
};

type TUpdateObjectOptions = {
  /**
   * If `canOverrideValues` is true, all item's values will be assigned to new one. Otherwise,
   * only falsy value of item will be assigned (default is "true").
   */
  canOverrideValues: boolean;
};

export type { TToStringOptions, TUpdateObjectOptions };
