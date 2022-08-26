import { defStateProperty } from './util.js';
import Observer from './observer.js';

const methodsConfig = {
    'push':{
        isInsert:true,
        argStartindex:0
    },
    'unshift':{
        isInsert:true,
        argStartindex:0
    },
    'splice':{
        isInsert:true,
        argStartindex:2
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

let arrPrototype = Array.prototype;
let arrInterceptor = Object.create(arrPrototype);
let methods = Object.keys(methodsConfig);

methods.forEach(method => {
    let original = arrPrototype[method];

    defStateProperty(
        arrInterceptor,
        method,
        function(...args){
            let ob = this.__ob__,
                { isInsert , argStartindex } = methodsConfig[method];
            
            ob.parentOb && ob.parentOb.findAccessor(this).dep.notify();
            isInsert && Observer.observeArray(args.slice(argStartindex));

            return original.apply(this , args);
        },
        false
    )
})

export default arrInterceptor;

