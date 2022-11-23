export const semverRegEx =
  /^V(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g;

export class SemanticVersion {
  private _major: number = 0;
  private _minor: number = 0;
  private _patch: number = 0;
  private _pre: string | undefined;
  private _post: string | undefined;
  private _counter: number = 0;

  public get c(): number {
    return this._counter;
  }
  public set c(value: number) {
    if (value > this._counter) {
      this._counter = value;
    } else if (this.v !== 'V0.0.0') {
      this._counter++;
    }
  }
  public get v(): string {
    let vr = 'V' + this._major.toString() + '.' + this._minor.toString() + '.' + this._patch.toString();
    if (typeof this._pre === 'string') {
      vr += '-' + this._pre;
    }
    if (typeof this._post === 'string') {
      vr += '+' + this._post;
    }
    return vr;
  }
  public set v(value: string) {
    SemanticVersion.splitSemanticVersion(value, this);
  }
  public patch(pre?: string, post?: string): string {
    this._patch++;
    this._pre = pre;
    this._post = post;
    this._counter++;
    return this.v;
  }
  public minor(pre?: string, post?: string): string {
    this._patch = 0;
    this._minor++;
    this._pre = pre;
    this._post = post;
    this._counter++;
    return this.v;
  }
  public major(pre?: string, post?: string): string {
    this._patch = 0;
    this._minor = 0;
    this._major++;
    this._pre = pre;
    this._post = post;
    this._counter++;
    return this.v;
  }

  public constructor(
    sem: string | null,
    maj?: number,
    min?: number,
    pat?: number,
    pre?: string,
    post?: string,
    cnt?: number,
  ) {
    if (sem !== null) {
      SemanticVersion.splitSemanticVersion(sem, this);
    } else {
      this._major = maj || 0;
      this._minor = min || 0;
      this._patch = pat || 0;
      this._pre = pre;
      this._post = post;
      this._counter = cnt || 0;
    }
  }

  public static splitSemanticVersion(
    value: string,
    other?: SemanticVersion | null,
  ): SemanticVersion | undefined | null {
    const m: RegExpExecArray | null = semverRegEx.exec(value);
    if (m === null || m.length !== 6) {
      return undefined;
    }
    if (typeof other !== 'undefined' && other !== null) {
      const vBefore = other.v;
      other._major = parseInt(m[1], 10);
      other._minor = parseInt(m[2], 10);
      other._patch = parseInt(m[3], 10);
      other._pre = m[4];
      other._post = m[5];
      if (vBefore !== 'V0.0.0' && vBefore !== other.v) {
        // console.log("splitSemanticVersion-3",vBefore,other.v);
        other._counter++;
      }
      return null;
    }
    return new SemanticVersion(null, parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), m[4], m[5]);
  }
}
