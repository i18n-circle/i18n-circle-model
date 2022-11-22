import { describe, expect, test } from '@jest/globals';

import { I18nCache } from './I18nCache';
import { I18nCircleModel } from './I18nCircleModel';
import { I18nLanguages } from './I18nLanguages';
import { I18nOneLanguage } from './I18nOneLanguage';
import { I18nOneModule } from './I18nOneModule';
import { I18nOperationMode } from './I18nOperationMode';
import { I18nTranslateAction } from './I18nTranslateAction';
import { I18nTranslateActions } from './I18nTranslateActions';
import { I18nTranslateActionType } from './I18nTranslateActionType';

describe('I18nOneLanguage', () => {
  test('I18nOneLanguage-Basics', () => {
    let one = new I18nOneLanguage({});
    expect(one).toBeTruthy();
    expect(Object.keys(one.getItems()).length).toBe(0);
    expect(one.getKeys().length).toBe(0);
    expect(one.getItem('test1')).toBe('test1');
    expect(one.hasKey('test1')).toBeFalsy();
    one.setItem('test1', 'test1-val');
    expect(Object.keys(one.getItems()).length).toBe(1);
    expect(one.getKeys().length).toBe(1);
    expect(one.getItem('test1')).toBe('test1-val');
    expect(one.hasKey('test1')).toBeTruthy();
    one.setItem('test1', 'test1-val');
    expect(Object.keys(one.getItems()).length).toBe(1);
    expect(one.getKeys().length).toBe(1);
    expect(one.getItem('test1')).toBe('test1-val');
    one.setItem('test1', 'test1-val-update');
    expect(Object.keys(one.getItems()).length).toBe(1);
    expect(one.getKeys().length).toBe(1);
    expect(one.getItem('test1')).toBe('test1-val-update');
    expect(one.hasKey('test1')).toBeTruthy();
    one.deleteItem('test1');
    expect(Object.keys(one.getItems()).length).toBe(0);
    expect(one.getKeys().length).toBe(0);
    expect(one.hasKey('test1')).toBeFalsy();
    expect(one.getItem('test1')).toBe('test1');
    one.setItem('test1', 'test2-val');
    expect(Object.keys(one.getItems()).length).toBe(1);
    expect(one.getKeys().length).toBe(1);
    expect(one.getItem('test1')).toBe('test2-val');
    expect(one.hasKey('test1')).toBeTruthy();
    one.emptyItems();
    expect(one.getKeys().length).toBe(0);
    expect(Object.keys(one.getItems()).length).toBe(0);
    expect(one.getItem('test1')).toBe('test1');
  });
  test('I18nOneLanguage-Merging', () => {
    let one = new I18nOneLanguage({});
    expect(one).toBeTruthy();
    let two = new I18nOneLanguage({});
    expect(two).toBeTruthy();
    one.setItem('test1', 'test1-val1');
    one.setItem('test2', 'test2-val1');
    one.setItem('test3', 'test3-val1');
    one.setItem('test4', 'test4-val1');
    one.setItem('test5', 'test5-val1');
    expect(one.getKeys().length).toBe(5);
    expect(Object.keys(one.getItems()).length).toBe(5);
    two.setItem('test6', 'test6-val2');
    two.setItem('test7', 'test7-val2');
    two.setItem('test8', 'test8-val2');
    two.setItem('test2', 'test2-val2');
    two.setItem('test4', 'test4-val2');
    expect(two.getKeys().length).toBe(5);
    expect(Object.keys(two.getItems()).length).toBe(5);
    one.mergeItems(two);
    // console.log(one);
    expect(one.getKeys().length).toBe(8);
    expect(Object.keys(one.getItems()).length).toBe(8);
    expect(one.getItem('test1')).toBe('test1-val1');
    expect(one.getItem('test2')).toBe('test2-val2');
    expect(one.getItem('test3')).toBe('test3-val1');
    expect(one.getItem('test4')).toBe('test4-val2');
    expect(one.getItem('test5')).toBe('test5-val1');
    expect(one.getItem('test6')).toBe('test6-val2');
    expect(one.getItem('test7')).toBe('test7-val2');
    expect(one.getItem('test8')).toBe('test8-val2');
    // init with value field from one to three.
    let three = new I18nOneLanguage(one.getItems());
    expect(three.getKeys().length).toBe(8);
    expect(Object.keys(three.getItems()).length).toBe(8);
    expect(three.getItem('test1')).toBe('test1-val1');
    expect(three.getItem('test2')).toBe('test2-val2');
    expect(three.getItem('test3')).toBe('test3-val1');
    expect(three.getItem('test4')).toBe('test4-val2');
    expect(three.getItem('test5')).toBe('test5-val1');
    expect(three.getItem('test6')).toBe('test6-val2');
    expect(three.getItem('test7')).toBe('test7-val2');
    expect(three.getItem('test8')).toBe('test8-val2');
    three.deleteItem('test8');
    expect(three.getKeys().length).toBe(7);
    expect(Object.keys(three.getItems()).length).toBe(7);
    expect(three.getItem('test8')).toBe('test8');
    expect(one.getItem('test8')).toBe('test8-val2');
    let cache = three.getLanguageCache('test', 'test', null);
    expect(cache?.getSize()).toBe(7);
    expect(cache.get('test1')).toBe('test1-val1');
    expect(cache.get('test2')).toBe('test2-val2');
    expect(cache.get('test3')).toBe('test3-val1');
    expect(cache.get('test4')).toBe('test4-val2');
    expect(cache.get('test5')).toBe('test5-val1');
    expect(cache.get('test6')).toBe('test6-val2');
    expect(cache.get('test7')).toBe('test7-val2');
    expect(cache?.getSize()).toBe(7);
    expect(cache.get('test9-notexiting')).toBe('test9-notexiting');
    expect(cache?.getSize()).toBe(7); // without i18n!!!
    expect(cache?.hasKey('test9-notexiting')).toBeFalsy();
  });
  test('I18nOneLanguage-Transactions', () => {
    let one = new I18nOneLanguage({});
    expect(one).toBeTruthy();
    let two = new I18nOneLanguage({});
    expect(two).toBeTruthy();
    one.setItem('test1', 'test1-val1');
    one.setItem('test2', 'test2-val1');
    one.setItem('test3', 'test3-val1');
    one.setItem('test4', 'test4-val1');
    one.setItem('test5', 'test5-val1');
    expect(one.getKeys().length).toBe(5);
    expect(Object.keys(one.getItems()).length).toBe(5);
    two.setItem('test6', 'test6-val2');
    two.setItem('test7', 'test7-val2');
    two.setItem('test8', 'test8-val2');
    two.setItem('test2', 'test2-val2');
    two.setItem('test4', 'test4-val2');
    expect(two.getKeys().length).toBe(5);
    expect(Object.keys(two.getItems()).length).toBe(5);
    // console.log("compare",one,two);
    I18nTranslateActions.deleteKeys();
    let transact: I18nTranslateActions = two.comparePairs(
      'mod1',
      'lng1',
      one,
      'mod2',
      'lng2',
      I18nOperationMode.NEW_KEYS_FROM_DEFAULT,
    );
    var actlist = transact.getTransScript();
    // console.log("NEW_KEYS_FROM_DEFAULT",actlist);
    expect(transact.getActionSize()).toBe(6);
    expect(actlist.length).toBe(6);
    expect(actlist).toStrictEqual([
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test6,test6)',
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test7,test7)',
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test8,test8)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test1)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test3)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test5)',
    ]);
    I18nTranslateActions.deleteKeys();
    transact = two.comparePairs('mod1', 'lng1', one, 'mod2', 'lng2', I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG);
    actlist = transact.getTransScript();
    // console.log("UPDATE_VALUES_IN_ONE_LNG",actlist);
    expect(transact.getActions().length).toBe(8);
    expect(actlist.length).toBe(8);
    expect(actlist).toStrictEqual([
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test6,test6)',
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test7,test7)',
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test8,test8)',
      '[mod1.lng1=>mod2.lng2]: UPDATE_VALUE(test2,test2-val2)',
      '[mod1.lng1=>mod2.lng2]: UPDATE_VALUE(test4,test4-val2)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test1)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test3)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test5)',
    ]);

    I18nTranslateActions.deleteKeys();
    transact = two.comparePairs('mod1', 'lng1', one, 'mod2', 'lng2', I18nOperationMode.DEFAULT_LNG);
    expect(transact.getActions().length).toBe(8);
    actlist = transact.getTransScript();
    expect(actlist).toStrictEqual([
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test6,test6)',
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test7,test7)',
      '[mod1.lng1=>mod2.lng2]: NEW_KEY(test8,test8)',
      '[mod1.lng1=>mod2.lng2]: UPDATE_VALUE(test2,test2-val2)',
      '[mod1.lng1=>mod2.lng2]: UPDATE_VALUE(test4,test4-val2)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test1)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test3)',
      '[mod1.lng1=>mod2.lng2]: DEL_KEY(test5)',
    ]);
    // console.log("DEFAULT_LNG",actlist);
  });
});

describe('I18nLanguages', () => {
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
    let oneLS = new I18nLanguages({});
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
    let oneLS = new I18nLanguages(ls01);
    expect(oneLS).toBeTruthy();
    let twoLS = new I18nLanguages(ls02);
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
    let twoLS = new I18nLanguages(ls02);
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
    let twoLS = new I18nLanguages(ls02);
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
describe('I18nOneModule', () => {
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
    var oneM: I18nOneModule = I18nOneModule.createFromData('test01a', {});
    expect(oneM).toBeTruthy();
    expect(oneM.getInternalName()).toBe('test01a__V0.0.1__1');
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

    let cache = oneM.getLanguageCache('test01a', 'en', null);
    expect(cache?.getSize()).toBe(3);
    expect(cache?.hasKey('logon')).toBeTruthy();
    expect(cache?.hasKey('logout')).toBeTruthy();
    expect(cache?.hasKey('signin')).toBeTruthy();
    expect(cache?.get('logon')).toBe('logon');
    expect(cache?.get('logout')).toBe('logout');
    expect(cache?.get('signin')).toBe('signin');
    expect(cache?.getSize()).toBe(3);

    let cache_de = oneM.getLanguageCache('test01a', 'de', null);
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.hasKey('logon')).toBeTruthy();
    expect(cache_de?.hasKey('logout')).toBeTruthy();
    expect(cache_de?.hasKey('signin')).toBeTruthy();
    expect(cache_de?.get('logon')).toBe('Anmelden');
    expect(cache_de?.get('logout')).toBe('Abmelden');
    expect(cache_de?.get('signin')).toBe('Registrieren');
    expect(cache_de?.getSize()).toBe(3);

    expect(oneM.getOrCreateItem('de', 'hello', true)).toBe('hello');
    expect(cache_de?.getSize()).toBe(3); // no change at the 'de'
    expect(cache_de?.hasKey('hello')).toBeFalsy();
    expect(cache?.getSize()).toBe(4); // update via subject
    expect(cache?.hasKey('hello')).toBeTruthy();
    expect(oneM.hasKey('de', 'hello')).toBeFalsy(); // only 'en' was updated
    expect(oneM.hasKey('en', 'hello')).toBeTruthy(); // only 'en' was updated

    let cache_es = oneM.getLanguageCache('test01a', 'es', null);
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
    filepath: 'src/langauges/test02b.json',
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
    var oneM: I18nOneModule = I18nOneModule.createFromData('test02b', mod01);
    expect(oneM).toBeTruthy();
    expect(oneM.getInternalName()).toBe('test02b__V0.1.0__2');
    expect(oneM.hasLanguage('en')).toBeTruthy(); // default language
    expect(oneM.hasLanguage('de')).toBeTruthy();
    expect(oneM.hasLanguage('es')).toBeTruthy();

    let cache = oneM.getLanguageCache('test02b', 'en', null);
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

    let cache_de = oneM.getLanguageCache('test02b', 'de', null);
    expect(cache_de?.getSize()).toBe(3);
    expect(cache_de?.hasKey('logon')).toBeTruthy();
    expect(cache_de?.hasKey('logout')).toBeTruthy();
    expect(cache_de?.hasKey('signin')).toBeTruthy();
    expect(cache_de?.get('logon')).toBe('Anmelden');
    expect(cache_de?.get('logout')).toBe('Abmelden');
    expect(cache_de?.get('signin')).toBe('Registrieren');
    expect(cache_de?.getSize()).toBe(3);

    let cache_es = oneM.getLanguageCache('test02b', 'es', null);
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
    expect(oneM.getModule()).toStrictEqual({
      internalName: 'test02b__V0.1.0__2',
      semanticVersion: 'V0.1.0',
      internalVersion: 2,
      filepath: '',
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
    });
    // console.log(535,JSON.stringify(oneM.getModule(),undefined,2));
  });
});

//     var i18n : I18nCircleModel = new I18nCircleModel();
describe('I18nCircleModel', () => {
  var mod01 = {
    internalName: 'test02b__V0.1.0__2',
    semanticVersion: 'V0.1.0',
    internalVersion: 2,
    filepath: '',
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
    expect(mod3.getModule()).toStrictEqual({
      internalName: 'modref03__V0.0.1__1',
      semanticVersion: 'V0.0.1',
      internalVersion: 1,
      filepath: '',
      createFlag: true,
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
    expect(mod1.getCreateFlag()).toBeTruthy();
    mod1.setCreateFlag(false);
    expect(mod1.getCreateFlag()).toBeFalsy();
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

    mod1.setCreateFlag(true);
    expect(mod1.getCreateFlag()).toBeTruthy();
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
    expect(mod4.getCreateFlag()).toBeTruthy();
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
