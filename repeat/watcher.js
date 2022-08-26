import {parsePath} from './utils.js';

export class Watcher {
    constructor(vm , expOrFn , cb , deep){
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.deps = [];
        this.deep = deep;
        this.getter =  typeof expOrFn == 'function' ? expOrFn : parsePath(expOrFn);
        this.value = this.get();
        
    }

    //相对于是订阅
    get(){
        window.target = this;
        let val = this.getter.call(this.vm,this.vm);
        if(this.deep){
            //使用set解决递归的重复性问题
            const seenObject = new Set();
            const traverse = (val) => {
                if(typeof val !== 'object' || Object.isFrozen(val)) return;
                //对于相同的对象或者数组，不做重复的遍历
                if(seenObject.has(val)){
                    return;
                }else {
                    seenObject.add(val);
                }
                     
                if(Array.isArray(val)){
                    val.forEach(item => traverse(item));
                }else {
                    let keys = Object.keys(val);
                    keys.forEach(key => traverse(val[key]));
                }
            }

            traverse(val);
        }
        window.target = null;
        return val;
    }

    addDep(dep){
        this.deps.push(dep);
    }

    update(){
        let oldVal = this.value;
        this.value = this.getter.call(this.vm , this.vm);
        //更新的主要目的就是调用回调函数
        this.cb.call(this.vm , this.value , oldVal);
    }

    //取消订阅
    //需要在watcher中记录自己都订阅了谁，也就是watcher实例被收集进了哪些dep中。
    //当watcher不想继续订阅这些dep时，循环自己记录的dep并调用dep.removeSub删除掉自己来取消订阅
    teardown(){
        this.deps.forEach(dep => {
            dep.removeSub(this);
        })
    }
}