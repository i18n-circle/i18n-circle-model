import { Subject } from "rxjs";


export enum I18nOperationMode {
    NO_OP,
    DEFAULT_LNG,
    NEW_KEYS_FROM_DEFAULT,
    UPDATE_VALUES_IN_ONE_LNG
}

/**
 * @enum for the I18nTranslateAction.
 * 
 * NO_OP,NEW_KEY,DEL_KEY and UPDATE_VALUE are valid elements.
 */
 export enum I18nTranslateActionType {
    NO_OP,
    NEW_KEY,
    DEL_KEY,
    UPDATE_VALUE,
    NEW_LANGUAGE,
    DEL_LANGUAGE,
    MISMATCH_DEFAULT_LNG
}

/**
 * @class for one Translate action
 * @see I18nTranslateActions for interfacing functions.
 * @public
 */
export class I18nTranslateAction {
    public getKey():string|undefined {
        return this.key;
    }
    public getValue():string|undefined {
        return this.value;
    }
    private actionType : I18nTranslateActionType = I18nTranslateActionType.NO_OP;
    private sourceMod?:string;
    private sourceLngKey?:string;
    private targetMod?:string;
    private targetLngKey?:string;
    private key?:string;
    private value?:string;
    private constructor(actionType:I18nTranslateActionType) {
        this.actionType = actionType;
    }
    public queryActionType() : I18nTranslateActionType {
        return this.actionType
    }
    /**
     * sets the source and target form this action.
     * 
     * @param sourceMod     - modulename of the source module
     * @param sourceLngKey  - languagekey of current source langauge
     * @param targetMod     - modulname of the target module
     * @param targetLngKey  - languagekey of the current target language
     */
    public setSourceAndTarget(sourceMod:string,sourceLngKey:string,targetMod:string,targetLngKey:string) {
        this.sourceMod=sourceMod;
        this.sourceLngKey = sourceLngKey;
        this.targetMod = targetMod;
        this.targetLngKey = targetLngKey;
    }
    /**
     * Converts this action to string
     * 
     * @returns a short string representaion of current action.
     */
    public toString() :string{
        var txt : string ='';
        txt += "["+this.sourceMod+'.'+this.sourceLngKey+"=>"
            + this.targetMod+'.'+this.targetLngKey+"]: ";
        switch (this.actionType) {
            default:
            case I18nTranslateActionType.NO_OP:
                txt += "NO_OP"; 
                break;
            case I18nTranslateActionType.NEW_KEY:
                txt += "NEW_KEY"; 
                txt +='('+this.key+','+this.value+')';
                break;
            case I18nTranslateActionType.DEL_KEY:
                txt += "DEL_KEY"; 
                txt +='('+this.key+')';
                break;
            case I18nTranslateActionType.UPDATE_VALUE:
                txt += "UPDATE_VALUE"; 
                txt +='('+this.key+','+this.value+')';
                break;
            case I18nTranslateActionType.NEW_LANGUAGE:
                txt += "NEW_LANGUAGE"; break;
            case I18nTranslateActionType.DEL_LANGUAGE:
                txt += "DEL_LANGUAGE"; break;
            case I18nTranslateActionType.MISMATCH_DEFAULT_LNG:
                txt += "MISMATCH_DEFAULT_LNG"; break;
        }
        return txt;
    }
    /**
     * 
     * @param key the key to add
     * @param val the value to update
     * @returns the NewKey-action
     */
    public static setupNewKey(key:string,val:string):I18nTranslateAction {
        var ta = new I18nTranslateAction(I18nTranslateActionType.NEW_KEY);
        ta.key = key;
        ta.value = val;
        return ta;
    }
    /**
     * 
     * @param key the key to delete
     * @returns the DelKey Action
     */
    public static setupDelKey(key:string):I18nTranslateAction {
        var ta = new I18nTranslateAction(I18nTranslateActionType.DEL_KEY);
        ta.key = key;
        return ta;
    }
    /**
     * 
     * @param key the key to find
     * @param val the value to update
     * @returns the UpdateValue Action
     */
    public static setupUpdateValue(key:string,val:string):I18nTranslateAction {
        var ta = new I18nTranslateAction(I18nTranslateActionType.UPDATE_VALUE);
        ta.key = key;
        ta.value = val;
        return ta;
    }
    /**
     * 
     * @param type a type without additional data to report
     * @returns the action according to the type
     */
    public static setupWithoutKeyOrValue(type:I18nTranslateActionType):I18nTranslateAction {
        var ta = new I18nTranslateAction(type);
        return ta;
    }
}

/**
 * @class for a list of Translate actions
 * @public
 */
export class I18nTranslateActions {
    static deleteKeys() {
        this.tmpDelKeys = {};
    }
    private sourceMod:string;
    private sourceLngKey:string;
    private targetMod:string;
    private targetLngKey:string;
    private transactions : I18nTranslateAction[]=[];
    private static tmpDelKeys:any={};
    private static tmpAddKeys:any={};
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
    public setupNewKey(key:string,value:string,opMode:I18nOperationMode) : void {
        var ta = I18nTranslateAction.setupNewKey(key,value);
        ta.setSourceAndTarget(this.sourceMod,this.sourceLngKey,this.targetMod,this.targetLngKey);
        switch (opMode) {
            case I18nOperationMode.DEFAULT_LNG:
                I18nTranslateActions.tmpAddKeys[key]=true;
                break;
            case I18nOperationMode.NEW_KEYS_FROM_DEFAULT:
            case I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG:
                // console.log("NewKey",ta,I18nTranslateActions.tmpDelKeys);
                if (I18nTranslateActions.tmpDelKeys.hasOwnProperty(key)) {
                    return;
                }
                break;
        }
        this.transactions.push(ta);
    }
    /**
     * Sets a DEL_KEY action in the target space
     *
     * @param key - the key (text in default language)
     */
    public setupDelKey(key:string,opMode:I18nOperationMode) : void {
        var ta = I18nTranslateAction.setupDelKey(key);
        ta.setSourceAndTarget(this.sourceMod,this.sourceLngKey,this.targetMod,this.targetLngKey);
        switch (opMode) {
            case I18nOperationMode.DEFAULT_LNG:
                I18nTranslateActions.tmpDelKeys[key]=true;
                // console.log("delKey-default",ta,I18nTranslateActions.tmpDelKeys);
                break; 
            case I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG:
            case I18nOperationMode.NEW_KEYS_FROM_DEFAULT:
                if (I18nTranslateActions.tmpAddKeys.hasOwnProperty(key)) {
                    return;
                }
                break;
        }
        this.transactions.push(ta);
    }
    /**
     * Sets a key/value pair for the target space
     *
     * @param key - the key (text in default language)
     * @param value - The text in the target space language.
     */
    public setupUpdateValue(key:string,val:string,opMode:I18nOperationMode) :void {
        var ta = I18nTranslateAction.setupUpdateValue(key,val);
        ta.setSourceAndTarget(this.sourceMod,this.sourceLngKey,this.targetMod,this.targetLngKey);
        switch (opMode) {
            case I18nOperationMode.DEFAULT_LNG:
                break;; 
            case I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG:
                break;
            case I18nOperationMode.NEW_KEYS_FROM_DEFAULT:
                return;
        }
        this.transactions.push(ta);
    }
    /**
     * Adds the mismatch as action to the actionlist
     */
    public setupMismatchDefaultLanguage():void {
        var ta = I18nTranslateAction.setupWithoutKeyOrValue(
            I18nTranslateActionType.MISMATCH_DEFAULT_LNG);
        ta.setSourceAndTarget(this.sourceMod,this.sourceLngKey,this.targetMod,this.targetLngKey);
        this.transactions.push(ta);
    }
    /**
     * adds the new language indicator to the actionlist
     */
     public setupNewLanguage() : void {
        var ta = I18nTranslateAction.setupWithoutKeyOrValue(
            I18nTranslateActionType.NEW_LANGUAGE);
        ta.setSourceAndTarget(this.sourceMod,this.sourceLngKey,this.targetMod,this.targetLngKey);
        this.transactions.push(ta);
    }
    /**
     * adds the delete language indicator to the actionlist
     */
     public setupDelLanguage() :void {
        var ta = I18nTranslateAction.setupWithoutKeyOrValue(
            I18nTranslateActionType.DEL_LANGUAGE);
        ta.setSourceAndTarget(this.sourceMod,this.sourceLngKey,this.targetMod,this.targetLngKey);
        this.transactions.push(ta);
    }
    /**
     * 
     * @returns a string list representation of the action list.
     */
    public getTransScript():string[] {
        var result : string[] = [];
        this.transactions.forEach(act => {
            result.push(act.toString());
        });
        return result;
    }
    /**
     * 
     * @returns the list of transactions
     */
    public getActions() : I18nTranslateAction[] {
        return this.transactions;
    }
    /**
     * 
     * @returns the size of the internal action list
     */
    public getActionSize() : number {
        return this.transactions.length;
    }
    /**
     * 
     * @param other the other action list to be appended to this one
     */
    public appendOther(other:I18nTranslateActions) {
        if (other.getActionSize()>0) {
            this.transactions = this.transactions.concat(other.transactions);
        }
    }
}

/**
 * this class contains all key and values for one specifc module in a specifc language.
 * This cache provides a program module a direct access to the values without
 * the nested calls from the other objects.
 */
export class I18nCache {
    private i18n : I18nCircleModel|null = null; // is null when no createflag
    private modref: string='';
    private lngkey: string= '';
    private lngmap:any={};

    /**
     * 
     * @param modref the module reference
     * @param lngkey the language key
     * @param onelng the key value javascript object
     * @param i18nCircle if not null, it's an active createflag
     */
    constructor(modref:string,lngkey:string,onelng:any,
            i18nCircle:I18nCircleModel|null,subject:Subject<I18nTranslateAction>) {
        this.modref = modref;
        this.lngkey = lngkey;
        this.lngmap = onelng;
        this.i18n = i18nCircle;
        subject.subscribe((action:I18nTranslateAction)=>{
            var key = action.getKey();
            var value = action.getValue();
            switch(action.queryActionType()) {
                case I18nTranslateActionType.UPDATE_VALUE:
                case I18nTranslateActionType.NEW_KEY:
                    if (typeof key === 'string' && typeof value === 'string') {
                        this.lngmap[key] = value;
                    }
                    return;
                case I18nTranslateActionType.DEL_KEY:
                    if (typeof key === 'string') {
                        delete this.lngmap[key];
                    }
                    return;
            }
        })
    }
    /**
     * 
     * @param key the key in the key/value map.
     * @returns the value if found or the key if not
     */
    public get(key:string) : string {
        if (this.lngmap.hasOwnProperty(key)) {
            return this.lngmap[key];
        }
        if (this.i18n != null) {
            return this.i18n.get(this.modref,this.lngkey,key);
        }
        return key;
    }
    public hasKey(key:string) : boolean {
        return this.lngmap.hasOwnProperty(key);
    }
    public getSize() : number {
        return Object.keys(this.lngmap).length;
    }
}

/**
 * @class 
 * Represents data and functions dedicated for all key/value pairs of a language
 * @public
 */
export class I18nOneLanguage {
    private onelng :any = {};
    private subject:Subject<I18nTranslateAction>;

    /**
     * 
     * @param modref the module reference
     * @param lngkey the language key
     * @param i18n i not null, then new key will be created in the default language
     * @returns A new I18nCache 
     */
    public getLanguageCache(modref:string,lngkey:string,i18n:I18nCircleModel|null):I18nCache {
        return new I18nCache(modref,lngkey,this.onelng,i18n,this.subject);
    }
    
    /**
     * Sets a key/value pair, if not existent and tracks a history of keys.
     *
     * @param key - the key (text in default language)
     * @param value - The text in the current language.
     */
    public setItem(key:string,value:string) {
        var existFlag:boolean = this.onelng.hasOwnProperty(key);
        var action:I18nTranslateAction;
        if (existFlag && this.onelng[key]==value) {
            return; // no change ==> no history!!
        }
        this.onelng[key] = value;
        action = existFlag 
               ? I18nTranslateAction.setupUpdateValue(key,value)
               : I18nTranslateAction.setupNewKey(key,value);
        this.subject.next(action);
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
        var action : I18nTranslateAction = 
            I18nTranslateAction.setupDelKey(key);
        this.subject.next(action);
    }
    /**
     * reset to an empty data set
     */
    public emptyItems() {
        this.onelng = {};
    }
    /**
     * set all items with an javascript object e.g. from a file
     * 
     * @param one - the javascript object to read.
     */
    public setItems(one:any) {
        if (typeof one === 'object' && one !== null) {
            for (let key in one) {
               if (one.hasOwnProperty(key)) {
                  this.setItem(key,one[key]);
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
     * @alpha (data type checks?)
     */
    public mergeItems(two:any) :void {
        // console.log("merge.1",this,two);
        if (two.hasOwnProperty('onelng')) {
            this.onelng = {...this.onelng,...two.onelng};
        } else {
            this.onelng = {...this.onelng,...two};
        }
        // console.log("merge-2",this);
        // this.onelng = Object.assign(this.onelng,two.onelng);
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
    /**
     * 
     * @returns a string list of all keys within this key/value pairs object
     */
    public getKeys() : string[] {
        return Object.keys(this.onelng);
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
     * @returns an Object of I18nTranslateActions
     */
    public comparePairs(srcmod:string,srclng:string,target:I18nOneLanguage,targetmod:string,targetlng:string,opMode:number) : I18nTranslateActions {
        var tal = new I18nTranslateActions(srcmod,srclng,targetmod,targetlng);
        var valueFlag = false;
        var keyforwarding = false;
        var keyBackwarding = false;
        for (var key in this.onelng) {
            if (this.hasKey(key) && !target.hasKey(key)) {
                tal.setupNewKey(key,target.getItem(key),opMode);
            } else if (this.hasKey(key) && this.onelng[key] != target.getItem(key)) {
                tal.setupUpdateValue(key,this.getItem(key),opMode);
            }
        }
        var tarr = target.getKeys()
        for (var ix = 0;ix<tarr.length;ix++) {
            var rkey = tarr[ix];
            if (target.hasKey(rkey) && !this.hasKey(rkey)) {
                tal.setupDelKey(rkey,opMode);
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
        this.subject=new Subject<I18nTranslateAction>();
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
     * 
     * @param modref the module reference
     * @param lngkey the language key
     * @param i18n i not null, then new key will be created in the default language
     * @returns A new I18nCache 
     */
    public getLanguageCache(modref:string,lngkey:string,i18n:I18nCircleModel|null):I18nCache|null {
        if (this.lngs.hasOwnProperty(lngkey)) {
            return this.lngs[lngkey].getLanguageCache(modref,lngkey,i18n);
        } else {
            return null;
        }
    }
    
    /**
     * sets or merge a language collection of key/value-pairs
     * 
     * @param lngkey - the language key e.g. 'en'
     * @param lngmap - the javascript object to initialize.
     */
    public addLanguage(lngkey:string,lngmap:any) {
        // console.log("add_language-1",lngkey,lngmap,this.lngs);
        if (this.lngs.hasOwnProperty(lngkey)) {
            this.lngs[lngkey].mergeItems(lngmap);
            // console.log("add_language-2",this.lngs);
        } else {
            this.lngs[lngkey] = new I18nOneLanguage(lngmap);
        }
    }
    /**
     * @constructor 
     * @param allLanguages - sets the all data within
     */
    constructor(allLanguages:any) {
        if (typeof allLanguages === 'object' && allLanguages !== null) {
            if (allLanguages.hasOwnProperty('defaultLanguage')) {
                this.defaultLng = allLanguages["defaultLanguage"];
            }
            if (allLanguages.hasOwnProperty(this.defaultLng)) {
                this.addLanguage(this.defaultLng,allLanguages[this.defaultLng]);
            } else {
                this.addLanguage(this.defaultLng,{});
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
     * hasLanguage checks if a language key is existent
     */
    public hasLanguage(lngkey:string): boolean {
        return this.lngs.hasOwnProperty(lngkey);
    }
    /**
     * hasKey checks if the language and the key is existent in that language.
     * 
     * @param lngkey - The language key to search for
     * @param key - The key in that language.
     */
    public hasKey(lngkey:string,key:string) : boolean {
        return this.lngs.hasOwnProperty(lngkey) 
            && this.lngs[lngkey].hasKey(key);
    }
    /**
     * get one item via lngkey and key
     * @param lngkey - the lngkey e.g 'en','de'
     * @param key - the key text in the default language
     * 
     * @returns the found value or the key if not existent.
     */
    public getItem(lngkey:string,key:string) : string {
        if (this.hasKey(lngkey,key)) {
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
        if (this.hasKey(lngkey,key)) {
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
    public setItem(lngkey:string,key:string,value:string): void {
        if (!this.lngs.hasOwnProperty(lngkey)) {
            this.lngs[lngkey] = new I18nOneLanguage({});
        }
        this.lngs[lngkey].setItem(key,value);
    }
    /**
     * 
     * @param lngkey - current language to delete in
     * @param key - key to delete
     * 
     */
    public deleteItem(lngkey:string,key:string): void {
        if (!this.lngs.hasOwnProperty(lngkey)) {
            return; // no action
        }
        this.lngs[lngkey].deleteItem(key);
    }
    /**
     * 
     * @param lngkey language to empty.
     */
    public emptyItems(lngkey:string): void {
        if (this.lngs.hasOwnProperty(lngkey)) {
            this.lngs[lngkey].emptyItems();
        }
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
     * merge all items with a second javascript object
     * 
     * @remarks
     * Keys in the parameter two will overwrite existing key/value pairs in the existing one.
     * 
     * @param lngkey - which language to merge in.
     * @param other - the OneLanugage or key/value pairs object to merge.
     * @alpha (data type checks?)
     */
    public mergeItems(lngkey:string,other:any) :void {
        if (this.lngs.hasOwnProperty(lngkey)) {
            this.lngs[lngkey].mergeItems(other);
        }
    }
    /**
     * 
     * @param lngkey the language to get the keys from
     * @returns a string list of keys.
     */
    public getLanguageKeys(lngkey:string) : string[] {
        if (this.lngs.hasOwnProperty(lngkey)) {
            return this.lngs[lngkey].getKeys();
        }
        return [];
    }

    /**
     * compares two collections of I18nLanguages and produces an action list
     * @param srcmod module name of this source
     * @param target target langauges to compare with
     * @param targetmod module name of that target
     * @returns list of Transactions
     */
    public compareLanguages(srcmod:string,target:I18nLanguages,targetmod:string) : I18nTranslateActions {
        I18nTranslateActions.deleteKeys();
        var result :I18nTranslateActions = new I18nTranslateActions(
            srcmod,this.defaultLng,targetmod,target.defaultLng);
        var tal : I18nTranslateActions;
        if (this.defaultLng != target.defaultLng) {
            result.setupMismatchDefaultLanguage();
            return result;
        }
        // 1) compare default langages with values.
        var l1 : I18nOneLanguage = this.lngs[this.defaultLng];
        var l2 : I18nOneLanguage = target.lngs[this.defaultLng];
        tal = l2.comparePairs(srcmod,this.defaultLng,l1,targetmod,this.defaultLng,
            I18nOperationMode.DEFAULT_LNG);
        result.appendOther(tal);
        // 2) compare keys for all target languages:
        for (var lngkey in target.lngs) {
            if (target.hasLanguage(lngkey) && lngkey != this.defaultLng) {
                if (!this.hasLanguage(lngkey)) { // 2a: new languages
                    tal = new I18nTranslateActions(srcmod,this.defaultLng,targetmod,lngkey);
                    tal.setupNewLanguage();
                    result.appendOther(tal);
                    l1 = this.lngs[this.defaultLng];
                    l2 = target.lngs[lngkey]; // 2b: new keys from defaultlng
                    tal = l1.comparePairs(srcmod,this.defaultLng,l2,targetmod,lngkey,
                        I18nOperationMode.NEW_KEYS_FROM_DEFAULT);
                    result.appendOther(tal);
                } else {
                    l1 = this.lngs[this.defaultLng];
                    l2 = target.lngs[lngkey]; // 2b: new keys from defaultlng
                    tal = l1.comparePairs(srcmod,this.defaultLng,l2,targetmod,lngkey,
                        I18nOperationMode.NEW_KEYS_FROM_DEFAULT);
                    result.appendOther(tal);
                }
                if (this.hasLanguage(lngkey)) {
                    l1 = this.lngs[lngkey]; // 2c update keys and values same lngkey
                    l2 = target.lngs[lngkey];
                    tal = l1.comparePairs(srcmod,lngkey,l2,targetmod,lngkey,    
                        I18nOperationMode.UPDATE_VALUES_IN_ONE_LNG);
                    result.appendOther(tal);
                }
            }
        }
        // 3) delete no longer existing languages:
        for (var lngkey in this.lngs) {
            if (this.hasLanguage(lngkey) && !target.hasLanguage(lngkey)) {
                tal = new I18nTranslateActions(srcmod,this.defaultLng,targetmod,lngkey);
                tal.setupDelLanguage();
                result.appendOther(tal);
            }
        }
        return result;
    }
    /**
     * 
     * @param modref the external model reference to use
     * @returns a list of actions to achieve consistency.
     */
    public checkConsistency(modref:string): I18nTranslateActions {
        return this.compareLanguages(modref,this,modref);
    }

    

}

/**
 * @class one language module
 * @public
 */
export class I18nOneModule {
    private externalName:string='';
    private semanticVersion:string='';
    private internalVersion:number = 0;
    private internalName:string='';
    private filepath:string='';
    private createFlag:boolean= true;
    private languages:I18nLanguages;

    /**
     * 
     * @param modref the module reference
     * @param lngkey the language key
     * @param i18n i not null, then new key will be created in the default language
     * @returns A new I18nCache 
     */
    public getLanguageCache(modref:string,lngkey:string,i18n:I18nCircleModel|null):I18nCache|null {
        return this.languages.getLanguageCache(modref,lngkey,i18n);
    }
    

    /**
     * 
     * @returns the internal name fields separated by '__'
     */
    public getInternalName():string{
        return this.externalName+"__"
              +this.semanticVersion+"__"
              +this.internalVersion;
    }
    /**
     * @constructor
     * create the module with all initializers
     * 
     * @param modname - name of the module
     * @param filepath - filepath, wehre the module parameters were loaded from.
     * @param createFlag - if true getOrCreateItem creates missing keys, if false not.
     * @param lng - javascript object to initialize an I18nLanguages object.
     * @private
     */
    private constructor(intName:string,filepath:string,createFlag:boolean,lng:any) {
        var spl = intName.split("__");
        if (spl.length > 0) {
            this.externalName = spl[0];
        } else {
            this.externalName = intName;
            this.semanticVersion = 'V0.0.1';
            this.internalVersion = 1;
        }
        if (spl.length > 1 && spl[1].match(/^V[0-9]+\.[0-9]+\.+[0-9]/)) {
            this.semanticVersion = spl[1];
            if (spl.length > 2 && spl[2].match(/^[0-9]+$/)) {
                this.internalVersion = Number.parseInt(spl[2]);
            } else {
                this.internalVersion = 1;
            }
        } else if (spl.length > 1 && spl[1].match(/^[0-9]+$/)) {
            this.semanticVersion = 'V0.0.1';
            this.internalVersion = Number.parseInt(spl[1]);
        } else {
            this.semanticVersion = 'V0.0.1';
            this.internalVersion = 1;
        }
        this.internalName = this.getInternalName();
        this.filepath = filepath;
        this.createFlag = createFlag;
        if (typeof lng === 'object' && lng !== null) {
            this.languages = new I18nLanguages(lng);
        } else {
            this.languages = new I18nLanguages({});
        }
    }
    /**
     * 
     * @param data a saved javascript object to initialize the module.
     * @returns the module on success or an error message on failure.
     */
    public static createFromData(modref:string,data:any) : I18nOneModule {
        var mod : I18nOneModule;
        if (data.hasOwnProperty("internalName")) {
            mod = new I18nOneModule(
                data['internalName'],
                data['filePath']||'',
                data['createFlag']||true,
                data['languages']||null);
        } else if (data.hasOwnProperty("externalName")) {
            mod = new I18nOneModule(
                data['externalName'],
                data['filePath']||'',
                data['createFlag']||true,
                data['languages']||null);
        } else {
            mod = new I18nOneModule(
                modref,
                data['filePath']||'',
                data['createFlag']||true,
                data['languages']||null);
        }
        return mod;
    }
    
    /**
     * gets the module with all languages as javascript object
     * @returns a javascript object
     */
    public getModule() : any {
        return {
            internalName: this.internalName,
            semanticVersion: this.semanticVersion,
            internalVersion: this.internalVersion,
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
    public getOrCreateItem(lngkey:string,key:string,forceCreate:boolean=false) : string {
        if (this.languages != null) {
            if (forceCreate || this.createFlag) {
                return this.languages.getOrCreateItem(lngkey,key);
            } else {
                return this.languages.getItem(lngkey,key);
            }
        }
        return key;
    }
    /**
     * sets or merge a language collection of key/value-pairs
     * 
     * @param lngkey - the language key e.g. 'en'
     * @param lngmap - the javascript object to initialize.
     */
     public addLanguage(lngkey:string,lngmap:any,forceCreate:boolean=false) {
        if (this.languages == null) {
            if (this.createFlag || forceCreate) {
                this.languages = new I18nLanguages({});
            } else {
                return;
            }
        }
        this.languages.addLanguage(lngkey,lngmap);
    }
    /**
     * hasLanguage checks if a language key is existent
     */
    public hasLanguage(lngkey:string): boolean {
        return (this.languages==null)?false:this.languages.hasLanguage(lngkey);
    }
    /**
     * hasKey checks if the language and the key is existent in that language.
     * 
     * @param lngkey - The language key to search for
     * @param key - The key in that language.
     */
    public hasKey(lngkey:string,key:string) : boolean {
        return (this.languages==null)?false:this.languages.hasKey(lngkey,key);
    }
    /**
     * Sets a key/value pair, if not existent and tracks a history of keys.
     *
     * @param lngkey - the language key to set (e.g 'en','de')
     * @param key - the key (text in default language)
     * @param value - The text in the current language.
     */
    public setItem(lngkey:string,key:string,value:string): void {
        if (this.languages != null) {
            this.languages.setItem(lngkey,key,value);
        }
    }
    /**
     * 
     * @param lngkey - current language to delete in
     * @param key - key to delete
     * 
     */
    public deleteItem(lngkey:string,key:string): void {
        if (this.languages != null) {
            this.languages.deleteItem(lngkey,key);
        }
    }
    /**
     * 
     * @param lngkey language to empty.
     * @alpha TODO: add TranslateAction/subject...
     */
    public emptyItems(lngkey:string): void {
        if (this.languages != null) {
            this.languages.emptyItems(lngkey);
        }
    }
    /**
     * get all items for one language key
     * 
     * @param lngkey - the language key e.g. 'en','de'
     * @returns the javascript object representing the languange key/value pairs.
     */
    public getItems(lngkey:string): any {
        return (this.languages==null)?{}:this.languages.getItems(lngkey);
    }
    /**
     * get all items for all language keys
     * 
     * @returns the javascript object representing all lanugages
     */
    public getAllItems(): any {
        return (this.languages==null)?{}:this.languages.getAllItems();
    }
    
    /**
     * merge all items with a second javascript object
     * 
     * @remarks
     * Keys in the parameter two will overwrite existing key/value pairs in the existing one.
     * 
     * @param lngkey - which language to merge in.
     * @param other - the OneLanugage or key/value pairs object to merge.
     * @alpha (data type checks?, add TransalteActions/Subject
     */
    public mergeItems(lngkey:string,other:any) :void {
        if (this.languages != null) {
            this.languages.mergeItems(lngkey,other);
        }
    }
    /**
     * 
     * @param lngkey the language to get the keys from
     * @returns a string list of keys.
     */
    public getLanguageKeys(lngkey:string) : string[] {
        return (this.languages==null)?[]:this.languages.getLanguageKeys(lngkey);
    }
    /**
     * compares two collections of I18nLanguages and produces an action list
     * @param srcmod module name of this source
     * @param target target langauges to compare with
     * @param targetmod module name of that target
     * @returns list of Transactions
     */
    public compareLanguages(srcmod:string,target:I18nLanguages,targetmod:string) : I18nTranslateActions|null {
        if (this.languages != null) {
            return this.languages.compareLanguages(srcmod,target,targetmod);
        } else {
            return null;
        }
    }
    /**
     * 
     * @param modref the external model reference to use
     * @returns a list of actions to achieve consistency.
     */
    public checkConsistency(modref:string): I18nTranslateActions {
        return this.languages.compareLanguages(modref,this.languages,modref);
    }
}

export class I18nCircleModel {
    private modules : any = {};
    private createFlag : boolean = true;

    /**
     * 
     * @param modref the reference to the model
     * @param moddata the full data as javascrpt object
     * @returns the newly added module itself
     */
    public addModule(modref:string,moddata:any) : I18nOneModule {
        var mod :I18nOneModule = I18nOneModule.createFromData(modref,moddata);
        this.modules[modref] = mod;
        return mod;
    }


    private getModule(modref:string) : I18nOneModule {
        var mod : I18nOneModule;
        if (this.modules.hasOwnProperty(modref)) {
            mod =  this.modules[modref];
        } else {
            if (this.createFlag) {
                mod = this.addModule(modref,{});
            } else {
                throw new Error("New Modul without createFlag: "+modref);
            }
        }
        return mod;
    }
    /**
     * sets or merge a language collection of key/value-pairs
     * 
     * @param modref - the module reference
     * @param lngkey - the language key e.g. 'en'
     * @param lngmap - the javascript object to initialize.
     */
    public addLanguage(modref:string,lngkey:string,lngdata:any) :void {
        var mod : I18nOneModule = this.getModule(modref);
        mod.addLanguage(lngkey,lngdata,this.createFlag);
    }
    /**
     * 
     * @returns a list of module references
     */
    public getModuleReferences():string[] {
        return this.modules.keys();
    }
    /**
     * 
     * @returns the list of modules
     */
    public getModules():I18nOneModule[] {
        return this.modules;
    }

    /**
     * 
     * @param modref the module reference
     * @param lngkey langauge key
     * @param key the key
     * @returns the language value if existent or the key if not.
     */
    public get(modref:string,lngkey:string,key:string) : string {
        var mod : I18nOneModule;
        if (this.modules.hasOwnProperty(modref)) {
            mod = this.modules[modref];
            return mod.getOrCreateItem(lngkey,key,this.createFlag);
        }
        if (!this.createFlag) {
            return key;
        }
        mod = I18nOneModule.createFromData(modref,{});
        if (typeof mod !== 'string') {
            mod.addLanguage(lngkey,{});
            return mod.getOrCreateItem(lngkey,key);
        }
        return key;
    }

    /**
     * 
     * @param modref the module reference
     * @param lngkey the language key
     * @param i18n if not null, then new key will be created in the default language
     * @returns A new I18nCache 
     */
    public getLanguageCache(modref:string,lngkey:string,i18n:I18nCircleModel):I18nCache|null {
        var mod : I18nOneModule = this.getModule(modref);
        return mod.getLanguageCache(modref,lngkey,this.createFlag?this:null);
    }
    
}