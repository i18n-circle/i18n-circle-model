import { describe, expect, test } from '@jest/globals';
import { I18nHistoryIndex } from './I18nHistoryIndex';
import { I18nIndexStatus } from './I18nIndexStatus';
import { SemanticVersion } from './SemanticVersion';

describe('I18nHistoryIndex', () => {
  test('I18nHistoryIndex-basics', () => {
    const hisix: I18nHistoryIndex = new I18nHistoryIndex('default__V0.0.2__2', I18nIndexStatus.INIT);
    expect(hisix).toBeDefined();
    expect(hisix.modref).toBe('default');
    expect(hisix.semanticVersion).toBe('V0.0.2');
    expect(hisix.internalVersion).toBe(2);
    expect(hisix.status).toBe(I18nIndexStatus.INIT);
    expect(hisix.internalName).toBe('default__V0.0.2__2');
    expect(hisix.patch()).toBe('V0.0.3');
    expect(hisix.internalName).toBe('default__V0.0.3__3');
    expect(hisix.minor()).toBe('V0.1.0');
    expect(hisix.internalName).toBe('default__V0.1.0__4');
    expect(hisix.major('rc1-beta')).toBe('V1.0.0-rc1-beta');
    expect(hisix.internalVersion).toBe(5);
    expect(hisix.internalName).toBe('default__V1.0.0-rc1-beta__5');
  });
});
