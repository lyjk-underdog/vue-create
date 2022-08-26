import {observe , set , del} from './observer.js';
import { Watcher } from './watcher.js';
import { proxy } from './utils.js';

export class Vue {
    constructor({data}){
        this._data = observe(data).value;
        proxy(this , this._data);
    }

    $watch(expOrFn , cb , options = {immediate: false , deep: false}){
        let watcher = new Watcher(this , expOrFn , cb , options.deep);
        if(options.immediate){
            cb.call(this , watcher.value);
        }
        return function unWatch(){
            watcher.teardown();
        }
    }

    $set(target , key , val){
        set(target , key , val);
    }

    $delete(target , key){
        del(target , key);
    }
}