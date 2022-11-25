import { Subject } from 'rxjs';
import { I18nCache } from './I18nCache';
import { I18nTranslateAction } from './I18nTranslateAction';
import { I18nTranslateActions } from './I18nTranslateActions';
import { I18nCircleModel } from './I18nCircleModel';
import { I18nContext } from './I18nContext';
import { I18nChangeAction, I18nChangeActionType } from './I18nChangeAction';

/**
 * @class
 * Represents data and functions dedicated for all key/value pairs of a language
 * @public
 */

export class I18nOneLanguage {
  private onelng: any = {};
  private subject: Subject<I18nTranslateAction>;
  private context: I18nContext;

  /**
   *
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n i not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(
    modref: string,
    lngkey: string,
    context: I18nContext,
    i18n: I18nCircleModel | null,
  ): I18nCache {
    const cache = new I18nCache(modref, lngkey, this.onelng, context, i18n, this.subject);
    return cache;
  }

  /**
   * Sets a key/value pair, if not existent and tracks a history of keys.
   *
   * @param key - the key (text in default language)
   * @param value - The text in the current language.
   */
  public setItem(key: string, value: string) {
    const existFlag: boolean = this.onelng.hasOwnProperty(key);
    let action: I18nTranslateAction;
    if (existFlag && this.onelng[key] === value) {
      return; // no change ==> no history!!
    }
    I18nChangeAction.publishChange(
      I18nChangeActionType.SET_ITEM,
      'Set item value for one key',
      this.context.extendLanguage(key),
      'I18nOneLanguage.setItem',
      this.onelng[key],
      value,
    );
    this.onelng[key] = value;
    action = existFlag ? I18nTranslateAction.setupUpdateValue(key, value) : I18nTranslateAction.setupNewKey(key, value);
    this.subject.next(action);
  }
  /**
   * Gets the value of a key/value pair, if existent or key targetwise.
   *
   * @param key - the language key (text in default language)
   * @returns The text in the current language or the key if not available
   */
  public getItem(key: string): string {
    if (this.onelng.hasOwnProperty(key)) {
      return this.onelng[key];
    }
    return key;
  }
  /**
   * Check existence of a key
   *
   * @param key - the key (text in default language)
   * @returns true if exists, false if not.
   */
  public hasKey(key: string) {
    return this.onelng.hasOwnProperty(key);
  }
  /**
   * Deletes a key/value pair
   *
   * @param key - the key (text in default language)
   */
  public deleteItem(key: string) {
    if (!this.hasKey(key)) {
      return; // no change.
    }
    I18nChangeAction.publishChange(
      I18nChangeActionType.DELETE_ITEM,
      'Delete one item value for one key',
      this.context.extendLanguage(key),
      'I18nOneLanguage.deleteItem',
      this.onelng[key],
      undefined,
    );
    delete this.onelng[key];
    const action: I18nTranslateAction = I18nTranslateAction.setupDelKey(key);
    this.subject.next(action);
  }
  /**
   * reset to an empty data set
   */
  public emptyItems() {
    this.onelng = {};
  }
  /**
   * set all items with an javascript object e.g. from a file
   *
   * @param one - the javascript object to read.
   */
  public setItems(one: any) {
    if (typeof one === 'object' && one !== null) {
      for (const key in one) {
        if (one.hasOwnProperty(key)) {
          this.setItem(key, one[key]);
        }
      }
    }
  }
  /**
   * merge all items with a second javascript object
   *
   * @remarks
   * Keys in the parameter two will overwrite existing key/value pairs in the existing one.
   *
   * @param two - the javascript object to merge.
   * @alpha (data type checks?)
   */
  public mergeItems(two: any): void {
    // console.log("merge.1",this,two);
    if (two.hasOwnProperty('onelng')) {
      this.onelng = { ...this.onelng, ...two.onelng };
    } else {
      this.onelng = { ...this.onelng, ...two };
    }
    // console.log("merge-2",this);
    // this.onelng = Object.assign(this.onelng,two.onelng);
    // Object.assign(obj1, obj2);
  }
  /**
   * get all items from this language
   *
   * @returns the javascript object
   */
  public getItems(): any {
    return this.onelng;
  }
  /**
   *
   * @returns a string list of all keys within this key/value pairs object
   */
  public getKeys(): string[] {
    return Object.keys(this.onelng);
  }
  /**
   * compare this OneLanguage Object(master) with antarget one and creates actions to update the target object (target space)
   *
   * @param srcmod - the module we are operating in.
   * @param srclng - the language key, wa are operating in
   * @param target - the slave object to compare
   * @param targetmod - the module we are operating in.
   * @param targetlng - the language key, wa are operating in
   * @param valueFlag - if true, also the values are compared if true only keys are compared
   * @returns an Object of I18nTranslateActions
   */
  public comparePairs(
    srcmod: string,
    srclng: string,
    target: I18nOneLanguage,
    targetmod: string,
    targetlng: string,
    opMode: number,
  ): I18nTranslateActions {
    const tal = new I18nTranslateActions(srcmod, srclng, targetmod, targetlng);
    for (const key in this.onelng) {
      if (this.hasKey(key) && !target.hasKey(key)) {
        tal.setupNewKey(key, target.getItem(key), opMode);
      } else if (this.hasKey(key) && this.onelng[key] !== target.getItem(key)) {
        tal.setupUpdateValue(key, this.getItem(key), opMode);
      }
    }
    const tarr = target.getKeys();
    for (const rkey of tarr) {
      if (target.hasKey(rkey) && !this.hasKey(rkey)) {
        tal.setupDelKey(rkey, opMode);
      }
    }
    return tal;
  }
  /**
   * @constructor
   *
   * @param one - javascirpt object toinitialize via setItems
   */
  constructor(one: any, context: I18nContext) {
    this.context = context;
    this.subject = new Subject<I18nTranslateAction>();
    this.setItems(one);
  }
}
