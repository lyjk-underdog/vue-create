import { nodeOps } from '../node-ops.js';

function addClassNameByVnode(vnode , className){
    let elm = vnode.elm;
    elm && nodeOps.addClassName(elm , className);
}

function removeClassNameByVnode(vnode , className){
    let elm = vnode.elm;
    elm && nodeOps.removeClassName(elm , className);
}

function createClassName(vnode){
    let classNameObj = vnode.data.className || {};

    for(let className in classNameObj){
        let classNameStatus = classNameObj[className];
        if(classNameStatus === true){
            addClassNameByVnode(vnode , className)
        }  
    }
}

function updateClassName(newVnode , oldVnode){
    let newClassNameObj = newVnode.data.className || {},
        oldClassNameObj = oldVnode.data.className || {};
  
    for(let className in newClassNameObj){
        let newClassNameStatus = newClassNameObj[className],
            oldClassNameStatus = oldClassNameObj[className];

        if(!oldClassNameObj.hasOwnProperty(className)){
            if(newClassNameStatus === true){
                addClassNameByVnode(oldVnode , className);
            }
        }else {
            if(newClassNameStatus !== oldClassNameStatus){
                if(newClassNameStatus === true){
                    addClassNameByVnode(oldVnode , className);
                }else {
                    removeClassNameByVnode(oldVnode , className);
                }
            }

            delete oldClassNameObj[className];
        }

    
    }

    for(let rmClassName in oldClassNameObj){
        let rmClassNameStatus = oldClassNameObj[rmClassName];

        if(rmClassNameStatus !== false){
            removeClassNameByVnode(oldVnode , className);
        }

    }
}

export default {
    create:createClassName,
    update:updateClassName
}
