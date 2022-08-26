import { Dep } from './dep.js';
import { defStateProtype } from './utils.js';
import arrInterceptor from './arrInterceptor.js';

export class Observer {

    //获取实例的静态方法，目的是控制生成对象的逻辑
    static instance(data){
        //如果data不是对象或者数组，直接返回
        if(typeof data !== 'object') return;
        //防止多次观察同一对象
        let ob = null;
        if(data.hasOwnProperty('__ob__') && data.__ob__ instanceof Observer){
            ob = data.__ob__;
        }else {
            ob = new Observer(data);
        }
        return ob;
    }

    //把对象的数据属性改造成访问器属性的主要螺距
    static definedReactive(obj , key , val){
        //注意，这里已经形成了一个闭包。所以对于每一个访问器属性，都有一个自己的dep,val,childOb。

        let dep = new Dep();
        //观察属性的值
        let childOb = Observer.instance(val);

        Object.defineProperty(obj , key , {
            configurable: true,
            enumerable: true,
            get(){
                dep.depned();
                childOb ? childOb.dep.depned() : null;
                return val;
            },
            set(newVal){
                if(newVal === val) return;
                val = newVal;
                dep.notify();
            }
        })
    }

    //vm.$set和Vue.set的逻辑，解决添加对象属性和修改数组元素不能被观察的问题
    static set(target , key , val){
        //target必须是一个对象或者数组
        if(typeof target !== 'object'){
            throw new Error('target参数错误');
        }
        //如果target是数组
        if(Array.isArray(target)){
            //解决splice的一个限制：如果start超出了数组的长度，则从数组末尾开始添加内容
            target.length = Math.max(key,target.length);
            //使用splice来修改对应下标元素值，这样就可以被数组拦截器拦截，通知依赖
            target.splice(key,1,val);
            return val;
        }
        //接下来的target就是一个对象了
        //如果key已经在target中，我们只需要改变其对应的属性值就行。
        if(key in target && !(key in Object.getPrototypeOf(target))){
            target[key] = val;
            return val;
        }
        let ob = target.__ob__;
        //如果key值不在target中，说明对象会添加新的属性，这时候如果
        if(target._isVue || (ob && ob.vmCount)){
            throw new Error('对象不能是 Vue 实例，或者 Vue 实例的根数据对象');
        }
        if(!ob){
            target[key] = val;
            return val;
        }else {
            target[key] = val;
            ob.dep.notify();
            Observer.definedReactive(target,key,val);
        }
    }

    static del(target , key){
        if(typeof target !== 'object'){
            throw new Error('target参数错误');
        }
        if(Array.isArray(target)){
            target.splice(key,1);
            return;
        }
        if(key in target && !(key in Object.getPrototypeOf(target))){
            let ob = target.__ob__;
            if(target._isVue || (ob && ob.vmCount)){
                throw new Error('对象不能是 Vue 实例，或者 Vue 实例的根数据对象');
            }
            if(!ob){
                delete target[key];
                return;
            }else {
                delete target[key];
                ob.dep.notify();
            }
        }else {
            return;
        }
    }

    constructor(data){
        //因为前面instance静态方法的过滤，这里的data只能是对象或者数组
        //又因为对数组和对象的操作过程不同，所以我们要进行判断，分逻辑操作
        if(Array.isArray(data)){
            //把数组的原型设置成我们的拦截对象
            Object.setPrototypeOf(data , arrInterceptor);
            //观察数组对应的逻辑
            this.observeArray(data);
        }else {
            //观察对象对应的逻辑
            this.walk(data);
        }

        //把observer实例变成该data的属性
        //好处：1.可以给该对象或数组是否已经被观察了提供依据
        //     2.被观察的对象或数组可以获取到observer实例（this.__ob__）,继而使用一些方法
        defStateProtype(data , '__ob__' , this , false);
        //这个dep存储的是该对象或数组（value）对应的访问器属性（key）对应的依赖
        this.dep = new Dep();
        this.value = data;
    }

    walk(obj){
        //把该对象的数据属性改造成访问器属性
        let keys = Object.keys(obj);
        keys.forEach(key => {
            let val = obj[key];
            Observer.definedReactive(obj , key , val);
        })
    }

    observeArray(arr){
        //因为数组不适合使用defineProperty改造，所以只能遍历这个数组的元素，观察每一个元素
        arr.forEach(item => {
            Observer.instance(item);
        })
    }
}

export const observe = Observer.instance;
export const set = Observer.set;
export const del = Observer.del;


