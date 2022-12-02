import { I18nCache } from './I18nCache';
import { I18nChangeAction, I18nChangeActionType } from './I18nChangeAction';
import { I18nCircleModel } from './I18nCircleModel';
import { I18nContext } from './I18nContext';
import { I18nModuleDisplayItem } from './I18nModuleDisplayItem';
import { I18nOneModule } from './I18nOneModule';
import { I18nProjectDisplayItem } from './I18nProjectDisplayItem';
import { I18nTranslateActions } from './I18nTranslateActions';

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
  /**
   *
   * @param prjname project name to set.
   */
  public constructor(prjname: string = 'defaultproject') {
    this._defaultContext = I18nContext.getContext(prjname);
  }

  /**
   *
   * @returns the current project name.
   */
  getProjectName(): string {
    return this.defaultContext.projectName;
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
  /*
   * getting the current display representation
   * @param lngkey language key
   * @returns get current set of display data
   */
  public getProjectDisplayItem(lngkey: string): I18nProjectDisplayItem {
    return {
      prjId: this.defaultContext.projectName,
      prjShort: this.get('.project', lngkey, 'project shortname'),
      prjDescription: this.get('.project', lngkey, 'project description'),
      prjModuleNames: this.getModuleReferences(),
    };
  }
  /**
   *
   * @param lngkey the language key to address
   * @param item the display item to set.
   */
  public setProjectDisplayItem(lngkey: string, item: I18nProjectDisplayItem) {
    const mod = this.getModule('.project');
    mod.setItem(lngkey, 'project shortname', item.prjShort);
    mod.setItem(lngkey, 'project description', item.prjDescription);
    // rest needs to be adapted in another way.
  }
  /**
   *
   * @param modname name of the module to display
   * @returns the module display item.
   */
  public getModuleDisplayItem(modname: string): I18nModuleDisplayItem {
    const mod = this.getModule(modname);
    return mod.getModuleDisplayItem();
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
        I18nChangeAction.publishChange(
          I18nChangeActionType.NO_GET_MODULE_NO_CREATE_FLAG,
          'GSet one module failed, no create flag',
          this.defaultContext,
          'I18nOneProject.getModule',
          undefined,
          modref,
        );
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
      I18nChangeAction.publishChange(
        I18nChangeActionType.ADD_LANGUAGE_ERROR,
        'In Project module error during adding a language.',
        this.defaultContext,
        'I18nOneProject.addLanguage',
        modref,
        lngkey,
      );
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

  /**
   *
   * @param modref the module reference
   * @param lngkey langauge key
   * @param key the key
   * @param value the value to set
   */
  public set(modref: string, lngkey: string, key: string, value: string) {
    let mod: I18nOneModule;
    if (this.modules.hasOwnProperty(modref)) {
      // console.log("OneP-set-1: mod:",modref,"lng:",lngkey,"key:",key,"value:",value);
      mod = this.modules[modref];
      mod.setItem(lngkey, key, value);
      return;
    }
    if (!this.createFlag) {
      // console.log("OneP-set-2: mod:",modref,"lng:",lngkey,"key:",key,"value:",value);
      I18nChangeAction.publishChange(
        I18nChangeActionType.SET_ITEM_NO_MODULE_FOUND,
        'In Project module error during setting an item.',
        this.defaultContext,
        'I18nOneProject.set',
        modref,
        lngkey,
      );
      return;
    }
    // console.log("OneP-set-3: mod:",modref,"lng:",lngkey,"key:",key,"value:",value);
    mod = this.addModule(modref, {});
    mod.addLanguage(lngkey, {});
    mod.setItem(lngkey, key, value);
  }

  public hasKey(modref: string, lngkey: string, key: string): boolean {
    try {
      const mod: I18nOneModule = this.getModule(modref);
      return mod ? mod.hasKey(lngkey, key) : false;
    } catch (error) {
      return false; // no error reporting, a false is enough.
    }
  }

  /**
   *
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n if not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(
    prjname: string,
    modref: string,
    lngkey: string,
    i18n: I18nCircleModel | null,
  ): I18nCache | null {
    const mod: I18nOneModule = this.getModule(modref);
    return mod.getLanguageCache(prjname, modref, lngkey, i18n);
  }

  /**
   *
   * @param modref if null, all modules are scanned, the existing module otherwise
   * @returns a transaction list to fix the inconsistencies or null if valid
   */
  public checkConsistency(modref: string | null): I18nTranslateActions | null {
    if (modref != null && typeof modref === 'string' && this.modules.hasOwnProperty(modref)) {
      return this.getModule(modref).checkConsistency(modref) || null;
    }
    if (modref != null) {
      return null;
    }
    let tal: I18nTranslateActions | null = null;
    const allLngCounter: any = {};
    const allModCounter: any = {};
    const allLng: string[] = [];
    this.getModuleReferences().forEach((refval: string) => {
      const mod = this.getModule(refval);
      const newTal = mod.checkConsistency(refval) || null;
      if (newTal != null) {
        if (tal == null) {
          tal = newTal;
        } else {
          tal.appendOther(newTal);
        }
      }
      const modlng = mod.getLanguagesKeys();
      allModCounter[refval] = modlng.length;
      modlng.forEach((lngkey: string) => {
        if (!allLngCounter.hasOwnProperty(lngkey)) {
          allLngCounter[lngkey] = 1;
          allLng.push(lngkey);
        } else {
          allLngCounter[lngkey]++;
        }
      });
    });
    Object.keys(allModCounter).forEach((refval) => {
      const mod = this.getModule(refval);
      const modlng = mod.getLanguagesKeys();
      if (allModCounter[refval] !== allLng.length) {
        allLng.forEach((lngkey: string) => {
          if (modlng.indexOf(lngkey) === -1) {
            const newTal: I18nTranslateActions | null = new I18nTranslateActions(refval, lngkey, refval, lngkey);
            newTal.setupNewLanguage();
            if (tal == null) {
              tal = newTal;
            } else {
              tal.insertOther(newTal);
            }
          }
        });
      }
    });
    return tal;
  }
}
