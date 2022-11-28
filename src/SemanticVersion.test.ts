import { describe, expect, test } from '@jest/globals';
import { SemanticVersion } from './SemanticVersion';

describe('SemanticVersion', () => {
  test('SemanticVersion-static', () => {
    expect(SemanticVersion.splitSemanticVersion('x0')).toBeUndefined();
    const sem01 = SemanticVersion.splitSemanticVersion('V0.0.1');
    expect(sem01).toBeDefined();
    expect(sem01?.c).toBe(0);
    expect(sem01?.patch()).toBe('V0.0.2');
    expect(sem01?.c).toBe(1);
    expect(sem01?.minor(undefined, 'post')).toBe('V0.1.0+post');
    expect(sem01?.c).toBe(2);
    expect(sem01?.major('alpha')).toBe('V1.0.0-alpha');
    expect(sem01?.c).toBe(3);
    expect(sem01?.patch()).toBe('V1.0.1');
    expect(sem01?.c).toBe(4);
    expect(SemanticVersion.splitSemanticVersion('x0', sem01)).toBeUndefined();
    expect(SemanticVersion.splitSemanticVersion('V0.2.0', sem01)).toBeNull();
    expect(sem01?.c).toBe(5);
    if (sem01) sem01.c = 0;
    expect(sem01?.c).toBe(6);
    if (sem01) sem01.c = 10;
    expect(sem01?.c).toBe(10);
    if (sem01) sem01.v = 'x0'; // Invalid Format
    expect(sem01?.v).toBe('V0.2.0');
    expect(sem01?.c).toBe(10);
    if (sem01) sem01.v = 'V0.3.1-alpha'; // Valid Format
    expect(sem01?.v).toBe('V0.3.1-alpha');
    expect(sem01?.c).toBe(11);
  });
});
