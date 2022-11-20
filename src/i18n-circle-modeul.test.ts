import {describe, expect, test} from '@jest/globals';
import exp from 'constants';
import { I18nOneLanguage,I18nLanguages,
  I18nTranslateActions } from './i18n-circle-model';

describe('I18nOneLanguage', () => {

  test('I18nOneLanguage-Basics', () => {
      let one = new I18nOneLanguage({});
      expect(one).toBeTruthy();
      expect(Object.keys(one.getItems()).length).toBe(0);
      expect(one.getKeys().length).toBe(0);
      expect(one.getHistory(false).length).toBe(0);
      expect(one.getItem("test1")).toBe('test1');
      expect(one.hasKey("test1")).toBeFalsy();
      one.setItem("test1","test1-val");
      expect(Object.keys(one.getItems()).length).toBe(1);
      expect(one.getKeys().length).toBe(1);
      expect(one.getHistory(false).length).toBe(1);
      expect(one.getItem("test1")).toBe('test1-val');
      expect(one.hasKey("test1")).toBeTruthy();
      one.setItem("test1","test1-val");
      expect(Object.keys(one.getItems()).length).toBe(1);
      expect(one.getKeys().length).toBe(1);
      expect(one.getHistory(false).length).toBe(1);
      expect(one.getItem("test1")).toBe('test1-val');
      one.setItem("test1","test1-val-update");
      expect(Object.keys(one.getItems()).length).toBe(1);
      expect(one.getKeys().length).toBe(1);
      expect(one.getHistory(true).length).toBe(2);
      expect(one.getHistory(false).length).toBe(0);
      expect(one.getItem("test1")).toBe('test1-val-update');
      expect(one.hasKey("test1")).toBeTruthy();
      one.deleteItem("test1");
      expect(Object.keys(one.getItems()).length).toBe(0);
      expect(one.getKeys().length).toBe(0);
      expect(one.hasKey("test1")).toBeFalsy();
      expect(one.getItem("test1")).toBe('test1');
      one.setItem("test1","test2-val");
      expect(Object.keys(one.getItems()).length).toBe(1);
      expect(one.getKeys().length).toBe(1);
      expect(one.getHistory(true).length).toBe(1);
      expect(one.getHistory(false).length).toBe(0);
      expect(one.getItem("test1")).toBe('test2-val');
      expect(one.hasKey("test1")).toBeTruthy();
      one.emptyItems();
      expect(one.getHistory(false).length).toBe(0);
      expect(one.getKeys().length).toBe(0);
      expect(Object.keys(one.getItems()).length).toBe(0);
      expect(one.getItem("test1")).toBe('test1');
  });
  test('I18nOneLanguage-Merging', () => {
    let one = new I18nOneLanguage({});
    expect(one).toBeTruthy();
    let two = new I18nOneLanguage({});
    expect(two).toBeTruthy();
    one.setItem("test1","test1-val1");
    one.setItem("test2","test2-val1");
    one.setItem("test3","test3-val1");
    one.setItem("test4","test4-val1");
    one.setItem("test5","test5-val1");
    expect(one.getHistory(true).length).toBe(5);
    expect(one.getKeys().length).toBe(5);
    expect(Object.keys(one.getItems()).length).toBe(5);
    two.setItem("test6","test6-val2");
    two.setItem("test7","test7-val2");
    two.setItem("test8","test8-val2");
    two.setItem("test2","test2-val2");
    two.setItem("test4","test4-val2");
    expect(two.getHistory(true).length).toBe(5);
    expect(two.getKeys().length).toBe(5);
    expect(Object.keys(two.getItems()).length).toBe(5);
    one.mergeItems(two);
    // console.log(one);
    expect(one.getHistory(true).length).toBe(0);
    expect(one.getKeys().length).toBe(8);
    expect(Object.keys(one.getItems()).length).toBe(8);
    expect(one.getItem("test1")).toBe('test1-val1');
    expect(one.getItem("test2")).toBe('test2-val2');
    expect(one.getItem("test3")).toBe('test3-val1');
    expect(one.getItem("test4")).toBe('test4-val2');
    expect(one.getItem("test5")).toBe('test5-val1');
    expect(one.getItem("test6")).toBe('test6-val2');
    expect(one.getItem("test7")).toBe('test7-val2');
    expect(one.getItem("test8")).toBe('test8-val2');
    // init with value field from one to three.
    let three = new I18nOneLanguage(one.getItems());
    expect(three.getHistory(false).length).toBe(0);
    expect(three.getKeys().length).toBe(8);
    expect(Object.keys(three.getItems()).length).toBe(8);
    expect(three.getItem("test1")).toBe('test1-val1');
    expect(three.getItem("test2")).toBe('test2-val2');
    expect(three.getItem("test3")).toBe('test3-val1');
    expect(three.getItem("test4")).toBe('test4-val2');
    expect(three.getItem("test5")).toBe('test5-val1');
    expect(three.getItem("test6")).toBe('test6-val2');
    expect(three.getItem("test7")).toBe('test7-val2');
    expect(three.getItem("test8")).toBe('test8-val2');
    three.deleteItem('test8');
    expect(three.getHistory(false).length).toBe(0);
    expect(three.getKeys().length).toBe(7);
    expect(Object.keys(three.getItems()).length).toBe(7);
    expect(three.getItem("test8")).toBe('test8');
    expect(  one.getItem("test8")).toBe('test8-val2');
  });
  test('I18nOneLanguage-Transactions', () => {
    let one = new I18nOneLanguage({});
    expect(one).toBeTruthy();
    let two = new I18nOneLanguage({});
    expect(two).toBeTruthy();
    one.setItem("test1","test1-val1");
    one.setItem("test2","test2-val1");
    one.setItem("test3","test3-val1");
    one.setItem("test4","test4-val1");
    one.setItem("test5","test5-val1");
    expect(one.getHistory(true).length).toBe(5);
    expect(one.getKeys().length).toBe(5);
    expect(Object.keys(one.getItems()).length).toBe(5);
    two.setItem("test6","test6-val2");
    two.setItem("test7","test7-val2");
    two.setItem("test8","test8-val2");
    two.setItem("test2","test2-val2");
    two.setItem("test4","test4-val2");
    expect(two.getHistory(true).length).toBe(5);
    expect(two.getKeys().length).toBe(5);
    expect(Object.keys(two.getItems()).length).toBe(5);
    let transact : I18nTranslateActions = two.comparePairs(
        'mod1','lng1',one,'mod2','lng2');
    expect(transact.getActionSize()).toBe(6);
    var actlist = transact.getTransScript();
    expect(actlist.length).toBe(6);
    expect(actlist[0]).toBe("[mod1.lng1=>mod2.lng2]: NEW_KEY(test6)");
    expect(actlist[1]).toBe("[mod1.lng1=>mod2.lng2]: NEW_KEY(test7)");
    expect(actlist[2]).toBe("[mod1.lng1=>mod2.lng2]: NEW_KEY(test8)");
    expect(actlist[3]).toBe("[mod1.lng1=>mod2.lng2]: DEL_KEY(test1)");
    expect(actlist[4]).toBe("[mod1.lng1=>mod2.lng2]: DEL_KEY(test3)");
    expect(actlist[5]).toBe("[mod1.lng1=>mod2.lng2]: DEL_KEY(test5)");
    transact = two.comparePairs(
        'mod1','lng1',one,'mod2','lng2',true);
    expect(transact.getActions().length).toBe(8);
    actlist = transact.getTransScript();
    expect(actlist.length).toBe(8);
    expect(actlist[0]).toBe("[mod1.lng1=>mod2.lng2]: NEW_KEY(test6)");
    expect(actlist[1]).toBe("[mod1.lng1=>mod2.lng2]: NEW_KEY(test7)");
    expect(actlist[2]).toBe("[mod1.lng1=>mod2.lng2]: NEW_KEY(test8)");
    expect(actlist[3]).toBe(
      "[mod1.lng1=>mod2.lng2]: UPDATE_VALUE(test2,test2-val2)");1
    expect(actlist[4]).toBe(
      "[mod1.lng1=>mod2.lng2]: UPDATE_VALUE(test4,test4-val2)");1
    expect(actlist[5]).toBe("[mod1.lng1=>mod2.lng2]: DEL_KEY(test1)");
    expect(actlist[6]).toBe("[mod1.lng1=>mod2.lng2]: DEL_KEY(test3)");
    expect(actlist[7]).toBe("[mod1.lng1=>mod2.lng2]: DEL_KEY(test5)");
});
});

describe('I18nLanguages', () => {

  let l01_en = {
    'logon' : 'logon',
    'logout' : 'logout',
    'signin' : 'signin'
  };
  let l01_de = {
    'logon' : 'Anmelden',
    'logout' : 'Abmelden',
    'signin' : 'Registrieren'
  };
  let ls01 = {
    "en": {
      "logon": "logon",
      "logout": "logout",
      "signin": "signin"
    },
    "de": {
      "logon": "Anmelden",
      "logout": "Abmelden",
      "signin": "Registrieren"
    },
    "es": {
      "hello": "óla",
    },
    "defaultLanguage": "en"
  };
  let ls02 = {
    "en": {
      "logon": "logon",
      "logout": "logout",
      "register": "register"
    },
    "de": {
      "logon": "Anmelden",
      "logout": "Verlassem",
    },
    "fr": {
      "logon": "entrer",
      "hello": "bonjour",
    },
    "defaultLanguage": "en"
  }

  test('I18nLanguages-Basics', () => {
      let oneLS = new I18nLanguages({});
      expect(oneLS).toBeTruthy();
      // console.log(oneLS);
      expect(oneLS.hasLanguage('en')).toBeTruthy(); // default!!
      expect(oneLS.hasLanguage('de')).toBeFalsy();
      expect(oneLS.getItem('en','logon')).toBe('logon');
      expect(oneLS.getItem('de','logon')).toBe('logon');
      expect(oneLS.hasKey('en','logon')).toBeFalsy();
      expect(oneLS.hasKey('de','logon')).toBeFalsy();

      oneLS.addLanguage('en',l01_en);
      // console.log('166',JSON.stringify(oneLS,undefined,2));
      expect(oneLS.hasLanguage('en')).toBeTruthy();
      expect(oneLS.hasLanguage('de')).toBeFalsy();
      expect(oneLS.getItem('en','logon')).toBe('logon');
      expect(oneLS.getItem('de','logon')).toBe('logon');
      expect(oneLS.hasKey('en','logon')).toBeTruthy();
      expect(oneLS.hasKey('de','logon')).toBeFalsy();

      oneLS.addLanguage('de',l01_de);
      expect(oneLS.hasLanguage('en')).toBeTruthy();
      expect(oneLS.hasLanguage('de')).toBeTruthy();
      expect(oneLS.getItem('en','logon')).toBe('logon');
      expect(oneLS.getItem('de','logon')).toBe('Anmelden');
      expect(oneLS.hasKey('en','logon')).toBeTruthy();
      expect(oneLS.hasKey('de','logon')).toBeTruthy();
      // console.log('181',JSON.stringify(oneLS,undefined,2));

      expect(oneLS.getOrCreateItem('en','logon')).toBe('logon');
      expect(oneLS.hasKey('en','register')).toBeFalsy();
      expect(oneLS.hasKey('de','register')).toBeFalsy();
      expect(oneLS.getHistory('en',false).length).toBe(0);
      expect(oneLS.getHistory('de',false).length).toBe(0);

      expect(oneLS.getOrCreateItem('de','register')).toBe('register');
      expect(oneLS.getHistory('en',false).length).toBe(1);
      expect(oneLS.getHistory('de',false).length).toBe(0);
      expect(oneLS.hasKey('en','register')).toBeTruthy();
      expect(oneLS.hasKey('de','register')).toBeFalsy();
      expect(oneLS.getItem('de','register')).toBe("register");

      oneLS.setItem('de','register','Registrieren');
      expect(oneLS.getHistory('en',false).length).toBe(1);
      expect(oneLS.getHistory('de',false).length).toBe(1);
      expect(oneLS.hasKey('de','register')).toBeTruthy();
      expect(oneLS.getItem('de','register')).toBe("Registrieren");
      expect(oneLS.hasKey('fr','register')).toBeFalsy();

      // console.log('204',JSON.stringify(oneLS.getAllItems(),undefined,2));
      expect(oneLS.getOrCreateItem('fr','register')).toBe("register");
      expect(oneLS.hasLanguage('fr')).toBeFalsy();
      expect(oneLS.hasKey('fr','register')).toBeFalsy();
      expect(oneLS.getItem('fr','register')).toBe("register");
      expect(oneLS.getHistory('en',true).length).toBe(1);
      expect(oneLS.getHistory('fr',true).length).toBe(0);
      expect(oneLS.getHistory('de',true).length).toBe(1);
  
      oneLS.setItem('fr','register','enregistrer');
      expect(oneLS.hasLanguage('fr')).toBeTruthy();
      expect(oneLS.hasKey('fr','register')).toBeTruthy();
      expect(oneLS.getItem('fr','register')).toBe("enregistrer");
      expect(oneLS.getHistory('en',true).length).toBe(0);
      expect(oneLS.getHistory('fr',true).length).toBe(1);
      expect(oneLS.getHistory('de',true).length).toBe(0);
      // console.log('220',JSON.stringify(oneLS.getAllItems(),undefined,2));
    });
    
  test('I18nLanguages-Transactions', () => {
    let oneLS = new I18nLanguages(ls01);
    expect(oneLS).toBeTruthy();
    let twoLS = new I18nLanguages(ls02);
    expect(twoLS).toBeTruthy();
    let transact : I18nTranslateActions =
      oneLS.compareLanguages('mod1',twoLS,'mod2');
    var actlist = transact.getTransScript();
    expect(actlist.length).toBe(10);
    expect(actlist[0]).toBe("[mod1.en=>mod2.en]: NEW_KEY(register)");
    expect(actlist[1]).toBe("[mod1.en=>mod2.en]: DEL_KEY(signin)");
    expect(actlist[2]).toBe("[mod1.en=>mod2.de]: DEL_KEY(signin)");
    expect(actlist[3]).toBe("[mod1.de=>mod2.de]: UPDATE_VALUE(logout,Verlassem)");
    expect(actlist[4]).toBe("[mod1.de=>mod2.de]: DEL_KEY(signin)");
    expect(actlist[5]).toBe("[mod1.en=>mod2.fr]: NEW_LANGUAGE");
    expect(actlist[6]).toBe("[mod1.en=>mod2.fr]: NEW_KEY(logout)");
    expect(actlist[7]).toBe("[mod1.en=>mod2.fr]: NEW_KEY(signin)");
    expect(actlist[8]).toBe("[mod1.en=>mod2.fr]: DEL_KEY(hello)");
    expect(actlist[9]).toBe("[mod1.en=>mod2.es]: DEL_LANGUAGE");
  });
});
  