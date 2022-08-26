import { defStateProperty } from './utils.js';

const arrProto = Array.prototype;
const arrMethods = Object.create(arrProto);

[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse'
].forEach(method => {
    const original = arrProto[method];

    defStateProperty(arrMethods , method , function(...args){
        let ob = this.__ob__;
        ob.dep.notify();
        
        let inserted = null;
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        inserted ? ob.observeArray(inserted) : null;

        return original.apply(this,args);
    } , false)
})

export default arrMethods;