import {defStateProperty} from './utils.js';
import {Dep} from './dep.js';
import arrInterceptor from './arrInterceptor.js';

class Observer {

    static instance(data){
        if(typeof data !== 'object') return;
        let ob = data.__ob__;
        if(ob){
            return ob;
        }else {
            ob = new Observer(data);
            return ob;
        } 
    }

    static definedReactive(obj , key , val){
        let dep = new Dep();
        let childOb = Observer.instance(val);

        Object.defineProperty(obj , key , {
            configurable: true,
            enumerable: true,
            get(){
                dep.depend();
                childOb ? childOb.dep.depend() : null;
                return val;
            },
            set(newVal){
                if(newVal === val) return;
                val = newVal;
                dep.notify();
            }
        })
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
            Observer.definedReactive(target,key,val);
            ob.dep.notify();
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
                ob.dep.notify();
                return;
            }
        }else {
            return;
        }
    }

    constructor(data){
        this.value = data;
        defStateProperty(data,'__ob__',this,false);

        if(Array.isArray(data)){
            Object.setPrototypeOf(data,arrInterceptor);
            this.observeArray(data);
        }else {
            this.walk(data);
        }

        this.dep = new Dep();
    }

    observeArray(arr){
        arr.forEach(item => {
            Observer.instance(item);
        })
    }

    walk(obj){
        let keys = Object.keys(obj);
        keys.forEach(key => {
            Observer.definedReactive(obj , key , obj[key]);
        })
    }

}

export const observe = Observer.instance;
export const set = Observer.set;
export const del = Observer.del;

