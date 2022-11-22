import { I18nOperationMode } from './I18nOperationMode';
import { I18nTranslateAction } from './I18nTranslateAction';
import { I18nTranslateActionType } from './I18nTranslateActionType';

/**
 * @class for a list of Translate actions
 * @public
 */

export class I18nTranslateActions {
  static deleteKeys() {
    this.tmpDelKeys = {};
  }
  private sourceMod: string;
  private sourceLngKey: string;
  private targetMod: string;
  private targetLngKey: string;
  private transactions: I18nTranslateAction[] = [];
  private static tmpDelKeys: any = {};
  private static tmpAddKeys: any = {};
  /**
   * @constructor for the actions in the target space
   * @param mod - module name
   * @param lng - language key
   */
  public constructor(sourceMod: string, sourceLngKey: string, targetMod: string, targetLngKey: string) {
    this.sourceMod = sourceMod;
    this.sourceLngKey = sourceLngKey;
    this.targetMod = targetMod;
    this.targetLngKey = targetLngKey;
  }
  /**
   * Sets a NEW_KEY action => new key in the target space.
   *
   * @param key - the key (text in default language)
   */
  public setupNewKey(key: string, value: string, opMode: I18nOperationMode): void {
    const ta = I18nTranslateAction.setupNewKey(key, value);
    ta.setSourceAndTarget(this.sourceMod, this.sourceLngKey, this.targetMod, this.targetLngKey);
    switch (opMode) {
      case I18nOperationMode.DEFAULT_LNG:
        I18nTranslateActions.tmpAddKeys[key] = true;
        break;
      case I18nOperationMode.NEW_KEYS_FROM_DEFAULT:
      case I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG:
        // console.log("NewKey",ta,I18nTranslateActions.tmpDelKeys);
        if (I18nTranslateActions.tmpDelKeys.hasOwnProperty(key)) {
          return;
        }
        break;
    }
    this.transactions.push(ta);
  }
  /**
   * Sets a DEL_KEY action in the target space
   *
   * @param key - the key (text in default language)
   */
  public setupDelKey(key: string, opMode: I18nOperationMode): void {
    const ta = I18nTranslateAction.setupDelKey(key);
    ta.setSourceAndTarget(this.sourceMod, this.sourceLngKey, this.targetMod, this.targetLngKey);
    switch (opMode) {
      case I18nOperationMode.DEFAULT_LNG:
        I18nTranslateActions.tmpDelKeys[key] = true;
        // console.log("delKey-default",ta,I18nTranslateActions.tmpDelKeys);
        break;
      case I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG:
      case I18nOperationMode.NEW_KEYS_FROM_DEFAULT:
        if (I18nTranslateActions.tmpAddKeys.hasOwnProperty(key)) {
          return;
        }
        break;
    }
    this.transactions.push(ta);
  }
  /**
   * Sets a key/value pair for the target space
   *
   * @param key - the key (text in default language)
   * @param value - The text in the target space language.
   */
  public setupUpdateValue(key: string, val: string, opMode: I18nOperationMode): void {
    const ta = I18nTranslateAction.setupUpdateValue(key, val);
    ta.setSourceAndTarget(this.sourceMod, this.sourceLngKey, this.targetMod, this.targetLngKey);
    switch (opMode) {
      case I18nOperationMode.DEFAULT_LNG:
        break;
      case I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG:
        break;
      case I18nOperationMode.NEW_KEYS_FROM_DEFAULT:
        return;
    }
    this.transactions.push(ta);
  }
  /**
   * Adds the mismatch as action to the actionlist
   */
  public setupMismatchDefaultLanguage(): void {
    const ta = I18nTranslateAction.setupWithoutKeyOrValue(I18nTranslateActionType.MISMATCH_DEFAULT_LNG);
    ta.setSourceAndTarget(this.sourceMod, this.sourceLngKey, this.targetMod, this.targetLngKey);
    this.transactions.push(ta);
  }
  /**
   * adds the new language indicator to the actionlist
   */
  public setupNewLanguage(): void {
    const ta = I18nTranslateAction.setupWithoutKeyOrValue(I18nTranslateActionType.NEW_LANGUAGE);
    ta.setSourceAndTarget(this.sourceMod, this.sourceLngKey, this.targetMod, this.targetLngKey);
    this.transactions.push(ta);
  }
  /**
   * adds the delete language indicator to the actionlist
   */
  public setupDelLanguage(): void {
    const ta = I18nTranslateAction.setupWithoutKeyOrValue(I18nTranslateActionType.DEL_LANGUAGE);
    ta.setSourceAndTarget(this.sourceMod, this.sourceLngKey, this.targetMod, this.targetLngKey);
    this.transactions.push(ta);
  }
  /**
   *
   * @returns a string list representation of the action list.
   */
  public getTransScript(): string[] {
    const result: string[] = [];
    this.transactions.forEach((act) => {
      result.push(act.toString());
    });
    return result;
  }
  /**
   *
   * @returns the list of transactions
   */
  public getActions(): I18nTranslateAction[] {
    return this.transactions;
  }
  /**
   *
   * @returns the size of the internal action list
   */
  public getActionSize(): number {
    return this.transactions.length;
  }
  /**
   *
   * @param other the other action list to be appended to this one
   */
  public appendOther(other: I18nTranslateActions) {
    if (other.getActionSize() > 0) {
      this.transactions = this.transactions.concat(other.transactions);
    }
  }
}
