export const semverRegEx =
  /^V(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g;

/**
 * class to handle all around SemanticVersion plus an internal version.
 */
export class SemanticVersion {
  private _major: number = 0;
  private _minor: number = 0;
  private _patch: number = 0;
  private _pre: string | undefined;
  private _post: string | undefined;
  private _counter: number = 0;

  /**
   * get the internal counter.
   */
  public get c(): number {
    return this._counter;
  }
  /**
   * set the internal counter, protected against lower numbers then current.
   */
  public set c(value: number) {
    if (value > this._counter) {
      this._counter = value;
    } else if (this.v !== 'V0.0.0') {
      this._counter++;
    }
  }
  /**
   * get the semantic version as a string.
   */
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
  /**
   * decodes a semantic version via static method
   * @see splitSemanticVersion
   */
  public set v(value: string) {
    SemanticVersion.splitSemanticVersion(value, this);
  }
  /**
   * Increments the patch version and attach pre and post to it.
   * @param pre
   * @param post
   * @returns the new string represenation.
   */
  public patch(pre?: string, post?: string): string {
    this._patch++;
    this._pre = pre;
    this._post = post;
    this._counter++;
    return this.v;
  }
  /**
   * Increments the minor version and attach pre and post to it.
   * @param pre
   * @param post
   * @returns the new string represenation.
   */
  public minor(pre?: string, post?: string): string {
    this._patch = 0;
    this._minor++;
    this._pre = pre;
    this._post = post;
    this._counter++;
    return this.v;
  }
  /**
   * Increments the major version and attach pre and post to it.
   * @param pre
   * @param post
   * @returns the new string represenation.
   */
  public major(pre?: string, post?: string): string {
    this._patch = 0;
    this._minor = 0;
    this._major++;
    this._pre = pre;
    this._post = post;
    this._counter++;
    return this.v;
  }

  /**
   * Either with sem as semantic version or the rest to initialize this object.
   * @param sem the semantic version as a string or null if other parameters are releveant.
   * @param maj major version
   * @param min minor version
   * @param pat pach version
   * @param pre pre string
   * @param post post strng
   * @param cnt internal counter.
   */
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

  /**
   *
   * @param value the string to analyse
   * @param other the other SemanticVersion to write, if null, a new object is created.
   * @returns a new object if no other, null if other and ok. undefined on any error.
   */
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
