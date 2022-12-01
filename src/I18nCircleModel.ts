import { Subject } from 'rxjs';
import { I18nCache } from './I18nCache';
import { I18nChangeAction, I18nChangeActionType } from './I18nChangeAction';
import { I18nContext } from './I18nContext';
import { I18nOneModule } from './I18nOneModule';
import { I18nOneProject } from './I18nOneProject';
import { I18nProjectDisplayItem } from './I18nProjectDisplayItem';

export class I18nCircleModel {
  private defaultProject: I18nOneProject;
  private otherProjects: any = {};

  public constructor(prjname: string = 'defaultproject') {
    this.defaultProject = new I18nOneProject(prjname);
  }

  public setDefaultProject(prjname: string, prjdata: any): I18nOneProject {
    const context: I18nContext = I18nContext.getContext(prjname);
    const prj: I18nOneProject = I18nOneProject.createFromData(prjname, prjdata, context);
    this.defaultProject = prj;
    return prj;
  }

  public addProject(prjname: string, prjdata: any): I18nOneProject {
    const context: I18nContext = I18nContext.getContext(prjname);
    const prj: I18nOneProject = I18nOneProject.createFromData(prjname, prjdata, context);
    this.otherProjects[prjname] = prj;
    return prj;
  }
  public hasProject(prjname: string): boolean {
    if (this.otherProjects.hasOwnProperty(prjname)) {
      return true;
    }
    if (this.defaultProject.defaultContext.hasProject(prjname)) {
      return true;
    }
    return false;
  }
  public getProject(prjname: string): I18nOneProject {
    if (this.otherProjects.hasOwnProperty(prjname)) {
      const prj: I18nOneProject = this.otherProjects[prjname];
      return prj;
    }
    if (this.defaultProject.defaultContext.hasProject(prjname)) {
      return this.defaultProject;
    }
    return this.addProject(prjname, {});
  }
  public getProjectList(): string[] {
    const result: string[] = [this.defaultProject.defaultContext.projectName];
    result.concat(Object.keys(this.otherProjects));
    return result;
  }
  public getProjectDisplayList(lngkey: string): I18nProjectDisplayItem[] {
    const result: I18nProjectDisplayItem[] = [];
    this.getProjectList().forEach((value: string) => {
      const prj = this.getProject(value);
      result.push(prj.getProjectDisplayItem(lngkey));
    });
    return result;
  }

  public get createFlag(): boolean {
    return this.defaultProject.createFlag;
  }
  public set createFlag(flag: boolean) {
    this.defaultProject.createFlag = flag;
  }
  public get defaultContext(): I18nContext {
    return this.defaultProject.defaultContext;
  }
  public set defaultContext(value: I18nContext) {
    this.defaultProject.defaultContext = value;
  }

  /**
   *
   * @param readonly if true, everything is on readonly.
   * @param readAndWrite if readonly false and this is true, all can be changed.
   * @returns true if somethng was changed.
   */
  public forceReadAndWrite(prj: string, readonly: boolean, readAndWrite: boolean): boolean {
    if (prj === '') {
      return this.defaultProject.forceReadAndWrite(readonly, readAndWrite);
    } else {
      return this.getProject(prj).forceReadAndWrite(readonly, readAndWrite);
    }
  }

  /**
   *
   * @param modref the reference to the model
   * @param moddata the full data as javascrpt object
   * @returns the newly added module itself
   */
  public addModule(prj: string, modref: string, moddata: any): I18nOneModule {
    if (prj === '') {
      return this.defaultProject.addModule(modref, moddata);
    } else {
      return this.getProject(prj).addModule(modref, moddata);
    }
  }

  public getModule(prj: string, modref: string): I18nOneModule {
    if (prj === '') {
      return this.defaultProject.getModule(modref);
    } else {
      return this.getProject(prj).getModule(modref);
    }
  }
  /**
   * sets or merge a language collection of key/value-pairs
   *
   * @param modref - the module reference
   * @param lngkey - the language key e.g. 'en'
   * @param lngmap - the javascript object to initialize.
   */
  public addLanguage(prj: string, modref: string, lngkey: string, lngdata: any): void {
    if (prj === '') {
      this.defaultProject.addLanguage(modref, lngkey, lngdata);
    } else {
      this.getProject(prj).addLanguage(modref, lngkey, lngdata);
    }
  }
  /**
   *
   * @returns a list of module references
   */
  public getModuleReferences(prj: string = ''): string[] {
    if (prj === '') {
      return this.defaultProject.getModuleReferences();
    } else {
      return this.getProject(prj).getModuleReferences();
    }
  }

  /**
   *
   * @param modref the module reference
   * @param lngkey langauge key
   * @param key the key
   * @returns the language value if existent or the key if not.
   */
  public get(prj: string, modref: string, lngkey: string, key: string): string {
    if (prj === '') {
      return this.defaultProject.get(modref, lngkey, key);
    } else {
      return this.getProject(prj).get(modref, lngkey, key);
    }
  }
  public set(prj: string, modref: string, lngkey: string, key: string, value: string) {
    if (prj === '') {
      this.defaultProject.getModule(modref).setItem(lngkey, key, value);
    } else {
      this.getProject(prj).getModule(modref).setItem(lngkey, key, value);
    }
  }

  public hasKey(prj: string, modref: string, lngkey: string, key: string): boolean {
    if (prj === '') {
      return this.defaultProject.hasKey(modref, lngkey, key);
    } else {
      return this.getProject(prj).hasKey(modref, lngkey, key);
    }
  }

  /**
   *
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n if not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(prj: string, modref: string, lngkey: string): I18nCache | null {
    if (prj === '') {
      return this.defaultProject.getLanguageCache(
        this.defaultProject.gerProjectName(),
        modref,
        lngkey,
        this.createFlag ? this : null,
      );
    } else {
      return this.getProject(prj).getLanguageCache(prj, modref, lngkey, this.createFlag ? this : null);
    }
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
