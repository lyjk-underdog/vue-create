import {observe , set , del , Watcher} from './observer/index.js';
import { defStateProperty , proxy } from './utils.js';
import { patch , createVnode , nodeOps } from './render/index.js';

export class Vue {
    constructor(options){

        let {
            el,
            data,
            render
        } = options;

        this._isVue = true;

        //initData
        this.$data = observe(data).value;
        defStateProperty(this.$data.__ob__,'vmCount',1,false);
        proxy(this , this.$data);

        //initWatch
        let oldVnode = nodeOps.getElement('#app');

        this.$watch('$data' , function(){
            let newVnode = render.call(this , createVnode);
            patch(newVnode , oldVnode);
            oldVnode = newVnode;
        } , {immediate:true , deep:true})
    }

    $watch(expOrFn , cb , options = {immediate: false , deep: false}){
        let watcher = new Watcher(this , expOrFn , cb , options.deep);
        if(options.immediate){
            cb.call(this , watcher.value);
        }
        return function unWatch(){
            watcher.teardown();
        }
    }

    $set(target , key , val){
        return set(target , key , val);
    }

    $delete(target , key){
        return del(target , key);
    }
}