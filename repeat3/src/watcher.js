import Dep from './dep.js';
import { parsePath } from './util.js';

let uid = 0;

class Watcher {
    constructor(vm , expOrFn , cb){
        this.id = uid++;
        this.vm = vm;
        this.cb = cb;

        if(typeof expOrFn === 'function'){
            this.getter = expOrFn;
        }else {
            this.getter = parsePath(expOrFn);
        }
        
        this.value = this.get();
    }

    get(){
        let value;

        Dep.target = this;
        value = this.getter.call(this.vm , this.vm);
        Dep.target = null;

        return value;
    }

    update(){
        let oldVal = this.value;
        this.value = this.get();
        this.cb.call(this.vm , this.value , oldVal);
    }

}

export default Watcher;