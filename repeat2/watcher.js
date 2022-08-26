import { Dep } from './dep.js';
import { parsePath } from './utils.js';

export class Watcher {

    constructor(vm,expOrFn,cb,deep){
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.deep = deep;
        this.deps = [];
        this.getter = typeof expOrFn == 'function' ? expOrFn : parsePath(expOrFn);
        this.value = this.get();
    }

    get(){
        Dep.target = this;
        let val = this.getter.call(this.vm , this.vm);
        if(this.deep){
            let seenObject = new Set();
            let traverse = (val) => {
                if(typeof val !== 'object') return;

                if(seenObject.has(val)) return;
                else seenObject.add(val);

                if(Array.isArray(val)){
                    val.forEach(item => traverse(item));
                }else {
                    let keys = Object.keys(val);
                    keys.forEach(key => traverse(val[key]));
                }
            }

            traverse(val);
        }
        Dep.target = null;
        return val;
    }

    update(){
        let oldVal = this.value;
        this.value = this.getter.call(this.vm , this.vm);
        this.cb.call(this.vm , this.value , oldVal);
    }

    addDep(dep){
        this.deps.push(dep);
    }

    teardown(){
        this.deps.forEach(dep => {
            dep.removeSub(this);
        })
    }

}