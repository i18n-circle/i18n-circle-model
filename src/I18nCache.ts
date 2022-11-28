import { Subject } from 'rxjs';
import { I18nTranslateAction } from './I18nTranslateAction';
import { I18nTranslateActionType } from './I18nTranslateActionType';
import { I18nCircleModel } from './I18nCircleModel';
import { I18nContext } from './I18nContext';

/**
 * this class contains all key and values for one specifc module in a specifc language.
 * This cache provides a program module a direct access to the values without
 * the nested calls from the other objects.
 */

export class I18nCache {
  private i18n: I18nCircleModel | null = null; // is null when no createflag
  private modref: string = '';
  private lngkey: string = '';
  private lngmap: any = {};
  private context: I18nContext;

  /**
   *
   * @param modref the module reference
   * @param lngkey the language key
   * @param onelng the key value javascript object
   * @param context the related language context.
   * @param i18nCircle if not null, it's an active createflag
   * @param subject the parent subject to track changes there
   */
  constructor(
    modref: string,
    lngkey: string,
    onelng: any,
    context: I18nContext,
    i18nCircle: I18nCircleModel | null,
    subject: Subject<I18nTranslateAction>,
  ) {
    this.modref = modref;
    this.lngkey = lngkey;
    this.lngmap = onelng;
    this.context = context;
    this.i18n = i18nCircle;
    // console.log("I18nCache-init",modref,lngkey,onelng,i18nCircle?true:false);
    subject.subscribe((action: I18nTranslateAction) => {
      const key = action.getKey();
      const value = action.getValue();
      switch (action.queryActionType()) {
        case I18nTranslateActionType.UPDATE_VALUE:
        case I18nTranslateActionType.NEW_KEY:
          if (typeof key === 'string' && typeof value === 'string') {
            this.lngmap[key] = value;
          }
          return;
        case I18nTranslateActionType.DEL_KEY:
          if (typeof key === 'string') {
            delete this.lngmap[key];
          }
          return;
      }
    });
  }
  /**
   * ue local cache providing values. if not existent the i18n object is asked to create
   * @param key the key in the key/value map.
   * @returns the value if found or the key if not
   */
  public get(key: string): string {
    if (this.lngmap.hasOwnProperty(key)) {
      return this.lngmap[key];
    }
    if (this.i18n != null) {
      return this.i18n.get(this.modref, this.lngkey, key);
    }
    return key;
  }
  /**
   *
   * @param key the key to look for
   * @returns true if in this cache.
   */
  public hasKey(key: string): boolean {
    return this.lngmap.hasOwnProperty(key);
  }
  /**
   *
   * @returns the size of the used cache
   */
  public getSize(): number {
    return Object.keys(this.lngmap).length;
  }
}
