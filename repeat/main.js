import {observe , set , del} from './observer.js';
import { Watcher } from './watcher.js';
import {defStateProtype} from './utils.js';

export class Vue {
    constructor({data}){

        this._data = observe(data).value;
        defStateProtype(this._data.__ob__,'vmCount',1,false);
        this._isVue = true;

    }

    $watch(expOrFn , cb , options = {immediate:false , deep:false}){
        const watcher = new Watcher(this , expOrFn , cb , options.deep);
        if(options.immediate){
            cb.call(this,watcher.value);
        }
        return function unwatchFn(){
            watcher.teardown();
        }
    }

    $set(target , key , val){
        set(target , key , val);
    }

    $delete(target,key){
        del(target,key);
    }
}
