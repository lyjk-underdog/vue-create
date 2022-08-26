import { nodeOps } from '../node-ops.js';

function setStyleByVnode(vnode , style , value){
    let elm = vnode.elm;
    elm && nodeOps.setStyle(elm , style , value);
}

function createStyle(vnode){
    let styleObj = vnode.data.style || {};

    for(let style in styleObj){
        let styleVal = styleObj[style];
        setStyleByVnode(vnode , style , styleVal);
    }
}

function updateStyle(newVnode , oldVnode){
    let newStyleObj = newVnode.data.style || {},
        oldStyleObj = oldVnode.data.style || {};
    
    for(let style in newStyleObj){
        let newStyleVal = newStyleObj[style],
            oldStyleVal = oldStyleObj[style];

        if(!oldStyleObj.hasOwnProperty(style)){
            setStyleByVnode(oldVnode , style , newStyleVal);
        }else {
            if(newStyleVal !== oldStyleVal){
                setStyleByVnode(oldVnode , style , newStyleVal);
            }

            delete oldStyleObj[style];
        }
    }

    for(let rmStyle in oldStyleObj){
        setStyleByVnode(oldVnode , rmStyle , '');
    }
    
}

export default {
    create:createStyle,
    update:updateStyle
}