import { I18nCache } from './I18nCache';
import { I18nChangeAction, I18nChangeActionType } from './I18nChangeAction';
import { I18nCircleModel } from './I18nCircleModel';
import { I18nContext } from './I18nContext';
import { I18nOneModule } from './I18nOneModule';

export class I18nOneProject {
  private modules: any = {};
  private _createFlag: boolean = true;
  public get createFlag(): boolean {
    return this._createFlag;
  }

  public set createFlag(flag: boolean) {
    if (this._createFlag !== flag) {
      I18nChangeAction.publishChange(
        I18nChangeActionType.CREATE_FLAG,
        flag ? 'Activating Changes in Project' : 'Deactivation Changes in Project',
        this.defaultContext,
        'I18nOneProject.createFlag',
        this._createFlag ? 'true' : 'false',
        flag ? 'true' : 'false',
      );
      this._createFlag = flag;
    }
  }
  private _defaultContext: I18nContext;
  public get defaultContext(): I18nContext {
    return this._defaultContext;
  }
  public set defaultContext(value: I18nContext) {
    this._defaultContext = value;
  }

  public constructor(prjname: string = 'defaultproject') {
    this._defaultContext = I18nContext.getContext(prjname);
  }
  /**
   * gets the project with all modules as javascript object
   * @returns a javascript object
   */
  public getProjectItem(): any {
    const all: any = {};
    all.modules = {};
    for (const modref in this.modules) {
      if (this.modules.hasOwnProperty(modref)) {
        const mod: I18nOneModule = this.modules[modref];
        all.modules[modref] = mod.getModuleItem();
      }
    }
    all.createFlag = this.createFlag;
    return all;
  }

  /**
   *
   * @param data a saved javascript object to initialize the module.
   * @returns the module on success or an error message on failure.
   */
  public static createFromData(prjname: string, data: any, context: I18nContext): I18nOneProject {
    I18nChangeAction.publishChange(
      I18nChangeActionType.CREATE_PROJECT,
      'Create one project',
      context,
      'I18nOneProject.createFromData',
      undefined,
      prjname,
    );
    const prj = new I18nOneProject(prjname);
    prj.createFlag = true;
    if (typeof data.modules !== 'undefined') {
      Object.keys(data.modules).forEach((mod) => {
        if (data.modules.hasOwnProperty(mod)) {
          prj.addModule(mod, data.modules[mod]);
        }
      });
    }
    prj.createFlag = data.createFlag;
    return prj;
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
  public getLanguageCache(modref: string, lngkey: string, i18n: I18nCircleModel | null): I18nCache | null {
    const mod: I18nOneModule = this.getModule(modref);
    return mod.getLanguageCache(modref, lngkey, i18n);
  }
}
