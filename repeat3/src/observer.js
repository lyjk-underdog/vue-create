import Dep from './dep.js';
import { defStateProperty } from './util.js';
import arrInterceptor from './array.js';

class Observer {
    static factory(data){
        let ob = null;
        if(typeof data === 'string') return ob;
        if(data.hasOwnProperty('__ob__') && data.__ob__ instanceof Observer){
            ob = data.__ob__;
        }else {
            ob = new Observer(data);
        }

        return ob;
    }

    static observeArray(arr){
        arr.forEach(item => {
            Observer.factory(item);
        })
    }

    constructor(data){
        
        this.accessors = [];
        this.parentOb = null;

        defStateProperty(data , '__ob__' , this , false);

        if(Array.isArray(data)){
            Object.setPrototypeOf(data , arrInterceptor);
            Observer.observeArray(data);
        }else {
            this._observeObj(data);
        }
    }

    _observeObj(obj){
        let keys = Object.keys(obj);
        keys.forEach(key => {
            let val = obj[key],
                childOb = Observer.factory(val);
            this.accessors.push(new Accessor(obj , key , val));
            childOb && (childOb.parentOb = this);
        })
    }

    findAccessor(val){
        return this.accessors.find(accessor => accessor.value === val);
    }

}

class Accessor {

    dep = new Dep();

    constructor(obj , key , val){
        this.value = val;

        Object.defineProperty(obj , key , {
            configurable:true,
            enumerable:true,
            get:() => {
                this.dep.depend();
                return this.value;
            },
            set:(newVal) => {
                if(newVal === this.value) return;
                Observer.factory(newVal);
                this.value = newVal;
                this.dep.notify();
            }
        })
    }
}

export default Observer;