import { describe, expect, test } from '@jest/globals';

import { I18nOneProject } from './I18nOneProject';
import { I18nIndexStatus } from './I18nIndexStatus';

describe('I18nOneProject', () => {
  var mod01 = {
    internalName: 'test02b__V0.1.0__2',
    semanticVersion: 'V0.1.0',
    internalVersion: 2,
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
    var project: I18nOneProject = new I18nOneProject();
    var mod1 = project.addModule('modref01', mod01);
    expect(mod1).toBeTruthy();

    expect(mod1.getModuleItem()).toStrictEqual(mod01);
    var mod2 = project.getModule('modref01');
    expect(mod2).toBeTruthy();
    expect(mod2.getModuleItem()).toStrictEqual(mod01);
    var mod3 = project.getModule('modref03');
    expect(mod3).toBeTruthy();
    mod3.status = I18nIndexStatus.ACTIVE;
    mod3.createFlag = true;
    expect(mod3.getModuleItem()).toStrictEqual({
      internalName: 'modref03__V0.0.1__1',
      semanticVersion: 'V0.0.1',
      internalVersion: 1,
      createFlag: true,
      status: I18nIndexStatus.ACTIVE,
      languages: {
        en: {},
        defaultLanguage: 'en',
      },
    });
    project.addLanguage('modref03', 'en', mod1.getItems('en'));
    expect(mod3.getModuleItem()).toStrictEqual({
      internalName: 'modref03__V0.0.1__1',
      semanticVersion: 'V0.0.1',
      internalVersion: 1,
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
    expect(project.getModuleReferences()).toStrictEqual(['modref01', 'modref03']);
    // console.log(JSON.stringify(project.getProjectItem(),undefined,2));
    expect(project.getProjectItem()).toStrictEqual({
      modules: {
        modref01: {
          internalName: 'test02b__V0.1.0__2',
          semanticVersion: 'V0.1.0',
          internalVersion: 2,
          status: 1,
          createFlag: true,
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
        },
        modref03: {
          internalName: 'modref03__V0.0.1__1',
          semanticVersion: 'V0.0.1',
          internalVersion: 1,
          status: 1,
          createFlag: true,
          languages: {
            en: {
              logon: 'logon',
              logout: 'logout',
              signin: 'signin',
              hello: 'hello',
            },
            defaultLanguage: 'en',
          },
        },
      },
      createFlag: true,
    });
  });

  test('I18nOneProject-Get', () => {
    var project: I18nOneProject = new I18nOneProject();
    var mod1 = project.addModule('modref01', mod01);
    expect(mod1).toBeTruthy();
    expect(Object.keys(mod1.getModuleItem()).sort()).toStrictEqual(Object.keys(mod01).sort());
    expect(mod1.getModuleItem()).toStrictEqual(mod01);
    expect(mod1.createFlag).toBeTruthy();
    mod1.createFlag = false;
    expect(mod1.createFlag).toBeFalsy();
    project.createFlag = false;
    expect(project.createFlag).toBeFalsy();

    expect(project.hasKey('modref01', 'de', 'logon')).toBeTruthy();
    expect(project.get('modref01', 'de', 'logon')).toBe('Anmelden');
    expect(project.get('modref01', 'de', 'jump')).toBe('jump');
    expect(project.hasKey('modref01', 'de', 'jump')).toBeFalsy();
    expect(project.get('modref01', 'en', 'jump')).toBe('jump');
    expect(project.hasKey('modref01', 'en', 'jump')).toBeFalsy(); // no autocreate

    expect(project.get('modref01', 'en_US', 'jump')).toBe('jump');
    expect(project.hasKey('modref01', 'en_US', 'jump')).toBeFalsy(); // no autocreate

    expect(project.get('modref04', 'en', 'jump')).toBe('jump');
    expect(project.hasKey('modref04', 'en', 'jump')).toBeFalsy(); // no autocreate

    mod1.createFlag = true;
    expect(mod1.createFlag).toBeTruthy();
    project.createFlag = true;
    expect(project.createFlag).toBeTruthy();

    expect(project.hasKey('modref01', 'de', 'logon')).toBeTruthy();
    expect(project.get('modref01', 'de', 'logon')).toBe('Anmelden');
    expect(project.get('modref01', 'de', 'jump')).toBe('jump');
    expect(project.hasKey('modref01', 'de', 'jump')).toBeFalsy();
    expect(project.hasKey('modref01', 'en', 'jump')).toBeTruthy(); // autocreate
    expect(project.get('modref01', 'en', 'jump')).toBe('jump');

    expect(project.get('modref01', 'en_US', 'fall')).toBe('fall');
    expect(project.hasKey('modref01', 'en', 'fall')).toBeTruthy(); // autocreate
    expect(project.hasKey('modref01', 'en_US', 'fall')).toBeFalsy();

    expect(project.get('modref04', 'en', 'jump')).toBe('jump');
    expect(project.createFlag).toBeTruthy();
    var mod4 = project.getModule('modref04');
    expect(mod4).toBeTruthy();
    expect(mod4.createFlag).toBeTruthy();
    // console.log(JSON.stringify(mod4.getModuleItem()));
    expect(project.hasKey('modref04', 'en', 'jump')).toBeTruthy(); // autocreate
  });

  test('I18nOneProject-Cache', () => {
    var project: I18nOneProject = new I18nOneProject();
    var mod1 = project.addModule('modref01', mod01);
    expect(mod1).toBeTruthy();
    expect(mod1.getModuleItem()).toStrictEqual(mod01);
    project.forceReadAndWrite(false, true);

    let cache_de = project.getLanguageCache('modref01', 'de', null);
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.hasKey('logon')).toBeTruthy();
    expect(cache_de?.hasKey('logout')).toBeTruthy();
    expect(cache_de?.hasKey('signin')).toBeTruthy();
    expect(cache_de?.get('logon')).toBe('Anmelden');
    expect(cache_de?.get('logout')).toBe('Abmelden');
    expect(cache_de?.get('signin')).toBe('Registrieren');
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.get('new stuff')).toBe('new stuff'); // no auto create in "en" i1n==null!
    expect(cache_de?.hasKey('new stuff')).toBeFalsy();
    expect(project.hasKey('modref01', 'en', 'new stuff')).toBeFalsy();
    expect(cache_de?.getSize()).toBe(3);
    expect(mod1.getModuleItem()).toStrictEqual({
      internalName: 'test02b__V0.1.0__2',
      semanticVersion: 'V0.1.0',
      internalVersion: 2,
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
    });
  });
});
