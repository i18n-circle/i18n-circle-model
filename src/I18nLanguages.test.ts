import { describe, expect, test } from '@jest/globals';
import { I18nContext } from './I18nContext';

import { I18nLanguages } from './I18nLanguages';
import { I18nTranslateActions } from './I18nTranslateActions';

describe('I18nLanguages', () => {
  const test_context = I18nContext.getContext('test-I18nLanguages',"testmod");

  let l01_en = {
    logon: 'logon',
    logout: 'logout',
    signin: 'signin',
  };
  let l01_de = {
    logon: 'Anmelden',
    logout: 'Abmelden',
    signin: 'Registrieren',
  };
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
  let ls02 = {
    en: {
      logon: 'logon',
      logout: 'logout',
      register: 'register',
    },
    de: {
      logon: 'Anmelden',
      logout: 'Verlassem',
    },
    fr: {
      logon: 'entrer',
      hello: 'bonjour',
    },
    defaultLanguage: 'en',
  };

  test('I18nLanguages-Basics', () => {
    let oneLS = new I18nLanguages({}, test_context.extendModule('Basics'));
    expect(oneLS).toBeTruthy();
    // console.log(oneLS);
    expect(oneLS.hasLanguage('en')).toBeTruthy(); // default!!
    expect(oneLS.hasLanguage('de')).toBeFalsy();
    expect(oneLS.getItem('en', 'logon')).toBe('logon');
    expect(oneLS.getItem('de', 'logon')).toBe('logon');
    expect(oneLS.hasKey('en', 'logon')).toBeFalsy();
    expect(oneLS.hasKey('de', 'logon')).toBeFalsy();

    oneLS.addLanguage('en', l01_en);
    // console.log('166',JSON.stringify(oneLS,undefined,2));
    expect(oneLS.hasLanguage('en')).toBeTruthy();
    expect(oneLS.hasLanguage('de')).toBeFalsy();
    expect(oneLS.getItem('en', 'logon')).toBe('logon');
    expect(oneLS.getItem('de', 'logon')).toBe('logon');
    expect(oneLS.hasKey('en', 'logon')).toBeTruthy();
    expect(oneLS.hasKey('de', 'logon')).toBeFalsy();

    oneLS.addLanguage('de', l01_de);
    expect(oneLS.hasLanguage('en')).toBeTruthy();
    expect(oneLS.hasLanguage('de')).toBeTruthy();
    expect(oneLS.getItem('en', 'logon')).toBe('logon');
    expect(oneLS.getItem('de', 'logon')).toBe('Anmelden');
    expect(oneLS.hasKey('en', 'logon')).toBeTruthy();
    expect(oneLS.hasKey('de', 'logon')).toBeTruthy();
    // console.log('181',JSON.stringify(oneLS,undefined,2));

    expect(oneLS.getOrCreateItem('en', 'logon')).toBe('logon');
    expect(oneLS.hasKey('en', 'register')).toBeFalsy();
    expect(oneLS.hasKey('de', 'register')).toBeFalsy();

    expect(oneLS.getOrCreateItem('de', 'register')).toBe('register');
    expect(oneLS.hasKey('en', 'register')).toBeTruthy();
    expect(oneLS.hasKey('de', 'register')).toBeFalsy();
    expect(oneLS.getItem('de', 'register')).toBe('register');

    oneLS.setItem('de', 'register', 'Registrieren');
    expect(oneLS.hasKey('de', 'register')).toBeTruthy();
    expect(oneLS.getItem('de', 'register')).toBe('Registrieren');
    expect(oneLS.hasKey('fr', 'register')).toBeFalsy();

    // console.log('204',JSON.stringify(oneLS.getAllItems(),undefined,2));
    expect(oneLS.getOrCreateItem('fr', 'register')).toBe('register');
    expect(oneLS.hasLanguage('fr')).toBeFalsy();
    expect(oneLS.hasKey('fr', 'register')).toBeFalsy();
    expect(oneLS.getItem('fr', 'register')).toBe('register');

    oneLS.setItem('fr', 'register', 'enregistrer');
    expect(oneLS.hasLanguage('fr')).toBeTruthy();
    expect(oneLS.hasKey('fr', 'register')).toBeTruthy();
    expect(oneLS.getItem('fr', 'register')).toBe('enregistrer');
    // console.log('220',JSON.stringify(oneLS.getAllItems(),undefined,2));
  });

  test('I18nLanguages-Transactions', () => {
    let oneLS = new I18nLanguages(ls01, test_context.extendModule('Basics'));
    expect(oneLS).toBeTruthy();
    let twoLS = new I18nLanguages(ls02, test_context.extendModule('Basics'));
    expect(twoLS).toBeTruthy();
    let transact: I18nTranslateActions = twoLS.compareLanguages('mod1', oneLS, 'mod2');
    var actlist = transact.getTransScript();
    // console.log(275,actlist);
    expect(actlist.length).toBe(8);
    expect(actlist).toStrictEqual([
      '[mod1.en=>mod2.en]: NEW_KEY(signin,signin)',
      '[mod1.en=>mod2.en]: DEL_KEY(register)',
      '[mod1.de=>mod2.de]: UPDATE_VALUE(logout,Verlassem)',
      '[mod1.en=>mod2.es]: NEW_LANGUAGE',
      '[mod1.en=>mod2.es]: NEW_KEY(logon,logon)',
      '[mod1.en=>mod2.es]: NEW_KEY(logout,logout)',
      '[mod1.en=>mod2.es]: DEL_KEY(hello)',
      '[mod1.en=>mod2.fr]: DEL_LANGUAGE',
    ]);
  });
  test('I18nLanguages-checkConsistency', () => {
    let twoLS = new I18nLanguages(ls02, test_context.extendModule('Basics'));
    var actlist = twoLS.checkConsistency('mod0').getTransScript();
    expect(actlist).toStrictEqual([
      '[mod0.en=>mod0.de]: NEW_KEY(register,register)',
      '[mod0.en=>mod0.fr]: NEW_KEY(logout,logout)',
      '[mod0.en=>mod0.fr]: NEW_KEY(register,register)',
      '[mod0.en=>mod0.fr]: DEL_KEY(hello)',
    ]);
    // console.log(299,ls02,actlist);
  });
  test('I18nLanguages-I18nCache', () => {
    let twoLS = new I18nLanguages(ls02, test_context.extendModule('Basics'));
    expect(twoLS).toBeTruthy();
    let cache = twoLS.getLanguageCache('test', 'en', null);
    expect(cache?.getSize()).toBe(3);
    expect(cache?.hasKey('logon')).toBeTruthy();
    expect(cache?.hasKey('logout')).toBeTruthy();
    expect(cache?.hasKey('register')).toBeTruthy();
    expect(cache?.get('logon')).toBe('logon');
    expect(cache?.get('logout')).toBe('logout');
    expect(cache?.get('register')).toBe('register');
    twoLS.deleteItem('en', 'register');
    expect(cache?.getSize()).toBe(2);
    expect(cache?.hasKey('register')).toBeFalsy(); // test auto update
    expect(cache?.get('change password')).toBe('change password');
    expect(cache?.hasKey('change password')).toBeFalsy();
    // no auto update, because no i18n in cache!
    expect(cache?.getSize()).toBe(2);
    cache = twoLS.getLanguageCache('test', 'de', null);
    expect(cache?.getSize()).toBe(2);
    expect(cache?.get('logon')).toBe('Anmelden');
    expect(cache?.get('logout')).toBe('Verlassem');
    twoLS.setItem('de', 'logout', 'Abmelden');
    expect(cache?.get('logout')).toBe('Abmelden'); // test auto update
    expect(cache?.getSize()).toBe(2);
    cache = twoLS.getLanguageCache('test', 'fr', null);
    expect(cache?.getSize()).toBe(2);
    expect(cache?.get('logon')).toBe('entrer');
    expect(cache?.get('hello')).toBe('bonjour');
    expect(cache?.getSize()).toBe(2);
  });
});
