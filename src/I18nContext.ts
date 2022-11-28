const parseString = /^\[([^\=\>\]]*)\=\>([^\=\>\]]*)\=\>([^\=\>\]]*)\=\>([^\=\>\]]*)\]$/;

/**
 * providing the context used in I18nChangeAction and all modules
 */
export class I18nContext {
  protected contextProject: string | undefined;
  protected contextModule: string | undefined;
  protected contextLanguage: string | undefined;
  protected contextKey: string | undefined;
  protected constructor() {}

  /**
   * readonly access to projectName
   */
  public get projectName(): string {
    return this.contextProject || '';
  }
  /**
   *
   * @param prjname project name to test
   * @returns true if yes.
   */
  public hasProject(prjname: string): boolean {
    return this.contextProject === prjname;
  }

  /**
   * readonly access to provide a valid array for context
   */
  public get context(): string[] {
    if (typeof this.contextProject !== 'undefined') {
      if (typeof this.contextModule !== 'undefined') {
        if (typeof this.contextLanguage !== 'undefined') {
          if (typeof this.contextKey !== 'undefined') {
            return [this.contextProject, this.contextModule, this.contextLanguage, this.contextKey];
          } else {
            return [this.contextProject, this.contextModule, this.contextLanguage];
          }
        } else {
          return [this.contextProject, this.contextModule];
        }
      } else {
        return [this.contextProject];
      }
    }
    return [];
  }

  /**
   *
   * @returns parsable string representation ofthe context
   */
  public contextToString(): string {
    let tmp: string = '[';
    tmp += (this.contextProject || '') + '=>';
    tmp += (this.contextModule || '') + '=>';
    tmp += (this.contextLanguage || '') + '=>';
    tmp += (this.contextKey || '') + ']';
    return tmp;
  }
  /**
   * Copys the current context and add the module to it
   * @param module the module internal name
   * @returns a new context
   * @throws invalid context parameter definition
   */
  public extendProject(module: string): I18nContext {
    return I18nContext.getContext(this.contextProject, module);
  }
  /**
   * Copys the current context and add the lngkey to it.
   * @param lngkey the language key
   * @returns a new context
   * @throws invalid context parameter definition
   */
  public extendModule(lngkey: string): I18nContext {
    return I18nContext.getContext(this.contextProject, this.contextModule, lngkey);
  }
  /**
   * Copys the current context and adds the key to it.
   * @param key the key in the language
   * @returns a new context
   * @throws invalid context parameter definition
   */
  public extendLanguage(key: string): I18nContext {
    return I18nContext.getContext(this.contextProject, this.contextModule, this.contextLanguage, key);
  }
  /**
   * Copy the current context fields only.
   * @returns the pure context without the fields from the inherited classes.
   * @throws invalid context parameter definition
   */
  public getCurrentContext(): I18nContext {
    return I18nContext.getContext(
      this.contextProject,
      this.contextModule,
      this.contextLanguage,
      this.contextKey
    )
  }
  /**
   * Setup a new context object
   * @param project the project identifier
   * @param module the internal name of the module
   * @param language the language key
   * @param key the key to the value within the language
   * @returns an I18nContext object
   * @throws invalid context parameter definition
   */
  public static getContext(project?: string, module?: string, language?: string, key?: string): I18nContext {
    const context = new I18nContext();
    context.contextProject = project;
    context.contextModule = module;
    context.contextLanguage = language;
    context.contextKey = key;
    if (!this.isValidContext(context)) {
      // console.error("invalid",context.contextToString());
      throw new Error("Invalid Context parameter definition");
    }
    return context;
  }
  public static string2Context(scon: string): I18nContext|null {
    const p1 = parseString.exec(scon);
    if (p1==null || p1[1]=='') {
      return null;
    }
    const context = this.getContext(p1[1]);
    if (p1[2]!='') {
      context.contextModule = p1[2];
      if (p1[3]!='') {
        context.contextLanguage = p1[3];
        if (p1[4]!='') {
          context.contextKey = p1[4];
        }
      } else {
        if (p1[4]!='') {
          return null;
        }
      }
    } else {
      if (p1[3]!=''||p1[4]!='') {
        return null;
      }
    }
    // console.log(p1,context);
    return context;
  }
  public static isValidContext(chcon:I18nContext) : boolean {
    if (typeof chcon.contextProject === 'undefined'
        || chcon.contextProject === '') {
      return false;
    }
    if (typeof chcon.contextModule === 'undefined'
      || chcon.contextModule==='') {
      if ( (chcon.contextLanguage||'')!=''
        || (chcon.contextKey||'')!='') {
          return false;
        } else{
          return true;
        }
    }
    if (typeof chcon.contextLanguage === 'undefined'
        || chcon.contextLanguage===''){
      if ((chcon.contextKey||'')!='') {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
  /**
   * copy context from one to the other.
   * @param from copy the context from one context...
   * @param to ... to another context
   */
  protected static CopyContext(from: I18nContext, to: I18nContext) {
    to.contextProject = from.contextProject;
    to.contextModule = from.contextModule;
    to.contextLanguage = from.contextLanguage;
    to.contextKey = from.contextKey;
  }
}
