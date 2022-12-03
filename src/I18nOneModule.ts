import { I18nCache } from './I18nCache';
import { I18nLanguages } from './I18nLanguages';
import { I18nTranslateActions } from './I18nTranslateActions';
import { I18nCircleModel } from './I18nCircleModel';
import { I18nHistoryIndex } from './I18nHistoryIndex';
import { I18nIndexStatus } from './I18nIndexStatus';
import { I18nContext } from './I18nContext';
import { I18nChangeAction, I18nChangeActionType } from './I18nChangeAction';
import { I18nModuleDisplayItem } from './I18nModuleDisplayItem';

/**
 * @class I18nOneModule one language module
 * @public
 */
export class I18nOneModule extends I18nHistoryIndex {
  private languages: I18nLanguages;
  private context: I18nContext;

  public get defaultLng(): string {
    return this.languages.defaultLng;
  }
  /**
   *
   * @returns gets an representation of the Hinstory Index (parent class)
   */
  public getHistoryIndex(): I18nHistoryIndex {
    return this;
  }

  private _createFlag: boolean = true;
  public get createFlag(): boolean {
    return this._createFlag && this.status === I18nIndexStatus.ACTIVE;
  }
  public set createFlag(value: boolean) {
    const flag: boolean = value && this.status === I18nIndexStatus.ACTIVE;
    if (this._createFlag !== flag) {
      I18nChangeAction.publishChange(
        I18nChangeActionType.CREATE_FLAG,
        flag ? 'Activating Changes in OneModule' : 'Deactivation Changes in OneModule',
        this.context,
        'I18nOneModule.createFlag',
        this._createFlag ? 'true' : 'false',
        flag ? 'true' : 'false',
      );
      this._createFlag = flag;
    }
  }
  /**
   * @param prjname current project name
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n i not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(
    prjname: string,
    modref: string,
    lngkey: string,
    i18n: I18nCircleModel | null,
  ): I18nCache | null {
    return this.languages.getLanguageCache(prjname, modref, lngkey, i18n);
  }

  /**
   * @constructor
   * create the module with all initializers
   *
   * @param intName - internal name.
   * @param status - Indexstatus
   * @param createFlag - if true getOrCreateItem creates missing keys, if false not.
   * @param lng - javascript object to initialize an I18nLanguages object.
   * @param context the project and module context for this module
   * @private
   */
  private constructor(intName: string, status: I18nIndexStatus, createFlag: boolean, lng: any, context: I18nContext) {
    super(intName, status);
    this.createFlag = createFlag;
    this.context = context;
    if (typeof lng === 'object' && lng !== null) {
      this.languages = new I18nLanguages(lng, context);
    } else {
      this.languages = new I18nLanguages({}, context);
    }
    I18nChangeAction.publishChange(
      I18nChangeActionType.MODULE_CREATED,
      'Module created',
      this.context,
      'I18nOneModule.constructor',
      undefined,
      this.internalName,
    );
  }
  /**
   *
   * @param data a saved javascript object to initialize the module.
   * @returns the module on success or an error message on failure.
   */
  public static createFromData(modref: string, data: any, context: I18nContext): I18nOneModule {
    let mod: I18nOneModule;
    I18nChangeAction.publishChange(
      I18nChangeActionType.CREATE_MODULE,
      'Create one module',
      context,
      'I18nOneModule.createFromData',
      undefined,
      modref,
    );
    if (data.hasOwnProperty('internalName')) {
      mod = new I18nOneModule(
        data.internalName,
        data.status || I18nIndexStatus.ACTIVE,
        data.createFlag || true,
        data.languages || null,
        context,
      );
    } else if (data.hasOwnProperty('externalName')) {
      mod = new I18nOneModule(
        data.externalName,
        data.status || I18nIndexStatus.ACTIVE,
        data.createFlag || true,
        data.languages || null,
        context,
      );
    } else {
      mod = new I18nOneModule(
        modref,
        data.status || I18nIndexStatus.ACTIVE,
        data.createFlag || true,
        data.languages || null,
        context,
      );
    }
    return mod;
  }

  /**
   * gets the module with all languages as javascript object
   * @returns a javascript object
   */
  public getModuleItem(): any {
    return {
      internalName: this.internalName,
      semanticVersion: this.semanticVersion,
      internalVersion: this.internalVersion,
      status: this.status,
      createFlag: this.createFlag,
      languages: this.languages == null ? {} : this.languages.getAllItems(),
    };
  }

  /**
   * @returns a module display item with modid and modLngKeys
   */
  public getModuleDisplayItem(): I18nModuleDisplayItem {
    return {
      modId: this.internalName,
      modLngKeys: this.getLanguagesKeys(),
    };
  }

  /**
   * get one item via lngkey and key.
   * If key is not found, it tries to create an entry in the default language (including history)
   * only if the creatFlag in this module is set.
   *
   * @param lngkey - the lngkey e.g 'en','de'
   * @param key - the key text in the default language
   *
   * @returns the found value or the key if not existent.
   */
  public getOrCreateItem(lngkey: string, key: string): string {
    if (this.languages != null) {
      if (this.createFlag) {
        const val: string = this.languages.getOrCreateItem(lngkey, key);
        return val;
      } else {
        return this.languages.getItem(lngkey, key);
      }
    }
    I18nChangeAction.publishChange(
      I18nChangeActionType.NO_LANGUAGES_OBJECT_KEY_NOT_FOUND,
      'Get or create item failed.',
      this.context.extendModule(lngkey).extendLanguage(key),
      'I18nOneModule.getOrCreateItem',
      undefined,
      key,
    );
    return key;
  }
  /**
   * sets or merge a language collection of key/value-pairs
   *
   * @param lngkey - the language key e.g. 'en'
   * @param lngmap - the javascript object to initialize.
   */
  public addLanguage(lngkey: string, lngmap: any, forceCreate: boolean = false) {
    if (this.languages == null) {
      if (this.createFlag || forceCreate) {
        this.languages = new I18nLanguages({}, this.context);
        I18nChangeAction.publishChange(
          I18nChangeActionType.ADD_LANGUAGE_NEW_LANGUAGES,
          'Get or create item failed.',
          this.context.extendModule(lngkey),
          'I18nOneModule.addLanguage',
          undefined,
          lngkey,
        );
      } else {
        I18nChangeAction.publishChange(
          I18nChangeActionType.ADD_LANGUAGE_NO_LANGUAGES_OBJECT,
          'Get or create item failed.',
          this.context.extendModule(lngkey).extendLanguage(lngkey),
          'I18nOneModule.addLanguage',
          undefined,
          lngkey,
        );
        return;
      }
    }
    this.languages.addLanguage(lngkey, lngmap);
  }
  /**
   * hasLanguage checks if a language key is existent
   */
  public hasLanguage(lngkey: string): boolean {
    return this.languages == null ? false : this.languages.hasLanguage(lngkey);
  }

  /**
   *
   * @returns an array of used language keys,
   */
  public getLanguagesKeys(): string[] {
    return this.languages == null ? [] : this.languages.getLanguagesKeys();
  }
  /**
   * hasKey checks if the language and the key is existent in that language.
   *
   * @param lngkey - The language key to search for
   * @param key - The key in that language.
   */
  public hasKey(lngkey: string, key: string): boolean {
    return this.languages == null ? false : this.languages.hasKey(lngkey, key);
  }
  /**
   * Sets a key/value pair, if not existent and tracks a history of keys.
   *
   * @param lngkey - the language key to set (e.g 'en','de')
   * @param key - the key (text in default language)
   * @param value - The text in the current language.
   */
  public setItem(lngkey: string, key: string, value: string): void {
    if (this.languages != null) {
      // console.log("OneM-setItem-1: lng:",lngkey,"key:",key,"value:",value);
      this.languages.setItem(lngkey, key, value);
    } else {
      I18nChangeAction.publishChange(
        I18nChangeActionType.SET_ITEM_NO_LANGUAGES_OBJECT,
        'Set item failed, no languages object.',
        this.context.extendModule(lngkey).extendLanguage(lngkey),
        'I18nOneModule.setItem',
        undefined,
        lngkey,
      );
    }
  }
  /**
   *
   * @param lngkey - current language to delete in
   * @param key - key to delete
   *
   */
  public deleteItem(lngkey: string, key: string): void {
    if (this.languages != null) {
      this.languages.deleteItem(lngkey, key);
    }
  }
  /**
   *
   * @param lngkey language to empty.
   * @alpha TODO: add TranslateAction/subject...
   */
  public emptyItems(lngkey: string): void {
    if (this.languages != null) {
      this.languages.emptyItems(lngkey);
    }
  }
  /**
   * get all items for one language key
   *
   * @param lngkey - the language key e.g. 'en','de'
   * @returns the javascript object representing the languange key/value pairs.
   */
  public getItems(lngkey: string): any {
    return this.languages == null ? {} : this.languages.getItems(lngkey);
  }
  /**
   * get all items for all language keys
   *
   * @returns the javascript object representing all lanugages
   */
  public getAllItems(): any {
    return this.languages == null ? {} : this.languages.getAllItems();
  }

  /**
   *
   * @param lngkey the language to get the keys from
   * @returns a string list of keys.
   */
  public getLanguageKeys(lngkey: string): string[] {
    return this.languages == null ? [] : this.languages.getLanguageKeys(lngkey);
  }
  /**
   * compares two collections of I18nLanguages and produces an action list
   * @param srcmod module name of this source
   * @param target target langauges to compare with
   * @param targetmod module name of that target
   * @returns list of Transactions
   */
  public compareLanguages(srcmod: string, target: I18nLanguages, targetmod: string): I18nTranslateActions | null {
    if (this.languages != null) {
      return this.languages.compareLanguages(srcmod, target, targetmod);
    } else {
      return null;
    }
  }
  /**
   *
   * @param modref the external model reference to use
   * @returns a list of actions to achieve consistency.
   */
  public checkConsistency(modref: string): I18nTranslateActions | null {
    return this.languages?.compareLanguages(modref, this.languages, modref) || null;
  }
}
