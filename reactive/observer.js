import { Dep } from './dep.js';
import {defStateProperty} from './utils.js';
import { arrInterceptor } from './arrInterceptor.js';

class Observer {

    static newInstance(data){
        if(typeof data !== 'object') return;
        let ob = null;
        if(data.hasOwnProperty('__ob__') && data.__ob__ instanceof Observer){
            ob = data.__ob__;
        }else {
            ob = new Observer(data);
        }
        return ob;
    }

    static set(target , key , val){
        if(typeof target !== 'object'){
            throw new Error('target必须是一个对象或者数组');
        }
        if(Array.isArray(target)){
            target.length = Math.max(key , target.length);
            target.splice(key,0,val);
            return val;
        }
        if(key in target && !(key in Object.getPrototypeOf(target))){
            target[key] = val;
            return val;
        }
        let ob = target.__ob__;
        if(target._isVue || (ob && ob.vmCount)){
            throw new Error('target不能是Vue实例或者Vue实例的根数据对象')
        }
        if(!ob){
            target[key] = val;
            return val;
        }else {
            target[key] = val;
            ob.observeProperty(target,key,val);
            ob.parentOb.findAccessor(target).dep.notify();
            return val;
        }
    }

    static del(target , key){
        if(typeof target !== 'object'){
            throw new Error('target必须是一个对象或者数组');
        }
        if(Array.isArray(target)){
            target.splice(key,1);
            return;
        }
        if(key in target && !(key in Object.getPrototypeOf(target))){
            let ob = target.__ob__;
            if(target._isVue || (ob && ob.vmCount)){
                throw new Error('target不能是 Vue 实例，或者 Vue 实例的根数据对象');
            }
            if(!ob){
                delete target[key];
                return;
            }else {
                delete target[key];
                ob.parentOb.findAccessor(target).dep.notify();
                return;
            }
        }else {
            return;
        }
    }

    constructor(data){
        this.value = data;
        defStateProperty(data,'__ob__',this,false);
        this.accessors = [];
        this.parentOb = null;

        if(Array.isArray(data)){
            Object.setPrototypeOf(data,arrInterceptor);
            this.observeArray(data);
        }else {
            this.observeObject(data);
        }
    }

    findAccessor(value){
        let target = this.accessors.find(accessor => {
            return accessor.value === value;
        });
        return target;
    }

    observeObject(obj){
        let keys = Object.keys(obj);
        keys.forEach(key => {
            let val = obj[key];
            this.observeProperty(obj , key , val);
        })
    }

    observeProperty(obj , key , val){
        this.accessors.push(new Accessor(obj , key , val));
        let childOb = Observer.newInstance(val);
        childOb ? childOb.parentOb = this : null;
    }

    observeArray(arr){
        arr.forEach(item => {
            Observer.newInstance(item);
        })
    }
}

class Accessor {
    constructor(obj , key , val){
        this.dep = new Dep();
        this.value = val;

        Object.defineProperty(obj , key , {
            configurable: true,
            enumerable: true,
            get:() => {
                this.dep.depend();
                return this.value;
            },
            set:(newVal) => {
                if(newVal === this.value) return;
                this.value = newVal;
                this.dep.notify();
            }
        })
    } 
}

export const observe = Observer.newInstance;
export const set = Observer.set;
export const del = Observer.del;