import { I18nIndexStatus } from './I18nIndexStatus';
import { SemanticVersion, semverRegEx } from './SemanticVersion';

/**
 * Calls for index the modules and a wrapper for SemanticVersion.
 */
export class I18nHistoryIndex {
  // ================================================================
  private _modref: string = '';
  /**
   * get the module reference.
   */
  public get modref(): string {
    return this._modref;
  }
  /**
   * set the module reference.
   */
  public set modref(value: string) {
    this._modref = value;
  }

  // ================================================================
  private _semanticVersion: SemanticVersion = new SemanticVersion('V0.0.1');
  /**
   * get the current semantiv version.
   */
  public get semanticVersion(): string {
    return this._semanticVersion.v;
  }
  /** sets the semantic Version */
  public set semanticVersion(value: string) {
    const prev = this._semanticVersion.v;
    SemanticVersion.splitSemanticVersion(value, this._semanticVersion);
  }
  /**
   *  Increments the third figure of a semantic vversion.
   * @param pre pre version to add with -
   * @param post post version to add with +
   * @returns the resulting semantic version
   */
  public patch(pre?: string, post?: string): string {
    return this._semanticVersion.patch(pre, post);
  }
  /**
   *  Increments the second figure of a semantic vversion.
   * @param pre pre version to add with -
   * @param post post version to add with +
   * @returns the resulting semantic version
   */
  public minor(pre?: string, post?: string): string {
    return this._semanticVersion.minor(pre, post);
  }
  /**
   *  Increments the first figure of a semantic vversion.
   * @param pre pre version to add with -
   * @param post post version to add with +
   * @returns the resulting semantic version
   */
  public major(pre?: string, post?: string): string {
    return this._semanticVersion.major(pre, post);
  }

  // ================================================================
  /**
   * getting the internal counter of the SemanticVersion.
   */
  public get internalVersion(): number {
    return this._semanticVersion.c;
  }
  /**
   * sets the internalversion if applicable.
   */
  public set internalVersion(value: number) {
    this._semanticVersion.c = value;
  }
  // ================================================================
  private _status: I18nIndexStatus = I18nIndexStatus.INIT;
  /**
   * gets the internal Status of the index.
   */
  public get status(): I18nIndexStatus {
    return this._status;
  }
  /**
   * sets the internal status
   */
  public set status(value: I18nIndexStatus) {
    this._status = value;
  }
  // ================================================================
  /**
   * gets the internal name combined of modref,semanticVersion
   * and internal counter version.
   */
  public get internalName(): string {
    return this.modref + '__' + this.semanticVersion + '__' + this.internalVersion;
  }
  /**
   * resolves the internal name to its components.
   */
  public set internalName(value: string) {
    const spl = value.split('__');
    if (spl.length > 0) {
      this.modref = spl[0];
    } else {
      this.modref = value;
      this.semanticVersion = 'V0.0.1';
      this.internalVersion = 1;
      return;
    }
    if (spl.length > 1 && spl[1].match(semverRegEx)) {
      this.semanticVersion = spl[1];
      if (spl.length > 2 && spl[2].match(/^[0-9]+$/)) {
        this.internalVersion = Number.parseInt(spl[2], 10);
      } else {
        this.internalVersion = 1;
      }
    } else if (spl.length > 1 && spl[1].match(/^[0-9]+$/)) {
      this.semanticVersion = 'V0.0.1';
      this.internalVersion = Number.parseInt(spl[1], 10);
    } else {
      this.semanticVersion = 'V0.0.1';
      this.internalVersion = 1;
    }
  }
  // ================================================================
  /**
   * creates an Historyindex
   * @param intName internal name to set,
   * @param status status to set.
   */
  constructor(intName: string, status: I18nIndexStatus) {
    this.internalName = intName;
    this.status = status;
  }
}
