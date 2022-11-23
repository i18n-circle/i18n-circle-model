// import { I18nHistoryContainer } from './I18nHistoryContainer';
import { I18nIndexStatus } from './I18nIndexStatus';
import { SemanticVersion, semverRegEx } from './SemanticVersion';

export class I18nHistoryIndex {
  private _modref: string = '';
  public get modref(): string {
    return this._modref;
  }
  public set modref(value: string) {
    I18nHistoryIndex.prepareChange(this, 'modref');
    this._modref = value;
    I18nHistoryIndex.finalizeChange(this, 'modref');
  }

  // ================================================================
  private _semanticVersion: SemanticVersion = new SemanticVersion('V0.0.1');
  public get semanticVersion(): string {
    return this._semanticVersion.v;
  }
  public set semanticVersion(value: string) {
    const prev = this._semanticVersion.v;
    I18nHistoryIndex.prepareChange(this, 'semanticVersion');
    if (SemanticVersion.splitSemanticVersion(value, this._semanticVersion) === null) {
      if (prev != value) {
        this._internalVersion++;
      }
    }
    I18nHistoryIndex.finalizeChange(this, 'semanticVersion');
  }
  // ================================================================
  private _internalVersion: number = 1;
  public get internalVersion(): number {
    return this._internalVersion;
  }
  public set internalVersion(value: number) {
    I18nHistoryIndex.prepareChange(this, 'internalVersion');
    this._internalVersion = value;
    I18nHistoryIndex.finalizeChange(this, 'internalVersion');
  }
  private _status: I18nIndexStatus = I18nIndexStatus.INIT;
  public get status(): I18nIndexStatus {
    return this._status;
  }
  public set status(value: I18nIndexStatus) {
    I18nHistoryIndex.prepareChange(this, 'status');
    this._status = value;
    I18nHistoryIndex.finalizeChange(this, 'status');
  }
  public ArchiveDirect() {
    this._status = I18nIndexStatus.ARCHIVED;
  }
  public IncrementInternalVersion(directFlag: boolean = false) {
    if (directFlag) {
      this._internalVersion++;
    } else {
      this.internalVersion++;
    }
  }

  public get internalName(): string {
    return this.modref + '__' + this.semanticVersion + '__' + this.internalVersion;
  }
  public set internalName(value: string) {
    I18nHistoryIndex.prepareChange(this, 'internalName');
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
    I18nHistoryIndex.finalizeChange(this, 'internalName');
  }
  constructor(intName: string, status: I18nIndexStatus) {
    I18nHistoryIndex.prepareChange(this, 'constructor');
    this.internalName = intName;
    this.status = status;
    I18nHistoryIndex.finalizeChange(this, 'constructor');
  }

  private static tmpCurrent: I18nHistoryIndex | null = null;
  private static tmpFirstCaller: string = '';
  private static prepareChange(current: I18nHistoryIndex, caller: string) {
    // if (this.tmpCurrent == null) {
    //   this.tmpCurrent = current;
    //   this.tmpFirstCaller = caller;
    //   I18nHistoryContainer.prepareChange(current, caller);
    // }
  }
  private static finalizeChange(current: I18nHistoryIndex, caller: string) {
    // if (this.tmpCurrent === current && this.tmpFirstCaller === caller) {
    //   I18nHistoryContainer.finalizeChange(current, caller);
    //   this.tmpCurrent = null;
    // }
  }
}
