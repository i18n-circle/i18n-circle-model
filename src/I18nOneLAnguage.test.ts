import { describe, expect, test } from '@jest/globals';

import { I18nOneLanguage } from './I18nOneLanguage';
import { I18nOperationMode } from './I18nOperationMode';
import { I18nTranslateActions } from './I18nTranslateActions';

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
