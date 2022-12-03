import { Subject } from 'rxjs';
import { I18nCache } from './I18nCache';
import { I18nChangeAction, I18nChangeActionType } from './I18nChangeAction';
import { I18nContext } from './I18nContext';
import { I18nOneModule } from './I18nOneModule';
import { I18nOneProject } from './I18nOneProject';
import { I18nProjectDisplayItem } from './I18nProjectDisplayItem';
import { I18nTranslateActions } from './I18nTranslateActions';

export class I18nCircleModel {
  private defaultProject: I18nOneProject;
  private otherProjects: any = {};

  /**
   *
   * @param prjname name of the default project.
   */
  public constructor(prjname: string = 'defaultproject') {
    this.defaultProject = new I18nOneProject(prjname);
  }

  /**
   *
   * @param prjname project name for the default project
   * @param prjdata data for initializing the default project
   * @returns
   */
  public setDefaultProject(prjname: string, prjdata: any): I18nOneProject {
    const context: I18nContext = I18nContext.getContext(prjname);
    const prj: I18nOneProject = I18nOneProject.createFromData(prjname, prjdata, context);
    this.defaultProject = prj;
    return prj;
  }

  /**
   *
   * @param prjname name to add
   * @param prjdata data to initialize
   * @returns the project data structure.
   */
  public addProject(prjname: string, prjdata: any): I18nOneProject {
    const context: I18nContext = I18nContext.getContext(prjname);
    const prj: I18nOneProject = I18nOneProject.createFromData(prjname, prjdata, context);
    this.otherProjects[prjname] = prj;
    return prj;
  }
  /**
   *
   * @param prjname the project name to check
   * @returns true if existent, false if not.
   */
  public hasProject(prjname: string): boolean {
    if (this.otherProjects.hasOwnProperty(prjname)) {
      return true;
    }
    if (this.defaultProject.defaultContext.hasProject(prjname)) {
      return true;
    }
    return false;
  }
  /**
   *
   * @param prjname name of the project to find
   * @returns an existing or a new project.
   */
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
  /**
   *
   * @returns the list of project ids
   */
  public getProjectList(): string[] {
    const result: string[] = [this.defaultProject.defaultContext.projectName];
    const oprjlist = Object.keys(this.otherProjects);
    return result.concat(oprjlist);
  }
  /**
   *
   * @param lngkey the language key to get the right display
   * @returns the the display item of a project.
   */
  public getProjectDisplayList(lngkey: string): I18nProjectDisplayItem[] {
    const result: I18nProjectDisplayItem[] = [];
    this.getProjectList().forEach((value: string) => {
      const prj = this.getProject(value);
      result.push(prj.getProjectDisplayItem(lngkey));
    });
    return result;
  }

  /**
   * getting the createflag from the default project
   */
  public get createFlag(): boolean {
    return this.defaultProject.createFlag;
  }
  /**
   * setting the createFlag from the default project
   */
  public set createFlag(flag: boolean) {
    this.defaultProject.createFlag = flag;
  }
  /**
   * getting the defaultContext
   */
  public get defaultContext(): I18nContext {
    return this.defaultProject.defaultContext;
  }
  /**
   * setting the defaultContext
   */
  public set defaultContext(value: I18nContext) {
    this.defaultProject.defaultContext = value;
  }

  /**
   *
   * @param prj name of the project to use, it' the default project if ''.
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
   * @param prj name of the project to use, it' the default project if ''.
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

  /**
   * gets the module from a project.
   *
   * @param prj name of the project to use, it' the default project if ''.
   * @param modref - the module reference
   */
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
   * @param prj name of the project to use, it' the default project if ''.
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
   * @param prj name of the project to use, it' the default project if ''.
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
   * @param prj name of the project to use, it' the default project if ''.
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
  public getDefaultLanguage(prj: string, modref: string): string {
    if (prj === '') {
      return this.defaultProject.getModule(modref).defaultLng;
    } else {
      return this.getProject(prj).getModule(modref).defaultLng;
    }
  }
  /**
   * @param prj name of the project to use, it' the default project if ''.
   * @param modref the module reference
   * @param lngkey the language key
   * @param key the key to set
   * @param value the value to set
   */
  public set(prj: string, modref: string, lngkey: string, key: string, value: string) {
    // console.log("prj:",prj,"mod:",modref,"lng:",lngkey,"key:",key,"value:",value);
    if (prj === '') {
      this.defaultProject.set(modref, lngkey, key, value);
    } else {
      this.getProject(prj).set(modref, lngkey, key, value);
    }
  }

  /**
   * @param prj name of the project to use, it' the default project if ''.
   * @param modref the module reference
   * @param lngkey the language key
   * @param key the key to check
   * @returns true if the key is existent in the specified context.
   */
  public hasKey(prj: string, modref: string, lngkey: string, key: string): boolean {
    if (prj === '') {
      return this.defaultProject.hasKey(modref, lngkey, key);
    } else {
      return this.getProject(prj).hasKey(modref, lngkey, key);
    }
  }

  /**
   * @param prj name of the project to use, it' the default project if ''.
   * @param modref the module reference
   * @param lngkey the language key
   * @param i18n if not null, then new key will be created in the default language
   * @returns A new I18nCache
   */
  public getLanguageCache(prj: string, modref: string, lngkey: string): I18nCache | null {
    if (prj === '') {
      return this.defaultProject.getLanguageCache(
        this.defaultProject.getProjectName(),
        modref,
        lngkey,
        this.createFlag ? this : null,
      );
    } else {
      return this.getProject(prj).getLanguageCache(prj, modref, lngkey, this.createFlag ? this : null);
    }
  }

  /**
   *
   * @param prj name of the project to use, it' the default project if ''.
   * @param modref if null, all modules are scanned, the existing module otherwise
   * @returns a transaction list to fix the inconsistencies or null if valid
   */
  public checkConsistency(prj: string, modref: string | null): I18nTranslateActions | null {
    if (prj === '') {
      return this.defaultProject.checkConsistency(modref);
    }
    return this.getProject(prj).checkConsistency(modref);
  }

  private static changeSubject: Subject<I18nChangeAction> | undefined;

  /**
   * Internal function to submit changes.
   * @param ta an I18nChangeAction to submit
   */
  public static publishChange(ta: I18nChangeAction): void {
    if (typeof this.changeSubject === 'undefined') {
      this.changeSubject = new Subject<I18nChangeAction>();
    }
    this.changeSubject.next(ta);
  }
  /**
   *
   * @returns a subject to subscribe to the change actions
   */
  public static subscribeChange(): Subject<I18nChangeAction> {
    if (typeof this.changeSubject === 'undefined') {
      this.changeSubject = new Subject<I18nChangeAction>();
    }
    return this.changeSubject;
  }
}
