
/**
 * @enum for the I18nTranslateAction.
 * 
 * NO_OP,NEW_KEY,DEL_KEY and UPDATE_VALUE are valid elements.
 */
 export enum I18nTranslateActionType {
    NO_OP,
    NEW_KEY,
    DEL_KEY,
    UPDATE_VALUE
}

/**
 * @class for one Translate action
 * @see I18nTranslateActions for interfacing functions.
 * @public
 */
export class I18nTranslateAction {
    private actionType : I18nTranslateActionType = I18nTranslateActionType.NO_OP;
    private key?:string;
    private value?:string;
    private constructor(actionType:I18nTranslateActionType) {
        this.actionType = actionType;
    }
    public static setupNewKey(key:string):I18nTranslateAction {
        var ta = new I18nTranslateAction(I18nTranslateActionType.NEW_KEY);
        ta.key = key;
        return ta;
    }
    public static setupDelKey(key:string):I18nTranslateAction {
        var ta = new I18nTranslateAction(I18nTranslateActionType.DEL_KEY);
        ta.key = key;
        return ta;
    }
    public static setupUpdateValue(key:string,val:string):I18nTranslateAction {
        var ta = new I18nTranslateAction(I18nTranslateActionType.UPDATE_VALUE);
        ta.key = key;
        ta.value = val;
        return ta;
    }
}

/**
 * @class for a list of Translate actions
 * @public
 */
export class I18nTranslateActions {
    private sourceMod?:string;
    private sourceLngKey?:string;
    private targetMod?:string;
    private targetLngKey?:string;
    private transactions : I18nTranslateAction[]=[];
    /**
     * @constructor for the actions in the target space
     * @param mod - module name
     * @param lng - language key
     */
    public constructor(sourceMod:string,sourceLngKey:string,targetMod:string,targetLngKey:string) {
        this.sourceMod = sourceMod;
        this.sourceLngKey = sourceLngKey;
        this.targetMod = targetMod;
        this.targetLngKey = targetLngKey;
    }
    /**
     * Sets a NEW_KEY action => new key in the target space.
     *
     * @param key - the key (text in default language)
     */
    public setupNewKey(key:string) {
        var ta = I18nTranslateAction.setupNewKey(key);
        this.transactions.push(ta);
    }
    /**
     * Sets a DEL_KEY action in the target space
     *
     * @param key - the key (text in default language)
     */
    public setupDelKey(key:string) {
        var ta = I18nTranslateAction.setupDelKey(key);
        this.transactions.push(ta);
    }
    /**
     * Sets a key/value pair for the target space
     *
     * @param key - the key (text in default language)
     * @param value - The text in the target space language.
     */
    public setupUpdateValue(key:string,val:string) {
        var ta = I18nTranslateAction.setupUpdateValue(key,val);
        this.transactions.push(ta);
    }
    public getActions() : I18nTranslateAction[] {
        return this.transactions; // TODO copy? Object.assign(obj1, obj2);
    }
}


/**
 * @class 
 * Represents data and functions dedicated for all key/value pairs of a language
 * @public
 */
export class I18nOneLanguage {
    private onelng :any = {};
    private history:string[]=[];
    
    /**
     * Sets a key/value pair, if not existent and tracks a history of keys.
     *
     * @param key - the key (text in default language)
     * @param value - The text in the current language.
     */
    public setItem(key:string,value:string) {
        if (this.onelng.hasOwnProperty(key) && this.onelng[key]==value) {
            return; // no change ==> no history!!
        }
        this.onelng[key] = value;
        this.history.push(key);
    }
    /**
     * Gets the value of a key/value pair, if existent or key targetwise.
     *
     * @param key - the language key (text in default language)
     * @returns The text in the current language or the key if not available
     */
    public getItem(key:string) : string {
        if (this.onelng.hasOwnProperty(key)) {
            return this.onelng[key];
        }
        return key;
    }
    /**
     * Check existence of a key
     *
     * @param key - the key (text in default language)
     * @returns true if exists, false if not.
     */
    public hasKey(key:string) {
        return this.onelng.hasOwnProperty(key)
    }
    /**
     * Deletes a key/value pair
     *
     * @param key - the key (text in default language)
     */
    public deleteItem(key:string) {
        delete this.onelng[key];
    }
    /**
     * reset to an empty data set
     */
    public emptyItems() {
        this.onelng = {};
        this.history = [];
    }
    /**
     * set all items with an javascript oject e.g. from a file
     * 
     * @param one - the javascript object to read.
     */
    public setItems(one:any) {
        if (typeof one === 'object' && one !== null) {
            for (let key in one) {
               if (one.hasOwnProperty(key)) {
                  this.onelng[key] = one[key];
               }
            }
        }
    }
    /**
     * merge all items with a second javascript object
     * 
     * @remarks
     * Keys in the parameter two will overwrite existing key/value pairs in the existing one.
     * 
     * @param two - the javascript object to merge.
     */
    public mergeItems(two:any) {
        this.onelng = {...this.onelng,...two.onelng};
        // Object.assign(obj1, obj2);
    }
    /**
     * get all items from this language
     * 
     * @returns the javascript object
     */
    public getItems() : any {
        return this.onelng;
    }
    public getKeys() : string[] {
        return Object.keys(this.onelng);
    }
    /**
     * returns the change history, if any
     * 
     * @param flush - if true the history is reset to an empty list.
     * 
     * @returns a string list of keys
     */
    public getHistory(flush:boolean) : string[] {
        const his = this.history;
        if (flush) {
            this.history = [];
        }
        return his;
    }
    /**
     * compare this OneLanguage Object(master) with antarget one and creates actions to update the target object (target space)
     * 
     * @param srcmod - the module we are operating in.
     * @param srclng - the language key, wa are operating in
     * @param target - the slave object to compare
     * @param targetmod - the module we are operating in.
     * @param targetlng - the language key, wa are operating in
     * @param valueFlag - if true, also the values are compared if true only keys are compared
     * @return an Object of I18nTranslateActions
     */
    public comparePairs(srcmod:string,srclng:string,target:I18nOneLanguage,targetmod:string,targetlng:string,valueFlag:boolean=false) : I18nTranslateActions {
        var tal = new I18nTranslateActions(srcmod,srclng,targetmod,targetlng);
        for (var key in this.onelng) {
            if (this.hasKey(key) && !target.hasKey(key)) {
                tal.setupNewKey(key);
            } else if (valueFlag && this.hasKey(key) && this.onelng[key] != target.getItem(key)) {
                tal.setupUpdateValue(key,target.getItem(key));
            }
        }
        var tarr = target.getKeys()
        for (var ix = 0;ix<tarr.length;ix++) {
            var rkey = tarr[ix];
            if (target.hasKey(rkey) && !this.hasKey(rkey)) {
                tal.setupDelKey(rkey);
            }
        }
        return tal;
    }
    /**
     * @constructor
     * 
     * @param one - javascirpt object toinitialize via setItems
     */
    constructor(one:any) {
        this.setItems(one);
    }
}

/**
 * @class for a collection of Languages
 * @public
 */
export class I18nLanguages {
    private lngs : any = {};
    private defaultLng:string = 'en';
    /**
     * sets or merge a language collection of key/value-pairs
     * 
     * @param lngkey - the language key e.g. 'en'
     * @param lngmap - the javascript object to initialize.
     */
    public addLanguage(lngkey:string,lngmap:any) {
        if (this.lngs.hasOwnProperty(lngkey)) {
            this.lngs[lngkey].mergeItems(lngmap);
        } else {
            this.lngs[lngkey] = new I18nOneLanguage(lngmap);
        }
    }
    /**
     * @constructor 
     * @param defaultLanguage - sets the defaultlanguage
     */
    constructor(allLanguages:any) {
        if (typeof allLanguages === 'object' && allLanguages !== null) {
            if (allLanguages.hasOwnProperty('defaultLanguage')) {
                this.defaultLng = allLanguages["defaultLanguage"];
            }
            if (allLanguages.hasOwnProperty(this.defaultLng)) {
                this.addLanguage(this.defaultLng,allLanguages[this.defaultLng]);
            } else {
                return; // Error: default language missing.
            }
            for (var lkey in allLanguages) {
                if (allLanguages.hasOwnProperty(lkey)
                  && lkey != 'defaultLanguage'
                  && lkey != this.defaultLng) {
                    this.addLanguage(lkey,allLanguages[lkey]);
                }
            }
        }
    }
    /**
     * get one item via lngkey and key
     * @param lngkey - the lngkey e.g 'en','de'
     * @param key - the key text in the default language
     * 
     * @returns the found value or the key if not existent.
     */
    public getItem(lngkey:string,key:string) : string {
        if (this.lngs.hasOwnProperty(lngkey)) {
            return this.lngs[lngkey].getItem(key);
        } else {
            return key;
        }
    }
    /**
     * get one item via lngkey and key.
     * If key is not found, it tries to create an entry in the default language (including history)
     * 
     * @param lngkey - the lngkey e.g 'en','de'
     * @param key - the key text in the default language
     * 
     * @returns the found value or the key if not existent.
     */
    public getOrCreateItem(lngkey:string,key:string) : string {
        if (this.lngs.hasOwnProperty(lngkey)) {
            return this.lngs[lngkey].getItem(key);
        } else {
            this.lngs[this.defaultLng].setItem(key,key);
            return key;
        }
    }
    /**
     * Sets a key/value pair, if not existent and tracks a history of keys.
     *
     * @param lngkey - the language key to set (e.g 'en','de')
     * @param key - the key (text in default language)
     * @param value - The text in the current language.
     */
    public setItem(lngkey:string,key:string,value:string) {
        if (!this.lngs.hasOwnProperty(lngkey)) {
            this.lngs[lngkey] = new I18nOneLanguage({});
        }
        this.lngs[lngkey].setItem(key,value);
    }
    /**
     * get all items for one language key
     * 
     * @param lngkey - the language key e.g. 'en','de'
     * @returns the javascript object representing the languange key/value pairs.
     */
    public getItems(lngkey:string): any {
        if (this.lngs.hasOwnProperty(lngkey)) {
            return this.lngs[lngkey].getItems();
        } else {
            return {};
        }
    }
    /**
     * get all items for all language keys
     * 
     * @returns the javascript object representing all lanugages
     */
    public getAllItems(): any {
        var all :any = {};
        for( let lngkey in this.lngs) {
            if (this.lngs.hasOwnProperty(lngkey)) {
                all[lngkey] = this.lngs[lngkey].getItems();
            }
        }
        all['defaultLanguage'] = this.defaultLng;
        return all;
    }
    /**
     * returns the change history for one language key, if any
     * 
     * @param lngkey - the language key for interes.
     * @param flush - if true the history is reset to an empty list.
     * 
     * @returns a string list of keys
     */
    public getHistory(lngkey:string,flush:boolean): string[] {
        if (this.lngs.hasOwnProperty(lngkey)) {
            return this.lngs[lngkey].getHistory(flush);
        } else {
            return [];
        }
    }
}

/**
 * @class one language module
 * @public
 */
export class I18nOneModule {
    private modname:string='';
    private filepath:string='';
    private createFlag:boolean= true;
    private languages:I18nLanguages|null = null;
    
    /**
     * @constructor
     * create the module with all initializers
     * 
     * @param modname - name of the module
     * @param filepath - filepath, wehre the module parameters were loaded from.
     * @param createFlag - if true getOrCreateItem creates missing keys, if false not.
     * @param lng - javascript object to initialize an I18nLanguages object.
     */
    constructor(modname:string,filepath:string,createFlag:boolean,lng:any) {
        this.modname = modname;
        this.filepath = filepath;
        this.createFlag = createFlag;
        if (typeof lng === 'object' && lng !== null) {
            this.languages = new I18nLanguages(lng);
        } else {
            this.languages = null;
        }
    }
    
    /**
     * gets the module with all languages as javascript object
     * @returns a javascript object
     */
    public getModule() : any {
        return {
            modname: this.modname,
            filepath: this.filepath,
            createFlag: this.createFlag,
            languages: (this.languages==null) ? {} : this.languages.getAllItems()
        };
    }
    
    /**
     * get one item via lngkey and key.
     * If key is not found, it tries to create an entry in the default language (including history)
     * only if the creatFlag in this module is set.
     * 
     * @param lngkey - the lngkey e.g 'en','de'
     * @param key - the key text in the default language
     * 
     * @returns the found value or the key if not existent.
     */
    public getOrCreateItem(lngkey:string,key:string) : string {
        if (this.languages != null) {
            if (this.createFlag) {
                return this.languages.getOrCreateItem(lngkey,key);
            } else {
                return this.languages.getItem(lngkey,key);
            }
        }
        return key;
    }
}