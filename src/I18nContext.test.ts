import { describe, expect, test } from '@jest/globals';
import { I18nContext } from './I18nContext';

describe('I18nContext', () => {
  test('I18nContext-sunshine test', () => {
    const cProject = I18nContext.getContext('p1');
    expect(cProject.projectName).toBe('p1');
    expect(cProject.hasProject('p1')).toBeTruthy();
    expect(cProject.hasProject('p0')).toBeFalsy();
    expect(cProject.context).toStrictEqual(['p1']);
    expect(cProject.contextToString()).toBe('[p1=>=>=>]');

    const cModule = cProject.extendProject('m1');
    expect(cModule.projectName).toBe('p1');
    expect(cModule.hasProject('p1')).toBeTruthy();
    expect(cModule.hasProject('p0')).toBeFalsy();
    expect(cModule.context).toStrictEqual(['p1', 'm1']);
    expect(cModule.contextToString()).toBe('[p1=>m1=>=>]');

    const cLanguage = cModule.extendModule('l1');
    expect(cLanguage.projectName).toBe('p1');
    expect(cLanguage.hasProject('p1')).toBeTruthy();
    expect(cLanguage.hasProject('p0')).toBeFalsy();
    expect(cLanguage.context).toStrictEqual(['p1', 'm1', 'l1']);
    expect(cLanguage.contextToString()).toBe('[p1=>m1=>l1=>]');

    const cKey = cLanguage.extendLanguage('k1');
    expect(cKey.projectName).toBe('p1');
    expect(cKey.hasProject('p1')).toBeTruthy();
    expect(cKey.hasProject('p0')).toBeFalsy();
    expect(cKey.context).toStrictEqual(['p1', 'm1', 'l1', 'k1']);
    expect(cKey.contextToString()).toBe('[p1=>m1=>l1=>k1]');

    const cKeyCopy = cKey.getCurrentContext();
    expect(cKeyCopy.context).toStrictEqual(['p1', 'm1', 'l1', 'k1']);
    expect(cKeyCopy.contextToString()).toBe('[p1=>m1=>l1=>k1]');
  });

  test('I18nContext-restore string2Context', () => {
    const cKeyRestore = I18nContext.string2Context('[p5=>m4=>l3=>k2]');
    expect(cKeyRestore?.context).toStrictEqual(['p5', 'm4', 'l3', 'k2']);
    expect(cKeyRestore?.contextToString()).toBe('[p5=>m4=>l3=>k2]');

    expect(I18nContext.string2Context('[=>m4=>l3=>k2]')).toBeNull();
    expect(I18nContext.string2Context('[p5=>=>l3=>k2]')).toBeNull();
    expect(I18nContext.string2Context('[p5=>m4=>=>k2]')).toBeNull();
    expect(I18nContext.string2Context('[p5=>=>=>k2]')).toBeNull();
    expect(I18nContext.string2Context('[p5=>m4=>]')).toBeNull();
    expect(I18nContext.string2Context('[p5=>m4]')).toBeNull();
    expect(I18nContext.string2Context('[p5=>]')).toBeNull();
    expect(I18nContext.string2Context('[p5]')).toBeNull();
    expect(I18nContext.string2Context('x[p5=>m4=>l3=>k2]')).toBeNull();
    expect(I18nContext.string2Context('[p5=>m4=>l3=>k2]=>')).toBeNull();
  });

  test('I18nContext-throw errors', () => {
    expect(() => I18nContext.getContext(undefined, 'm9')).toThrowError();
    expect(() => I18nContext.getContext(undefined, undefined, 'l9')).toThrowError();
    expect(() => I18nContext.getContext(undefined, undefined, undefined, 'k9')).toThrowError();
    expect(() => I18nContext.getContext('p9', undefined, 'l9')).toThrowError();
    expect(() => I18nContext.getContext('p9', undefined, undefined, 'k9')).toThrowError();
    expect(() => I18nContext.getContext('p9', 'm9', undefined, 'k9')).toThrowError();
  });
});
