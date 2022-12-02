import { I18nTranslateActionType } from './I18nTranslateActionType';

/**
 * @class for one Translate action
 * @see I18nTranslateActions for interfacing functions.
 * @public
 */

export class I18nTranslateAction {
  private _actionType: I18nTranslateActionType = I18nTranslateActionType.NO_OP;
  public get actionType(): I18nTranslateActionType {
    return this._actionType;
  }
  private _sourceMod?: string | undefined;
  public get sourceMod(): string | undefined {
    return this._sourceMod;
  }
  private _sourceLngKey?: string | undefined;
  public get sourceLngKey(): string | undefined {
    return this._sourceLngKey;
  }
  private _targetMod?: string | undefined;
  public get targetMod(): string | undefined {
    return this._targetMod;
  }
  private _targetLngKey?: string | undefined;
  public get targetLngKey(): string | undefined {
    return this._targetLngKey;
  }
  private _key?: string | undefined;
  public get key(): string | undefined {
    return this._key;
  }
  private _value?: string | undefined;
  public get value(): string | undefined {
    return this._value;
  }
  private constructor(actionType: I18nTranslateActionType) {
    this._actionType = actionType;
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
    this._sourceMod = sourceMod;
    this._sourceLngKey = sourceLngKey;
    this._targetMod = targetMod;
    this._targetLngKey = targetLngKey;
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
    ta._key = key;
    ta._value = val;
    return ta;
  }
  /**
   *
   * @param key the key to delete
   * @returns the DelKey Action
   */
  public static setupDelKey(key: string): I18nTranslateAction {
    const ta = new I18nTranslateAction(I18nTranslateActionType.DEL_KEY);
    ta._key = key;
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
    ta._key = key;
    ta._value = val;
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
