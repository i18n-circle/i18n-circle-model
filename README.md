# i18n-circle-model
Data model for the i18n circle in typescript as package for node.js and angular. 

Please note, prior to V1.1.0 it is not considered as stable, it is used for other packages in preparation.

## Installation

```bash
npm i @i18n-circle/i18n-circle-model
```

## Usage Example

### nodejs(File index.js)
```js
const I18nCircleModel =  require('@i18n-circle/i18n-circle-model').I18nCircleModel;

const mod_data = { // some test data
    internalName: 'default__V0.0.1__1',
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
      de: {
        logon: 'Anmelden',
        logout: 'Abmelden',
        signin: 'Registrieren',
        hello: 'Hallo',
      },
      defaultLanguage: 'en',
    },
  };

// ====================================================
// root node
const i18n = new I18nCircleModel(); 

// language module for initializing and changing values.
const mod = i18n.addModule("default",mod_data); 

// retreive one existing german value
console.log("hello=",i18n.get("default","de","hello")); // => Hallo

// the following value is not existing in german
// so it the key will be created in the defaultlanguage 'en'
console.log("cancel=", i18n.get("default","de","cancel")); // => cancel

// verify, if a key is existent:
console.log("exists(cancel)? ",
    i18n.hasKey("default","en","cancel"),
    i18n.hasKey("default","de","cancel")
);


// ====================================================
// cache for one module and language
const lngCache = i18n.getLanguageCache("default","de",i18n); 

// retrieve one value from cache:
console.log("logoff=",lngCache.get('logon')); // => Anmelden

// the following value is not existing in german
// so it the key will be created in the defaultlanguage 'en'
console.log("save=", lngCache.get("save")); // => save

// verify, if a key is existent:
console.log("exists(save)? ",
    i18n.hasKey("default","en","save"),// => true
    i18n.hasKey("default","de","save"),// => falsae
    lngCache.hasKey('save')//=false
);

// show and verify current snapshot:
console.log("i18n.default(Module)=",JSON.stringify(mod.getModule(),undefined,2));
```

```bash
node index.js
```
## Features

## Contributing to i18n-circle

