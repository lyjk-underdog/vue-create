import { nodeOps } from '../node-ops.js';

function setAttributeByVnode(vnode , attr , value){
    let elm = vnode.elm;
    elm && nodeOps.setAttribute(elm , attr , value);
}

function removeAttributeByVnode(vnode , attr){
    let elm = vnode.elm;
    elm && nodeOps.removeAttribute(elm , attr);
}

function createAttrs(vnode){
    let attrsObj = vnode.data.attrs || {};

    for(let attr in attrsObj){
        let attrVal = attrsObj[attr];
        setAttributeByVnode(vnode , attr , attrVal)
    }
}

function updateAttrs(newVnode , oldVnode){
    let newAttrsObj = newVnode.data.attrs || {},
        oldAttrsObj = oldVnode.data.attrs || {};

    for(let attr in newAttrsObj){
        let newAttrVal = newAttrsObj[attr],
            oldAttrVal = oldAttrsObj[attr];

        if(!oldAttrsObj.hasOwnProperty(attr)){
            setAttributeByVnode(oldVnode , attr , newAttrVal);
        }else {
            if(newAttrVal !== oldAttrVal){
                setAttributeByVnode(oldVnode , attr , newAttrVal);
            }

            delete oldAttrsObj[attr];
        }
    }

    for(let rmAttr in oldAttrsObj){
        removeAttributeByVnode(oldVnode , rmAttr);
    }
}

export default {
    create:createAttrs,
    update:updateAttrs
}
