import { I18nTranslateActionType } from './I18nTranslateActionType';

/**
 * @class for one Translate action
 * @see I18nTranslateActions for interfacing functions.
 * @public
 */

export class I18nTranslateAction {
  public getKey(): string | undefined {
    return this.key;
  }
  public getValue(): string | undefined {
    return this.value;
  }
  private actionType: I18nTranslateActionType = I18nTranslateActionType.NO_OP;
  private sourceMod?: string;
  private sourceLngKey?: string;
  private targetMod?: string;
  private targetLngKey?: string;
  private key?: string;
  private value?: string;
  private constructor(actionType: I18nTranslateActionType) {
    this.actionType = actionType;
  }
  public queryActionType(): I18nTranslateActionType {
    return this.actionType;
  }
  /**
   * sets the source and target form this action.
   *
   * @param sourceMod     - modulename of the source module
   * @param sourceLngKey  - languagekey of current source langauge
   * @param targetMod     - modulname of the target module
   * @param targetLngKey  - languagekey of the current target language
   */
  public setSourceAndTarget(sourceMod: string, sourceLngKey: string, targetMod: string, targetLngKey: string) {
    this.sourceMod = sourceMod;
    this.sourceLngKey = sourceLngKey;
    this.targetMod = targetMod;
    this.targetLngKey = targetLngKey;
  }
  /**
   * Converts this action to string
   *
   * @returns a short string representaion of current action.
   */
  public toString(): string {
    let txt: string = '';
    txt += '[' + this.sourceMod + '.' + this.sourceLngKey + '=>' + this.targetMod + '.' + this.targetLngKey + ']: ';
    switch (this.actionType) {
      default:
      case I18nTranslateActionType.NO_OP:
        txt += 'NO_OP';
        break;
      case I18nTranslateActionType.NEW_KEY:
        txt += 'NEW_KEY';
        txt += '(' + this.key + ',' + this.value + ')';
        break;
      case I18nTranslateActionType.DEL_KEY:
        txt += 'DEL_KEY';
        txt += '(' + this.key + ')';
        break;
      case I18nTranslateActionType.UPDATE_VALUE:
        txt += 'UPDATE_VALUE';
        txt += '(' + this.key + ',' + this.value + ')';
        break;
      case I18nTranslateActionType.NEW_LANGUAGE:
        txt += 'NEW_LANGUAGE';
        break;
      case I18nTranslateActionType.DEL_LANGUAGE:
        txt += 'DEL_LANGUAGE';
        break;
      case I18nTranslateActionType.MISMATCH_DEFAULT_LNG:
        txt += 'MISMATCH_DEFAULT_LNG';
        break;
    }
    return txt;
  }
  /**
   *
   * @param key the key to add
   * @param val the value to update
   * @returns the NewKey-action
   */
  public static setupNewKey(key: string, val: string): I18nTranslateAction {
    const ta = new I18nTranslateAction(I18nTranslateActionType.NEW_KEY);
    ta.key = key;
    ta.value = val;
    return ta;
  }
  /**
   *
   * @param key the key to delete
   * @returns the DelKey Action
   */
  public static setupDelKey(key: string): I18nTranslateAction {
    const ta = new I18nTranslateAction(I18nTranslateActionType.DEL_KEY);
    ta.key = key;
    return ta;
  }
  /**
   *
   * @param key the key to find
   * @param val the value to update
   * @returns the UpdateValue Action
   */
  public static setupUpdateValue(key: string, val: string): I18nTranslateAction {
    const ta = new I18nTranslateAction(I18nTranslateActionType.UPDATE_VALUE);
    ta.key = key;
    ta.value = val;
    return ta;
  }
  /**
   *
   * @param type a type without additional data to report
   * @returns the action according to the type
   */
  public static setupWithoutKeyOrValue(type: I18nTranslateActionType): I18nTranslateAction {
    const ta = new I18nTranslateAction(type);
    return ta;
  }
}
