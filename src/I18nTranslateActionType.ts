/**
 * @enum for the I18nTranslateAction.
 *
 * NO_OP,NEW_KEY,DEL_KEY and UPDATE_VALUE are valid elements.
 */

export enum I18nTranslateActionType {
  NO_OP,
  NEW_KEY,
  DEL_KEY,
  UPDATE_VALUE,
  NEW_LANGUAGE,
  DEL_LANGUAGE,
  MISMATCH_DEFAULT_LNG,
}
