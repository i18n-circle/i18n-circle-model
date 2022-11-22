import { I18nCache } from './I18nCache';
import { I18nOneLanguage } from './I18nOneLanguage';
import { I18nOperationMode } from './I18nOperationMode';
import { I18nTranslateActions } from './I18nTranslateActions';
import { I18nCircleModel } from './I18nCircleModel';

/**
 * @class for a collection of Languages
 * @public
 */

export class I18nLanguages {
  private lngs: any = {};
  private defaultLng: string = 'en';

  /**
   *
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n i not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(modref: string, lngkey: string, i18n: I18nCircleModel | null): I18nCache | null {
    if (this.lngs.hasOwnProperty(lngkey)) {
      const lng: I18nOneLanguage = this.lngs[lngkey];
      return lng.getLanguageCache(modref, lngkey, i18n);
    } else {
      return null;
    }
  }

  /**
   * sets or merge a language collection of key/value-pairs
   *
   * @param lngkey - the language key e.g. 'en'
   * @param lngmap - the javascript object to initialize.
   */
  public addLanguage(lngkey: string, lngmap: any) {
    // console.log("add_language-1",lngkey,lngmap,this.lngs);
    if (this.lngs.hasOwnProperty(lngkey)) {
      this.lngs[lngkey].mergeItems(lngmap);
      // console.log("add_language-2",this.lngs);
    } else {
      this.lngs[lngkey] = new I18nOneLanguage(lngmap);
    }
  }
  /**
   * @constructor
   * @param allLanguages - sets the all data within
   */
  constructor(allLanguages: any) {
    if (typeof allLanguages === 'object' && allLanguages !== null) {
      if (allLanguages.hasOwnProperty('defaultLanguage')) {
        this.defaultLng = allLanguages.defaultLanguage;
      }
      if (allLanguages.hasOwnProperty(this.defaultLng)) {
        this.addLanguage(this.defaultLng, allLanguages[this.defaultLng]);
      } else {
        this.addLanguage(this.defaultLng, {});
      }
      for (const lkey in allLanguages) {
        if (allLanguages.hasOwnProperty(lkey) && lkey !== 'defaultLanguage' && lkey !== this.defaultLng) {
          this.addLanguage(lkey, allLanguages[lkey]);
        }
      }
    }
  }
  /**
   * hasLanguage checks if a language key is existent
   */
  public hasLanguage(lngkey: string): boolean {
    return this.lngs.hasOwnProperty(lngkey);
  }
  /**
   * hasKey checks if the language and the key is existent in that language.
   *
   * @param lngkey - The language key to search for
   * @param key - The key in that language.
   */
  public hasKey(lngkey: string, key: string): boolean {
    return this.lngs.hasOwnProperty(lngkey) && this.lngs[lngkey].hasKey(key);
  }
  /**
   * get one item via lngkey and key
   * @param lngkey - the lngkey e.g 'en','de'
   * @param key - the key text in the default language
   *
   * @returns the found value or the key if not existent.
   */
  public getItem(lngkey: string, key: string): string {
    if (this.hasKey(lngkey, key)) {
      return this.lngs[lngkey].getItem(key);
    } else {
      return key;
    }
  }
  /**
   * get one item via lngkey and key.
   * If key is not found, it tries to create an entry in the default language (including history)
   *
   * @param lngkey - the lngkey e.g 'en','de'
   * @param key - the key text in the default language
   *
   * @returns the found value or the key if not existent.
   */
  public getOrCreateItem(lngkey: string, key: string): string {
    if (this.hasKey(lngkey, key)) {
      return this.lngs[lngkey].getItem(key);
    } else {
      const tlng: I18nOneLanguage = this.lngs[this.defaultLng];
      tlng.setItem(key, key);
      return key;
    }
  }
  /**
   * Sets a key/value pair, if not existent and tracks a history of keys.
   *
   * @param lngkey - the language key to set (e.g 'en','de')
   * @param key - the key (text in default language)
   * @param value - The text in the current language.
   */
  public setItem(lngkey: string, key: string, value: string): void {
    if (!this.lngs.hasOwnProperty(lngkey)) {
      this.lngs[lngkey] = new I18nOneLanguage({});
    }
    this.lngs[lngkey].setItem(key, value);
  }
  /**
   *
   * @param lngkey - current language to delete in
   * @param key - key to delete
   *
   */
  public deleteItem(lngkey: string, key: string): void {
    if (!this.lngs.hasOwnProperty(lngkey)) {
      return; // no action
    }
    this.lngs[lngkey].deleteItem(key);
  }
  /**
   *
   * @param lngkey language to empty.
   */
  public emptyItems(lngkey: string): void {
    if (this.lngs.hasOwnProperty(lngkey)) {
      this.lngs[lngkey].emptyItems();
    }
  }
  /**
   * get all items for one language key
   *
   * @param lngkey - the language key e.g. 'en','de'
   * @returns the javascript object representing the languange key/value pairs.
   */
  public getItems(lngkey: string): any {
    if (this.lngs.hasOwnProperty(lngkey)) {
      return this.lngs[lngkey].getItems();
    } else {
      return {};
    }
  }
  /**
   * get all items for all language keys
   *
   * @returns the javascript object representing all lanugages
   */
  public getAllItems(): any {
    const all: any = {};
    for (const lngkey in this.lngs) {
      if (this.lngs.hasOwnProperty(lngkey)) {
        all[lngkey] = this.lngs[lngkey].getItems();
      }
    }
    all.defaultLanguage = this.defaultLng;
    return all;
  }

  /**
   * merge all items with a second javascript object
   *
   * @remarks
   * Keys in the parameter two will overwrite existing key/value pairs in the existing one.
   *
   * @param lngkey - which language to merge in.
   * @param other - the OneLanugage or key/value pairs object to merge.
   * @alpha (data type checks?)
   */
  public mergeItems(lngkey: string, other: any): void {
    if (this.lngs.hasOwnProperty(lngkey)) {
      this.lngs[lngkey].mergeItems(other);
    }
  }
  /**
   *
   * @param lngkey the language to get the keys from
   * @returns a string list of keys.
   */
  public getLanguageKeys(lngkey: string): string[] {
    if (this.lngs.hasOwnProperty(lngkey)) {
      return this.lngs[lngkey].getKeys();
    }
    return [];
  }

  /**
   * compares two collections of I18nLanguages and produces an action list
   * @param srcmod module name of this source
   * @param target target langauges to compare with
   * @param targetmod module name of that target
   * @returns list of Transactions
   */
  public compareLanguages(srcmod: string, target: I18nLanguages, targetmod: string): I18nTranslateActions {
    I18nTranslateActions.deleteKeys();
    const result: I18nTranslateActions = new I18nTranslateActions(
      srcmod,
      this.defaultLng,
      targetmod,
      target.defaultLng,
    );
    let tal: I18nTranslateActions;
    if (this.defaultLng !== target.defaultLng) {
      result.setupMismatchDefaultLanguage();
      return result;
    }
    // 1) compare default langages with values.
    let l1: I18nOneLanguage = this.lngs[this.defaultLng];
    let l2: I18nOneLanguage = target.lngs[this.defaultLng];
    tal = l2.comparePairs(srcmod, this.defaultLng, l1, targetmod, this.defaultLng, I18nOperationMode.DEFAULT_LNG);
    result.appendOther(tal);
    // 2) compare keys for all target languages:
    for (const lngkey in target.lngs) {
      if (target.hasLanguage(lngkey) && lngkey !== this.defaultLng) {
        if (!this.hasLanguage(lngkey)) {
          // 2a: new languages
          tal = new I18nTranslateActions(srcmod, this.defaultLng, targetmod, lngkey);
          tal.setupNewLanguage();
          result.appendOther(tal);
          l1 = this.lngs[this.defaultLng];
          l2 = target.lngs[lngkey]; // 2b: new keys from defaultlng
          tal = l1.comparePairs(
            srcmod,
            this.defaultLng,
            l2,
            targetmod,
            lngkey,
            I18nOperationMode.NEW_KEYS_FROM_DEFAULT,
          );
          result.appendOther(tal);
        } else {
          l1 = this.lngs[this.defaultLng];
          l2 = target.lngs[lngkey]; // 2b: new keys from defaultlng
          tal = l1.comparePairs(
            srcmod,
            this.defaultLng,
            l2,
            targetmod,
            lngkey,
            I18nOperationMode.NEW_KEYS_FROM_DEFAULT,
          );
          result.appendOther(tal);
        }
        if (this.hasLanguage(lngkey)) {
          l1 = this.lngs[lngkey]; // 2c update keys and values same lngkey
          l2 = target.lngs[lngkey];
          tal = l1.comparePairs(srcmod, lngkey, l2, targetmod, lngkey, I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG);
          result.appendOther(tal);
        }
      }
    }
    // 3) delete no longer existing languages:
    for (const lngkey in this.lngs) {
      if (this.hasLanguage(lngkey) && !target.hasLanguage(lngkey)) {
        tal = new I18nTranslateActions(srcmod, this.defaultLng, targetmod, lngkey);
        tal.setupDelLanguage();
        result.appendOther(tal);
      }
    }
    return result;
  }
  /**
   *
   * @param modref the external model reference to use
   * @returns a list of actions to achieve consistency.
   */
  public checkConsistency(modref: string): I18nTranslateActions {
    return this.compareLanguages(modref, this, modref);
  }
}
