import { defStateProperty } from '../utils.js';

const methodsConfig = {
    'push':{
        isInsert:true,
        startindex:0
    },
    'unshift':{
        isInsert:true,
        startindex:0
    },
    'splice':{
        isInsert:true,
        startindex:2
    },
    'shift':{
        isInsert:false
    },
    'pop':{
        isInsert:false
    },
    'reverse':{
        isInsert:false
    }
}

class ArrInterceptor extends Array {
    constructor(){
        super();
        
        let methods = Object.keys(methodsConfig);
        methods.forEach(method => {
            const original = this[method];
            defStateProperty(this,method,function(...args){
                const result = original.apply(this , args);
                const ob = this.__ob__,
                    {isInsert , startindex} = methodsConfig[method];

                ob.parentOb && ob.parentOb.findAccessor(this).dep.notify();
                isInsert && ob.observeArray(args.slice(startindex));
                
                return result;
            },false)
        })
    }
}

export const arrInterceptor = new ArrInterceptor();