import { I18nCache } from './I18nCache';
import { I18nLanguages } from './I18nLanguages';
import { I18nTranslateActions } from './I18nTranslateActions';
import { I18nCircleModel } from './I18nCircleModel';
import { I18nHistoryIndex } from './I18nHistoryIndex';
import { I18nIndexStatus } from './I18nIndexStatus';

/**
 * @class I18nOneModule one language module
 * @public
 */
export class I18nOneModule extends I18nHistoryIndex {
  private filepath: string = '';
  private languages: I18nLanguages;

  public getHistoryIndex(): I18nHistoryIndex {
    return this;
  }

  private _createFlag: boolean = true;
  public get createFlag(): boolean {
    return this._createFlag && this.status === I18nIndexStatus.ACTIVE;
  }
  public set createFlag(value: boolean) {
    this._createFlag = value && this.status === I18nIndexStatus.ACTIVE;
  }
  /**
   *
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n i not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(modref: string, lngkey: string, i18n: I18nCircleModel | null): I18nCache | null {
    return this.languages.getLanguageCache(modref, lngkey, i18n);
  }

  /**
   * @constructor
   * create the module with all initializers
   *
   * @param modname - name of the module
   * @param filepath - filepath, wehre the module parameters were loaded from.
   * @param createFlag - if true getOrCreateItem creates missing keys, if false not.
   * @param lng - javascript object to initialize an I18nLanguages object.
   * @private
   */
  private constructor(intName: string, status: I18nIndexStatus, filepath: string, createFlag: boolean, lng: any) {
    super(intName, status);
    this.filepath = filepath;
    this.createFlag = createFlag;
    if (typeof lng === 'object' && lng !== null) {
      this.languages = new I18nLanguages(lng);
    } else {
      this.languages = new I18nLanguages({});
    }
  }
  /**
   *
   * @param data a saved javascript object to initialize the module.
   * @returns the module on success or an error message on failure.
   */
  public static createFromData(modref: string, data: any): I18nOneModule {
    let mod: I18nOneModule;
    if (data.hasOwnProperty('internalName')) {
      mod = new I18nOneModule(
        data.internalName,
        data.status || I18nIndexStatus.ACTIVE,
        data.filePath || '',
        data.createFlag || true,
        data.languages || null,
      );
    } else if (data.hasOwnProperty('externalName')) {
      mod = new I18nOneModule(
        data.externalName,
        data.status || I18nIndexStatus.ACTIVE,
        data.filePath || '',
        data.createFlag || true,
        data.languages || null,
      );
    } else {
      mod = new I18nOneModule(
        modref,
        data.status || I18nIndexStatus.ACTIVE,
        data.filePath || '',
        data.createFlag || true,
        data.languages || null,
      );
    }
    return mod;
  }

  /**
   * gets the module with all languages as javascript object
   * @returns a javascript object
   */
  public getModule(): any {
    return {
      internalName: this.internalName,
      semanticVersion: this.semanticVersion,
      internalVersion: this.internalVersion,
      status: this.status,
      filepath: this.filepath,
      createFlag: this.createFlag,
      languages: this.languages == null ? {} : this.languages.getAllItems(),
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
        this.languages = new I18nLanguages({});
      } else {
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
      this.languages.setItem(lngkey, key, value);
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
   * merge all items with a second javascript object
   *
   * @remarks
   * Keys in the parameter two will overwrite existing key/value pairs in the existing one.
   *
   * @param lngkey - which language to merge in.
   * @param other - the OneLanugage or key/value pairs object to merge.
   * @alpha (data type checks?, add TransalteActions/Subject
   */
  public mergeItems(lngkey: string, other: any): void {
    if (this.languages != null) {
      this.languages.mergeItems(lngkey, other);
    }
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
  public checkConsistency(modref: string): I18nTranslateActions {
    return this.languages.compareLanguages(modref, this.languages, modref);
  }
}
