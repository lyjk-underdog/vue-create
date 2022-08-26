import {defStateProtype} from './utils.js'

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

    defStateProtype(arrMethods , method , function(...args){
        let ob = this.__ob__;
        //通知该数组（value）对应的访问器属性（key）对应的依赖
        ob.dep.notify();
        //对新加入数组的值进行观察
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