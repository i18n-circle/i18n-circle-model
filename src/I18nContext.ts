/**
 * providing the context used in I18nChangeAction and all modules
 */
export class I18nContext {
  protected contextProject: string | undefined;
  protected contextModule: string | undefined;
  protected contextLanguage: string | undefined;
  protected contextKey: string | undefined;
  protected constructor() {}

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
   */
  public extendProject(module: string): I18nContext {
    return I18nContext.getContext(this.contextProject, module);
  }
  /**
   * Copys the current context and add the lngkey to it.
   * @param lngkey the language key
   * @returns a new context
   */
  public extendModule(lngkey: string): I18nContext {
    return I18nContext.getContext(this.contextProject, this.contextModule, lngkey);
  }
  /**
   * Copys the current context and adds the key to it.
   * @param key the key in the language
   * @returns a new context
   */
  public extendLanguage(key: string): I18nContext {
    return I18nContext.getContext(this.contextProject, this.contextModule, this.contextLanguage, key);
  }
  /**
   * Copy the current context fields only.
   * @returns the pure context without the fields from the inherited classes.
   */
  public getCurrentContext(): I18nContext {
    return Object.assign({} as I18nContext, this);
  }
  /**
   * Setup a new context object
   * @param project the project identifier
   * @param module the internal name of the module
   * @param language the language key
   * @param key the key to the value within the language
   * @returns
   */
  public static getContext(project?: string, module?: string, language?: string, key?: string): I18nContext {
    const context = new I18nContext();
    context.contextProject = project;
    context.contextModule = module;
    context.contextLanguage = language;
    context.contextKey = key;
    return context;
  }
  /**
   *
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
