import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { I18nChangeAction } from './I18nChangeAction';

import { I18nCircleModel } from './I18nCircleModel';
import { I18nContext } from './I18nContext';
import { I18nIndexStatus } from './I18nIndexStatus';

var tmpActions: string[] = [];
var flagNewText: boolean = false;
var i18nActionMessages: I18nCircleModel = new I18nCircleModel();
i18nActionMessages.defaultContext = I18nContext.getContext('I18n-Circle');
i18nActionMessages.addModule('I18n-Circle', 'I18n-Circle-Model', {
  semanticVersion: 'V0.0.10',
  internalVersion: 2,
  status: 1,
  createFlag: true,
  languages: {
    en: {
      'Create one module': 'Create one module',
      'All Languages added to Module': 'All Languages added to Module',
      'Language added to Module': 'Language added to Module',
      'Set item value for one key': 'Set item value for one key',
      'Module created': 'Module created',
      'Deactivation Changes in OneModule': 'Deactivation Changes in OneModule',
      'Deactivation Changes in Project': 'Deactivation Changes in Project',
      'Activating Changes in OneModule': 'Activating Changes in OneModule',
      'Activating Changes in Project': 'Activating Changes in Project',
      'Added the key to the default language': 'Added the key to the default language',
      'Get item failed.': 'Get item failed.',
      'GSet one module failed, no create flag': 'GSet one module failed, no create flag',
      'Create one project': 'Create one project',
    },
    defaultLanguage: 'en',
  },
});

function lastSteps(num: number): string[] {
  if (tmpActions.length < num) return tmpActions;
  return tmpActions.slice(-num);
}

describe('I18nCircleModel', () => {
  beforeAll(() => {
    I18nCircleModel.subscribeChange().subscribe((value: I18nChangeAction) => {
      if (value.contextToString().startsWith('[I18n-Circle=>')) {
        return;
      }
      if (!i18nActionMessages.hasKey('I18n-Circle', 'I18n-Circle-Model', 'en', value.msg)) {
        i18nActionMessages.get('I18n-Circle', 'I18n-Circle-Model', 'en', value.msg); // auto create message.
        flagNewText = true;
      }
      tmpActions.push(value.action2String());
    });
  });

  afterAll(() => {
    // console.log("tmpActions=",tmpActions);
    if (flagNewText) {
      console.log(
        'i18n collected messages:',
        i18nActionMessages.getModule('I18n-Circle', 'I18n-Circle-Model').getModuleItem(),
      );
    }
  });

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
    var i18n: I18nCircleModel = new I18nCircleModel();
    expect(lastSteps(0)).toHaveLength(0); // no entry, first test case
    var mod1 = i18n.addModule('', 'modref01', mod01);
    expect(mod1).toBeTruthy();

    // console.log("56-modcreate:",lastSteps(0));
    expect(lastSteps(0)).toHaveLength(15); // mod01 has 15 entries
    expect(lastSteps(0)).toStrictEqual([
      'CREATE_MODULE: [defaultproject=>modref01=>=>]I18nOneModule.createFromData(=>modref01)=Create one module',
      'ALL_LANGUAGES_CREATED: [defaultproject=>modref01=>=>]I18nLanguages.constructor(=>)=All Languages added to Module',
      'ADD_LANGUAGE: [defaultproject=>modref01=>=>]I18nLanguages.addLanguage(=>en)=Language added to Module',
      'SET_ITEM: [defaultproject=>modref01=>en=>logon]I18nOneLanguage.setItem(=>logon)=Set item value for one key',
      'SET_ITEM: [defaultproject=>modref01=>en=>logout]I18nOneLanguage.setItem(=>logout)=Set item value for one key',
      'SET_ITEM: [defaultproject=>modref01=>en=>signin]I18nOneLanguage.setItem(=>signin)=Set item value for one key',
      'SET_ITEM: [defaultproject=>modref01=>en=>hello]I18nOneLanguage.setItem(=>hello)=Set item value for one key',
      'ADD_LANGUAGE: [defaultproject=>modref01=>=>]I18nLanguages.addLanguage(=>de)=Language added to Module',
      'SET_ITEM: [defaultproject=>modref01=>de=>logon]I18nOneLanguage.setItem(=>Anmelden)=Set item value for one key',
      'SET_ITEM: [defaultproject=>modref01=>de=>logout]I18nOneLanguage.setItem(=>Abmelden)=Set item value for one key',
      'SET_ITEM: [defaultproject=>modref01=>de=>signin]I18nOneLanguage.setItem(=>Registrieren)=Set item value for one key',
      'ADD_LANGUAGE: [defaultproject=>modref01=>=>]I18nLanguages.addLanguage(=>es)=Language added to Module',
      'SET_ITEM: [defaultproject=>modref01=>es=>hello]I18nOneLanguage.setItem(=>óla)=Set item value for one key',
      'SET_ITEM: [defaultproject=>modref01=>es=>goodbye]I18nOneLanguage.setItem(=>adiós)=Set item value for one key',
      'MODULE_CREATED: [defaultproject=>modref01=>=>]I18nOneModule.constructor(=>test02b__V0.1.0__2)=Module created',
    ]);
    expect(mod1.getModuleItem()).toStrictEqual(mod01);
    var mod2 = i18n.getModule('', 'modref01');
    expect(mod2).toBeTruthy();
    expect(mod2.getModuleItem()).toStrictEqual(mod01);
    // console.log("56-modcreate:",lastSteps(0));
    expect(lastSteps(0)).toHaveLength(15); // mod01 has 15 entries
    var mod3 = i18n.getModule('', 'modref03');
    // console.log("56-modcreate:",lastSteps(4));
    expect(lastSteps(0)).toHaveLength(15 + 4); // mod01 has 15+4 entries
    expect(lastSteps(4)).toHaveLength(4); // mod01 has 4 new entries
    expect(lastSteps(4)).toStrictEqual([
      'CREATE_MODULE: [defaultproject=>modref03=>=>]I18nOneModule.createFromData(=>modref03)=Create one module',
      'ALL_LANGUAGES_CREATED: [defaultproject=>modref03=>=>]I18nLanguages.constructor(=>)=All Languages added to Module',
      'ADD_LANGUAGE: [defaultproject=>modref03=>=>]I18nLanguages.addLanguage(=>en)=Language added to Module',
      'MODULE_CREATED: [defaultproject=>modref03=>=>]I18nOneModule.constructor(=>modref03__V0.0.1__1)=Module created',
    ]);
    expect(mod3).toBeTruthy();
    mod3.status = I18nIndexStatus.ACTIVE;
    expect(lastSteps(0)).toHaveLength(15 + 4); // mod01 has 15+4 entries
    mod3.createFlag = true;
    expect(lastSteps(0)).toHaveLength(15 + 4); // mod01 has 15+4 entries
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
    expect(lastSteps(0)).toHaveLength(15 + 4); // mod01 has 15+4 entries
    i18n.addLanguage('', 'modref03', 'en', mod1.getItems('en'));
    expect(lastSteps(0)).toHaveLength(15 + 4 + 1); // mod01 has 15+4+1 entries
    expect(lastSteps(1)).toStrictEqual([
      'ADD_LANGUAGE: [defaultproject=>modref03=>=>]I18nLanguages.addLanguage(=>en)=Language added to Module',
    ]);
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
    expect(i18n.getModuleReferences()).toStrictEqual(['modref01', 'modref03']);
  });

  test('I18nCircleModel-Get', () => {
    tmpActions = [];
    expect(lastSteps(0)).toHaveLength(0); // mod01 has no entries
    var i18n: I18nCircleModel = new I18nCircleModel();
    expect(lastSteps(0)).toHaveLength(0); // mod01 has no entries
    var mod1 = i18n.addModule('', 'modref01', mod01);
    expect(lastSteps(0)).toHaveLength(15); // mod01 has 15 entries
    expect(mod1).toBeTruthy();
    expect(Object.keys(mod1.getModuleItem()).sort()).toStrictEqual(Object.keys(mod01).sort());
    expect(mod1.getModuleItem()).toStrictEqual(mod01);
    expect(mod1.createFlag).toBeTruthy();
    expect(lastSteps(0)).toHaveLength(15); // mod01 has 15 entries
    mod1.createFlag = false;
    expect(lastSteps(0)).toHaveLength(15 + 1); // mod01 has 15 entries
    expect(lastSteps(1)).toStrictEqual([
      'CREATE_FLAG: [defaultproject=>modref01=>=>]I18nOneModule.createFlag(true=>false)=Deactivation Changes in OneModule',
    ]);
    expect(mod1.createFlag).toBeFalsy();
    i18n.createFlag = false;
    expect(lastSteps(0)).toHaveLength(15 + 2); // mod01 has 15 entries
    // console.log(lastSteps(3));
    expect(i18n.createFlag).toBeFalsy();

    expect(i18n.hasKey('', 'modref01', 'de', 'logon')).toBeTruthy();
    expect(i18n.get('', 'modref01', 'de', 'logon')).toBe('Anmelden');
    expect(i18n.get('', 'modref01', 'de', 'jump')).toBe('jump');
    expect(i18n.hasKey('', 'modref01', 'de', 'jump')).toBeFalsy();
    expect(i18n.get('', 'modref01', 'en', 'jump')).toBe('jump');
    expect(i18n.hasKey('', 'modref01', 'en', 'jump')).toBeFalsy(); // no autocreate

    expect(i18n.get('', 'modref01', 'en_US', 'jump')).toBe('jump');
    expect(i18n.hasKey('', 'modref01', 'en_US', 'jump')).toBeFalsy(); // no autocreate

    expect(i18n.get('', 'modref04', 'en', 'jump')).toBe('jump');
    expect(i18n.hasKey('', 'modref04', 'en', 'jump')).toBeFalsy(); // no autocreate
    expect(lastSteps(0)).toHaveLength(15 + 2 + 4); // mod01 has no more entries then before/readonly.
    expect(lastSteps(4)).toStrictEqual([
      'GET_ITEM_KEY_NOT_FOUND: [defaultproject=>modref01=>de=>jump]I18nLanguages.getItem(=>jump)=Get item failed.',
      'GET_ITEM_KEY_NOT_FOUND: [defaultproject=>modref01=>en=>jump]I18nLanguages.getItem(=>jump)=Get item failed.',
      'GET_ITEM_KEY_NOT_FOUND: [defaultproject=>modref01=>en_US=>jump]I18nLanguages.getItem(=>jump)=Get item failed.',
      'NO_GET_MODULE_NO_CREATE_FLAG: [defaultproject=>=>=>]I18nOneProject.getModule(=>modref04)=GSet one module failed, no create flag',
    ]);

    mod1.createFlag = true;
    expect(lastSteps(0)).toHaveLength(21 + 1); // mod01 has 15 entries
    expect(lastSteps(1)).toStrictEqual([
      'CREATE_FLAG: [defaultproject=>modref01=>=>]I18nOneModule.createFlag(false=>true)=Activating Changes in OneModule',
    ]);
    expect(mod1.createFlag).toBeTruthy();
    i18n.createFlag = true;
    expect(lastSteps(0)).toHaveLength(21 + 2); // mod01 has 15 entries
    expect(lastSteps(1)).toStrictEqual([
      'CREATE_FLAG: [defaultproject=>=>=>]I18nOneProject.createFlag(false=>true)=Activating Changes in Project',
    ]);
    expect(i18n.createFlag).toBeTruthy();

    expect(i18n.hasKey('', 'modref01', 'de', 'logon')).toBeTruthy();
    expect(i18n.get('', 'modref01', 'de', 'logon')).toBe('Anmelden');
    expect(lastSteps(0)).toHaveLength(23); // mod01 has 19 entries
    expect(i18n.get('', 'modref01', 'de', 'jump')).toBe('jump');
    expect(lastSteps(0)).toHaveLength(23 + 2); // mod01 has 19 entries
    expect(lastSteps(2)).toStrictEqual([
      'SET_ITEM: [defaultproject=>modref01=>en=>jump]I18nOneLanguage.setItem(=>jump)=Set item value for one key',
      'CREATE_DEFAULT_ENTRY: [defaultproject=>modref01=>en=>jump]I18nLanguages.getOrCreateItem(=>jump)=Added the key to the default language',
    ]);
    expect(i18n.hasKey('', 'modref01', 'de', 'jump')).toBeFalsy();
    expect(i18n.hasKey('', 'modref01', 'en', 'jump')).toBeTruthy(); // autocreate
    expect(i18n.get('', 'modref01', 'en', 'jump')).toBe('jump');

    expect(lastSteps(0)).toHaveLength(23 + 2); // mod01 has 19+2 entries
    expect(i18n.get('', 'modref01', 'en_US', 'fall')).toBe('fall');
    expect(lastSteps(0)).toHaveLength(23 + 4); // mod01 has 19+4 entries
    expect(lastSteps(2)).toStrictEqual([
      'SET_ITEM: [defaultproject=>modref01=>en=>fall]I18nOneLanguage.setItem(=>fall)=Set item value for one key',
      'CREATE_DEFAULT_ENTRY: [defaultproject=>modref01=>en=>fall]I18nLanguages.getOrCreateItem(=>fall)=Added the key to the default language',
    ]);
    expect(i18n.hasKey('', 'modref01', 'en', 'fall')).toBeTruthy(); // autocreate
    expect(i18n.hasKey('', 'modref01', 'en_US', 'fall')).toBeFalsy();

    expect(lastSteps(0)).toHaveLength(27); // mod01 has 19+4 entries
    expect(i18n.get('', 'modref04', 'en', 'jump')).toBe('jump');
    expect(lastSteps(0)).toHaveLength(27 + 7); // mod01 has 19+4 entries
    // console.log(lastSteps(7));
    expect(lastSteps(7)).toStrictEqual([
      'CREATE_MODULE: [defaultproject=>modref04=>=>]I18nOneModule.createFromData(=>modref04)=Create one module',
      'ALL_LANGUAGES_CREATED: [defaultproject=>modref04=>=>]I18nLanguages.constructor(=>)=All Languages added to Module',
      'ADD_LANGUAGE: [defaultproject=>modref04=>=>]I18nLanguages.addLanguage(=>en)=Language added to Module',
      'MODULE_CREATED: [defaultproject=>modref04=>=>]I18nOneModule.constructor(=>modref04__V0.0.1__1)=Module created',
      'ADD_LANGUAGE: [defaultproject=>modref04=>=>]I18nLanguages.addLanguage(=>en)=Language added to Module',
      'SET_ITEM: [defaultproject=>modref04=>en=>jump]I18nOneLanguage.setItem(=>jump)=Set item value for one key',
      'CREATE_DEFAULT_ENTRY: [defaultproject=>modref04=>en=>jump]I18nLanguages.getOrCreateItem(=>jump)=Added the key to the default language',
    ]);
    expect(i18n.createFlag).toBeTruthy();
    var mod4 = i18n.getModule('', 'modref04');
    expect(mod4).toBeTruthy();
    expect(mod4.createFlag).toBeTruthy();
    // console.log(JSON.stringify(mod4.getModuleItem()));
    expect(i18n.hasKey('', 'modref04', 'en', 'jump')).toBeTruthy(); // autocreate
  });

  test('I18nCircleModel-Cache', () => {
    tmpActions = [];
    expect(lastSteps(0)).toHaveLength(0);
    var i18n: I18nCircleModel = new I18nCircleModel();
    var mod1 = i18n.addModule('', 'modref01', mod01);
    expect(lastSteps(0)).toHaveLength(15); // mod01 has 15 entries
    expect(mod1).toBeTruthy();
    expect(mod1.getModuleItem()).toStrictEqual(mod01);

    let cache_de = i18n.getLanguageCache('', 'modref01', 'de');
    expect(lastSteps(0)).toHaveLength(15); // mod01 has 15 entries
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
    expect(lastSteps(0)).toHaveLength(15 + 2); // mod01 has 15+2 entries
    // console.log(lastSteps(2));
    expect(lastSteps(2)).toStrictEqual([
      'SET_ITEM: [defaultproject=>modref01=>en=>new stuff]I18nOneLanguage.setItem(=>new stuff)=Set item value for one key',
      'CREATE_DEFAULT_ENTRY: [defaultproject=>modref01=>en=>new stuff]I18nLanguages.getOrCreateItem(=>new stuff)=Added the key to the default language',
    ]);
    cache_de?.set('new stuff', 'Neues Zeug');
    cache_de?.set('hello', 'hallo');
    expect(lastSteps(0)).toHaveLength(15 + 2 + 2); // mod01 has 15+2 entries
    // console.log("703",JSON.stringify(mod1.getModuleItem(),undefined,2))
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
          'new stuff': 'new stuff',
        },
        de: {
          logon: 'Anmelden',
          logout: 'Abmelden',
          signin: 'Registrieren',
          hello: 'hallo',
          'new stuff': 'Neues Zeug',
        },
        es: {
          hello: 'óla',
          goodbye: 'adiós',
        },
        defaultLanguage: 'en',
      },
    });
    expect(i18n.hasKey('', 'modref01', 'en', 'new stuff')).toBeTruthy();
  });
  test('I18nCircleModel-projects', () => {
    const i18n = new I18nCircleModel('test1');
    expect(i18n.getProjectList()).toStrictEqual(['test1']);
    expect(i18n.addProject('test2', {})).toBeTruthy();
    expect(i18n.getProjectList()).toStrictEqual(['test1', 'test2']);
  });
});
