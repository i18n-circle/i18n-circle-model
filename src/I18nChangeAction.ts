import { I18nCircleModel } from './I18nCircleModel';
import { I18nContext } from './I18nContext';

/**
 * provides the different action types for changes:
 * NO_ACTION indiccates a non initialized object
 */

export enum I18nChangeActionType {
  NO_ACTION,
  CREATE_FLAG,
  CREATE_MODULE,
  CREATE_DEFAULT_ENTRY,
  MODULE_CREATED,
  DEFAULT_LANGUAGE,
  ALL_LANGUAGES_CREATED,
  SET_ITEM,
  DELETE_ITEM,
  ADD_LANGUAGE,
  CREATE_PROJECT,
  GET_ITEM_KEY_NOT_FOUND,
  NO_LANGUAGES_OBJECT,
  NO_LANGUAGES_OBJECT_KEY_NOT_FOUND,
  ADD_LANGUAGE_NEW_LANGUAGES,
  ADD_LANGUAGE_NO_LANGUAGES_OBJECT,
  SET_ITEM_NO_LANGUAGES_OBJECT,
  NO_GET_MODULE_NO_CREATE_FLAG,
  ADD_LANGUAGE_ERROR,
  SET_ITEM_NO_MODULE_FOUND,
}

/**
 * class for all change actions
 */
export class I18nChangeAction extends I18nContext {
  private actionType: I18nChangeActionType = I18nChangeActionType.NO_ACTION;
  private _msg: string = '';
  public get msg(): string {
    return this._msg;
  }
  private field: string | undefined;
  private oldvalue: string | undefined;
  private value: string | undefined;

  private constructor() {
    super();
  }

  /**
   *
   * @returns the string repesentation of this I18nChangeActionType
   */
  public getActionTypeAsString(): string {
    switch (this.actionType) {
      default:
      case I18nChangeActionType.NO_ACTION:
        return 'NO_ACTION';
      case I18nChangeActionType.CREATE_FLAG:
        return 'CREATE_FLAG';
      case I18nChangeActionType.CREATE_MODULE:
        return 'CREATE_MODULE';
      case I18nChangeActionType.CREATE_DEFAULT_ENTRY:
        return 'CREATE_DEFAULT_ENTRY';
      case I18nChangeActionType.MODULE_CREATED:
        return 'MODULE_CREATED';
      case I18nChangeActionType.DEFAULT_LANGUAGE:
        return 'DEFAULT_LANGUAGE';
      case I18nChangeActionType.ALL_LANGUAGES_CREATED:
        return 'ALL_LANGUAGES_CREATED';
      case I18nChangeActionType.SET_ITEM:
        return 'SET_ITEM';
      case I18nChangeActionType.DELETE_ITEM:
        return 'DELETE_ITEM';
      case I18nChangeActionType.ADD_LANGUAGE:
        return 'ADD_LANGUAGE';
      case I18nChangeActionType.GET_ITEM_KEY_NOT_FOUND:
        return 'GET_ITEM_KEY_NOT_FOUND';
      case I18nChangeActionType.NO_LANGUAGES_OBJECT:
        return 'NO_LANGUAGES_OBJECT';
      case I18nChangeActionType.NO_LANGUAGES_OBJECT_KEY_NOT_FOUND:
        return 'NO_LANGUAGES_OBJECT_KEY_NOT_FOUND';
      case I18nChangeActionType.ADD_LANGUAGE_NEW_LANGUAGES:
        return 'ADD_LANGUAGE_NEW_LANGUAGES';
      case I18nChangeActionType.ADD_LANGUAGE_NO_LANGUAGES_OBJECT:
        return 'ADD_LANGUAGE_NO_LANGUAGES_OBJECT';
      case I18nChangeActionType.SET_ITEM_NO_LANGUAGES_OBJECT:
        return 'SET_ITEM_NO_LANGUAGES_OBJECT';
      case I18nChangeActionType.NO_GET_MODULE_NO_CREATE_FLAG:
        return 'NO_GET_MODULE_NO_CREATE_FLAG';
      case I18nChangeActionType.ADD_LANGUAGE_ERROR:
        return 'ADD_LANGUAGE_ERROR';
      case I18nChangeActionType.SET_ITEM_NO_MODULE_FOUND:
        return 'SET_ITEM_NO_MODULE_FOUND';
    }
  }

  /**
   *
   * @returns  the string repesentation of this I18nChangeAction-Object
   */
  public action2String(): string {
    let tmp: string = this.getActionTypeAsString() + ': ';
    tmp += this.contextToString();
    tmp += this.field || '';
    tmp += '(' + (this.oldvalue || '') + '=>' + (this.value || '') + ')=';
    tmp += this.msg;
    return tmp;
  }
  /**
   * Creates and publishes one change action
   * @param actionType The I18nChangeActionType of this action
   * @param msg a message in the defaultlanguage, module reference i18n-circle
   * @param context the context of this change
   * @param field a field name if applicable
   * @param value a value if applicable
   */
  public static publishChange(
    actionType: I18nChangeActionType,
    msg: string,
    context: I18nContext,
    field?: string,
    oldvalue?: string,
    value?: string,
  ) {
    const action: I18nChangeAction = new I18nChangeAction();
    I18nContext.CopyContext(context, action);
    action.actionType = actionType;
    action._msg = msg;
    action.field = field;
    action.oldvalue = oldvalue;
    action.value = value;
    I18nCircleModel.publishChange(action);
  }
}
