import { describe, expect, test } from '@jest/globals';

import { I18nCircleModel } from './I18nCircleModel';
import { I18nIndexStatus } from './I18nIndexStatus';

describe('I18nCircleModel', () => {
  var mod01 = {
    internalName: 'test02b__V0.1.0__2',
    semanticVersion: 'V0.1.0',
    internalVersion: 2,
    filepath: '',
    createFlag: true,
    status: I18nIndexStatus.ACTIVE,
    languages: {
      en: {
        logon: 'logon',
        logout: 'logout',
        signin: 'signin',
        hello: 'hello',
      },
      de: {
        logon: 'Anmelden',
        logout: 'Abmelden',
        signin: 'Registrieren',
      },
      es: {
        hello: 'óla',
        goodbye: 'adiós',
      },
      defaultLanguage: 'en',
    },
  };

  test('I18nCircleModel-Basic Modules', () => {
    var i18n: I18nCircleModel = new I18nCircleModel();
    var mod1 = i18n.addModule('modref01', mod01);
    expect(mod1).toBeTruthy();
    expect(mod1.getModule()).toStrictEqual(mod01);
    var mod2 = i18n.getModule('modref01');
    expect(mod2).toBeTruthy();
    expect(mod2.getModule()).toStrictEqual(mod01);
    var mod3 = i18n.getModule('modref03');
    expect(mod3).toBeTruthy();
    mod3.status = I18nIndexStatus.ACTIVE;
    mod3.createFlag = true;
    expect(mod3.getModule()).toStrictEqual({
      internalName: 'modref03__V0.0.1__1',
      semanticVersion: 'V0.0.1',
      internalVersion: 1,
      filepath: '',
      createFlag: true,
      status: I18nIndexStatus.ACTIVE,
      languages: {
        en: {},
        defaultLanguage: 'en',
      },
    });
    i18n.addLanguage('modref03', 'en', mod1.getItems('en'));
    expect(mod3.getModule()).toStrictEqual({
      internalName: 'modref03__V0.0.1__1',
      semanticVersion: 'V0.0.1',
      internalVersion: 1,
      filepath: '',
      createFlag: true,
      status: I18nIndexStatus.ACTIVE,
      languages: {
        en: {
          logon: 'logon',
          logout: 'logout',
          signin: 'signin',
          hello: 'hello',
        },
        defaultLanguage: 'en',
      },
    });
    expect(i18n.getModuleReferences()).toStrictEqual(['modref01', 'modref03']);
  });

  test('I18nCircleModel-Get', () => {
    var i18n: I18nCircleModel = new I18nCircleModel();
    var mod1 = i18n.addModule('modref01', mod01);
    expect(mod1).toBeTruthy();
    expect(mod1.getModule()).toStrictEqual(mod01);
    expect(mod1.createFlag).toBeTruthy();
    mod1.createFlag = false;
    expect(mod1.createFlag).toBeFalsy();
    i18n.setCreateFlag(false);
    expect(i18n.getCreateFlag()).toBeFalsy();

    expect(i18n.hasKey('modref01', 'de', 'logon')).toBeTruthy();
    expect(i18n.get('modref01', 'de', 'logon')).toBe('Anmelden');
    expect(i18n.get('modref01', 'de', 'jump')).toBe('jump');
    expect(i18n.hasKey('modref01', 'de', 'jump')).toBeFalsy();
    expect(i18n.get('modref01', 'en', 'jump')).toBe('jump');
    expect(i18n.hasKey('modref01', 'en', 'jump')).toBeFalsy(); // no autocreate

    expect(i18n.get('modref01', 'en_US', 'jump')).toBe('jump');
    expect(i18n.hasKey('modref01', 'en_US', 'jump')).toBeFalsy(); // no autocreate

    expect(i18n.get('modref04', 'en', 'jump')).toBe('jump');
    expect(i18n.hasKey('modref04', 'en', 'jump')).toBeFalsy(); // no autocreate

    mod1.createFlag = true;
    expect(mod1.createFlag).toBeTruthy();
    i18n.setCreateFlag(true);
    expect(i18n.getCreateFlag()).toBeTruthy();

    expect(i18n.hasKey('modref01', 'de', 'logon')).toBeTruthy();
    expect(i18n.get('modref01', 'de', 'logon')).toBe('Anmelden');
    expect(i18n.get('modref01', 'de', 'jump')).toBe('jump');
    expect(i18n.hasKey('modref01', 'de', 'jump')).toBeFalsy();
    expect(i18n.hasKey('modref01', 'en', 'jump')).toBeTruthy(); // autocreate
    expect(i18n.get('modref01', 'en', 'jump')).toBe('jump');

    expect(i18n.get('modref01', 'en_US', 'fall')).toBe('fall');
    expect(i18n.hasKey('modref01', 'en', 'fall')).toBeTruthy(); // autocreate
    expect(i18n.hasKey('modref01', 'en_US', 'fall')).toBeFalsy();

    expect(i18n.get('modref04', 'en', 'jump')).toBe('jump');
    expect(i18n.getCreateFlag()).toBeTruthy();
    var mod4 = i18n.getModule('modref04');
    expect(mod4).toBeTruthy();
    expect(mod4.createFlag).toBeTruthy();
    // console.log(JSON.stringify(mod4.getModule()));
    expect(i18n.hasKey('modref04', 'en', 'jump')).toBeTruthy(); // autocreate
  });

  test('I18nCircleModel-Cache', () => {
    var i18n: I18nCircleModel = new I18nCircleModel();
    var mod1 = i18n.addModule('modref01', mod01);
    expect(mod1).toBeTruthy();
    expect(mod1.getModule()).toStrictEqual(mod01);

    let cache_de = i18n.getLanguageCache('modref01', 'de');
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.hasKey('logon')).toBeTruthy();
    expect(cache_de?.hasKey('logout')).toBeTruthy();
    expect(cache_de?.hasKey('signin')).toBeTruthy();
    expect(cache_de?.get('logon')).toBe('Anmelden');
    expect(cache_de?.get('logout')).toBe('Abmelden');
    expect(cache_de?.get('signin')).toBe('Registrieren');
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.get('new stuff')).toBe('new stuff'); // auto create in "en" and fall back
    expect(cache_de?.hasKey('new stuff')).toBeFalsy();
    expect(cache_de?.getSize()).toBe(3);
    // console.log("703",JSON.stringify(mod1.getModule(),undefined,2))
    expect(mod1.getModule()).toStrictEqual({
      internalName: 'test02b__V0.1.0__2',
      semanticVersion: 'V0.1.0',
      internalVersion: 2,
      filepath: '',
      createFlag: true,
      status: I18nIndexStatus.ACTIVE,
      languages: {
        en: {
          logon: 'logon',
          logout: 'logout',
          signin: 'signin',
          hello: 'hello',
          'new stuff': 'new stuff',
        },
        de: {
          logon: 'Anmelden',
          logout: 'Abmelden',
          signin: 'Registrieren',
        },
        es: {
          hello: 'óla',
          goodbye: 'adiós',
        },
        defaultLanguage: 'en',
      },
    });
    expect(i18n.hasKey('modref01', 'en', 'new stuff')).toBeTruthy();
  });
});
