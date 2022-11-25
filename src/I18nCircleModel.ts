import { Observable, Subject, Subscription } from 'rxjs';
import { I18nCache } from './I18nCache';
import { I18nChangeAction, I18nChangeActionType } from './I18nChangeAction';
import { I18nContext } from './I18nContext';
import { I18nOneModule } from './I18nOneModule';

export class I18nCircleModel {
  private modules: any = {};
  private _createFlag: boolean = true;
  public get createFlag(): boolean {
    return this._createFlag;
  }
  public set createFlag(flag: boolean) {
    if (this._createFlag !== flag) {
      I18nChangeAction.publishChange(
        I18nChangeActionType.CREATE_FLAG,
        flag ? 'Activating Changes in Language Module' : 'Deactivation Changes in Language Module',
        this.defaultContext,
        'I18nCircleModel.createFlag',
        this._createFlag ? 'true' : 'false',
        flag ? 'true' : 'false',
      );
      this._createFlag = flag;
    }
  }
  private _defaultContext: I18nContext = I18nContext.getContext('defaultproject');
  public get defaultContext(): I18nContext {
    return this._defaultContext;
  }
  public set defaultContext(value: I18nContext) {
    this._defaultContext = value;
  }

  /**
   *
   * @param readonly if true, everything is on readonly.
   * @param readAndWrite if readonly false and this is true, all can be changed.
   * @returns true if somethng was changed.
   */
  public forceReadAndWrite(readonly: boolean, readAndWrite: boolean): boolean {
    let change = false;
    if (readonly) {
      this.createFlag = false;
      change = true;
    } else if (readAndWrite) {
      this.createFlag = true;
      change = true;
    }
    if (!change) return false;
    const modrefs: string[] = this.getModuleReferences();
    modrefs.forEach((modref) => {
      const mod = this.getModule(modref);
      mod.createFlag = this.createFlag;
    });
    return true;
  }

  /**
   *
   * @param modref the reference to the model
   * @param moddata the full data as javascrpt object
   * @returns the newly added module itself
   */
  public addModule(modref: string, moddata: any): I18nOneModule {
    const mod: I18nOneModule = I18nOneModule.createFromData(modref, moddata, this.defaultContext.extendProject(modref));
    this.modules[modref] = mod;
    return mod;
  }

  public getModule(modref: string): I18nOneModule {
    let mod: I18nOneModule;
    if (this.modules.hasOwnProperty(modref)) {
      mod = this.modules[modref];
    } else {
      if (this.createFlag) {
        mod = this.addModule(modref, {});
      } else {
        throw new Error('New Modul without createFlag: ' + modref);
      }
    }
    return mod;
  }
  /**
   * sets or merge a language collection of key/value-pairs
   *
   * @param modref - the module reference
   * @param lngkey - the language key e.g. 'en'
   * @param lngmap - the javascript object to initialize.
   */
  public addLanguage(modref: string, lngkey: string, lngdata: any): void {
    try {
      const mod: I18nOneModule = this.getModule(modref);
      mod.addLanguage(lngkey, lngdata, this.createFlag);
    } catch (error) {
      // TODO console.warn(error);
    }
  }
  /**
   *
   * @returns a list of module references
   */
  public getModuleReferences(): string[] {
    return Object.keys(this.modules);
  }

  /**
   *
   * @param modref the module reference
   * @param lngkey langauge key
   * @param key the key
   * @returns the language value if existent or the key if not.
   */
  public get(modref: string, lngkey: string, key: string): string {
    let mod: I18nOneModule;
    let val: string;
    if (this.modules.hasOwnProperty(modref)) {
      mod = this.modules[modref];
      val = mod.getOrCreateItem(lngkey, key);
      return val;
    }
    if (!this.createFlag) {
      return key;
    }
    mod = this.addModule(modref, {});
    mod.addLanguage(lngkey, {});
    val = mod.getOrCreateItem(lngkey, key);
    return val;
  }

  public hasKey(modref: string, lngkey: string, key: string): boolean {
    try {
      const mod: I18nOneModule = this.getModule(modref);
      return mod ? mod.hasKey(lngkey, key) : false;
    } catch (error) {
      // TODO console.warn(error);
      return false;
    }
  }

  /**
   *
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n if not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(modref: string, lngkey: string): I18nCache | null {
    const mod: I18nOneModule = this.getModule(modref);
    return mod.getLanguageCache(modref, lngkey, this.createFlag ? this : null);
  }

  private static changeSubject: Subject<I18nChangeAction> | undefined;

  public static publishChange(ta: I18nChangeAction): void {
    if (typeof this.changeSubject === 'undefined') {
      this.changeSubject = new Subject<I18nChangeAction>();
    }
    this.changeSubject.next(ta);
  }
  public static subscribeChange(): Subject<I18nChangeAction> {
    if (typeof this.changeSubject === 'undefined') {
      this.changeSubject = new Subject<I18nChangeAction>();
    }
    return this.changeSubject;
  }
}
