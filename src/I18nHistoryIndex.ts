import { I18nIndexStatus } from './I18nIndexStatus';
import { SemanticVersion, semverRegEx } from './SemanticVersion';

/**
 * Calls for index the modules and a wrapper for SemanticVersion.
 */
export class I18nHistoryIndex {
  // ================================================================
  private _modref: string = '';
  public get modref(): string {
    return this._modref;
  }
  public set modref(value: string) {
    this._modref = value;
  }

  // ================================================================
  private _semanticVersion: SemanticVersion = new SemanticVersion('V0.0.1');
  public get semanticVersion(): string {
    return this._semanticVersion.v;
  }
  public set semanticVersion(value: string) {
    const prev = this._semanticVersion.v;
    SemanticVersion.splitSemanticVersion(value, this._semanticVersion);
  }
  public patch(pre?: string, post?: string): string {
    return this._semanticVersion.patch(pre, post);
  }
  public minor(pre?: string, post?: string): string {
    return this._semanticVersion.minor(pre, post);
  }
  public major(pre?: string, post?: string): string {
    return this._semanticVersion.major(pre, post);
  }

  // ================================================================
  public get internalVersion(): number {
    return this._semanticVersion.c;
  }
  public set internalVersion(value: number) {
    this._semanticVersion.c = value;
  }
  // ================================================================
  private _status: I18nIndexStatus = I18nIndexStatus.INIT;
  public get status(): I18nIndexStatus {
    return this._status;
  }
  public set status(value: I18nIndexStatus) {
    this._status = value;
  }
  // ================================================================
  public get internalName(): string {
    return this.modref + '__' + this.semanticVersion + '__' + this.internalVersion;
  }
  public set internalName(value: string) {
    const spl = value.split('__');
    if (spl.length > 0) {
      this.modref = spl[0];
    } else {
      this.modref = value;
      this.semanticVersion = 'V0.0.1';
      this.internalVersion = 1;
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
  constructor(intName: string, status: I18nIndexStatus) {
    this.internalName = intName;
    this.status = status;
  }
}
