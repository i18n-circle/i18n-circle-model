import { describe, expect, test } from '@jest/globals';
import { I18nContext } from './I18nContext';

import { I18nIndexStatus } from './I18nIndexStatus';
import { I18nOneModule } from './I18nOneModule';

describe('I18nOneModule', () => {
  const test_context: I18nContext = I18nContext.getContext('test-I18nOneLanguage');
  let ls01 = {
    en: {
      logon: 'logon',
      logout: 'logout',
      signin: 'signin',
    },
    de: {
      logon: 'Anmelden',
      logout: 'Abmelden',
      signin: 'Registrieren',
    },
    es: {
      hello: 'óla',
    },
    defaultLanguage: 'en',
  };
  test('I18nOneModule-Basics', () => {
    var oneM: I18nOneModule = I18nOneModule.createFromData('test01a', {}, test_context.extendProject('test01a'));
    expect(oneM).toBeTruthy();
    oneM.status = I18nIndexStatus.ACTIVE;
    oneM.createFlag = true;
    expect(oneM.internalName).toBe('test01a__V0.0.1__1');
    expect(oneM.hasLanguage('en')).toBeTruthy(); // default language
    expect(oneM.hasLanguage('de')).toBeFalsy();
    expect(oneM.hasLanguage('es')).toBeFalsy();

    oneM.addLanguage('en', ls01.en);
    expect(oneM.hasLanguage('de')).toBeFalsy();
    expect(oneM.hasLanguage('es')).toBeFalsy();
    let lkeys = oneM.getLanguageKeys('en');
    expect(lkeys.length).toBe(3);
    expect(lkeys[0]).toBe('logon');
    expect(lkeys[1]).toBe('logout');
    expect(lkeys[2]).toBe('signin');

    oneM.addLanguage('de', ls01.de);
    expect(oneM.hasLanguage('es')).toBeFalsy();
    expect(oneM.hasLanguage('de')).toBeTruthy();
    lkeys = oneM.getLanguageKeys('de');
    expect(lkeys.length).toBe(3);
    expect(lkeys[0]).toBe('logon');
    expect(lkeys[1]).toBe('logout');
    expect(lkeys[2]).toBe('signin');

    oneM.addLanguage('es', ls01.es);
    expect(oneM.hasLanguage('es')).toBeTruthy();
    expect(oneM.hasLanguage('de')).toBeTruthy();
    lkeys = oneM.getLanguageKeys('es');
    expect(lkeys.length).toBe(1);
    expect(lkeys[0]).toBe('hello');

    let cache = oneM.getLanguageCache('test', 'test01a', 'en', null);
    expect(cache?.getSize()).toBe(3);
    expect(cache?.hasKey('logon')).toBeTruthy();
    expect(cache?.hasKey('logout')).toBeTruthy();
    expect(cache?.hasKey('signin')).toBeTruthy();
    expect(cache?.get('logon')).toBe('logon');
    expect(cache?.get('logout')).toBe('logout');
    expect(cache?.get('signin')).toBe('signin');
    expect(cache?.getSize()).toBe(3);

    let cache_de = oneM.getLanguageCache('test', 'test01a', 'de', null);
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.hasKey('logon')).toBeTruthy();
    expect(cache_de?.hasKey('logout')).toBeTruthy();
    expect(cache_de?.hasKey('signin')).toBeTruthy();
    expect(cache_de?.get('logon')).toBe('Anmelden');
    expect(cache_de?.get('logout')).toBe('Abmelden');
    expect(cache_de?.get('signin')).toBe('Registrieren');
    expect(cache_de?.getSize()).toBe(3);

    expect(oneM.getOrCreateItem('de', 'hello')).toBe('hello');
    expect(cache_de?.getSize()).toBe(3); // no change at the 'de'
    expect(cache_de?.hasKey('hello')).toBeFalsy();
    expect(cache?.getSize()).toBe(4); // update via subject
    expect(cache?.hasKey('hello')).toBeTruthy();
    expect(oneM.hasKey('de', 'hello')).toBeFalsy(); // only 'en' was updated
    expect(oneM.hasKey('en', 'hello')).toBeTruthy(); // only 'en' was updated

    let cache_es = oneM.getLanguageCache('test', 'test01a', 'es', null);
    expect(cache_es?.getSize()).toBe(1);
    expect(cache_es?.hasKey('hello')).toBeTruthy();
    expect(cache_es?.get('hello')).toBe('óla');
    expect(cache_es?.hasKey('logon')).toBeFalsy();
    oneM.setItem('es', 'logon', 'entrar al sistema');
    expect(cache_es?.hasKey('logon')).toBeTruthy();
    expect(cache_es?.get('logon')).toBe('entrar al sistema');
    expect(cache_es?.getSize()).toBe(2); // update via subject
    expect(cache_de?.getSize()).toBe(3); //  no change
    expect(cache?.getSize()).toBe(4); // no change
    lkeys = oneM.getLanguageKeys('es');
    expect(lkeys.length).toBe(2);
    expect(lkeys[0]).toBe('hello');
    expect(lkeys[1]).toBe('logon');

    expect(cache_es?.hasKey('hello')).toBeTruthy();
    oneM.deleteItem('es', 'hello');
    expect(cache_es?.getSize()).toBe(1);
    expect(cache_es?.hasKey('hello')).toBeFalsy();
    lkeys = oneM.getLanguageKeys('es');
    expect(lkeys.length).toBe(1);
    expect(lkeys[0]).toBe('logon');

    // console.log('329',JSON.stringify(oneM.getModule(),undefined,2));
  });
  var mod01 = {
    internalName: 'test02b__V0.1.0__2',
    semanticVersion: 'V0.1.0',
    internalVersion: 2,
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
  };
  test('I18nOneModule-TanslateActions', () => {
    var oneM: I18nOneModule = I18nOneModule.createFromData('test02b', mod01, test_context.extendProject('test02b'));
    expect(oneM).toBeTruthy();
    oneM.status = I18nIndexStatus.ACTIVE;
    oneM.createFlag = true;
    expect(oneM.internalName).toBe('test02b__V0.1.0__2');
    expect(oneM.hasLanguage('en')).toBeTruthy(); // default language
    expect(oneM.hasLanguage('de')).toBeTruthy();
    expect(oneM.hasLanguage('es')).toBeTruthy();

    let cache = oneM.getLanguageCache('test', 'test02b', 'en', null);
    expect(cache?.getSize()).toBe(4);
    expect(cache?.hasKey('logon')).toBeTruthy();
    expect(cache?.hasKey('logout')).toBeTruthy();
    expect(cache?.hasKey('signin')).toBeTruthy();
    expect(cache?.hasKey('hello')).toBeTruthy();
    expect(cache?.get('logon')).toBe('logon');
    expect(cache?.get('logon')).toBe('logon');
    expect(cache?.get('logout')).toBe('logout');
    expect(cache?.get('hello')).toBe('hello');
    expect(cache?.getSize()).toBe(4);

    let cache_de = oneM.getLanguageCache('test', 'test02b', 'de', null);
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.hasKey('logon')).toBeTruthy();
    expect(cache_de?.hasKey('logout')).toBeTruthy();
    expect(cache_de?.hasKey('signin')).toBeTruthy();
    expect(cache_de?.get('logon')).toBe('Anmelden');
    expect(cache_de?.get('logout')).toBe('Abmelden');
    expect(cache_de?.get('signin')).toBe('Registrieren');
    expect(cache_de?.getSize()).toBe(3);

    let cache_es = oneM.getLanguageCache('test', 'test02b', 'es', null);
    expect(cache_es?.getSize()).toBe(2);
    expect(cache_es?.hasKey('hello')).toBeTruthy();
    expect(cache_es?.hasKey('goodbye')).toBeTruthy();
    expect(cache_es?.get('goodbye')).toBe('adiós');
    expect(cache_es?.get('hello')).toBe('óla');

    expect(oneM.getAllItems()).toStrictEqual({
      en: {
        logon: 'logon',
        logout: 'logout',
        signin: 'signin',
        hello: 'hello',
      },
      de: { logon: 'Anmelden', logout: 'Abmelden', signin: 'Registrieren' },
      es: { hello: 'óla', goodbye: 'adiós' },
      defaultLanguage: 'en',
    });
    let actionlist = oneM.checkConsistency('test02b').getTransScript();
    expect(actionlist).toStrictEqual([
      '[test02b.en=>test02b.de]: NEW_KEY(hello,hello)',
      '[test02b.en=>test02b.es]: NEW_KEY(logon,logon)',
      '[test02b.en=>test02b.es]: NEW_KEY(logout,logout)',
      '[test02b.en=>test02b.es]: NEW_KEY(signin,signin)',
      '[test02b.en=>test02b.es]: DEL_KEY(goodbye)',
    ]);
    // console.log(516,oneM.getAllItems(),actionlist);
    expect(oneM.getModuleItem()).toStrictEqual({
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
    // console.log(535,JSON.stringify(oneM.getModule(),undefined,2));
  });
});
