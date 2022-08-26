import { createEmptyVnode , Vnode} from './vdom/index.js';
import { nodeOps } from './node-ops.js';
import modules from './modules/index.js';

function isVnode(target){
    return target instanceof Vnode;
}

function isSameVnode(vnode1 , vnode2){
    let isSameTag = vnode1.tag === vnode2.tag,
        isSameKey = vnode1.key === vnode2.key;

    return isSameKey && isSameTag;
}

function hasChildren(vnode){
    return !!vnode.children && !!vnode.children.length;
}

function isTextVnode(vnode){
    return typeof vnode.text === 'string';
}

function classifyVnodes(vnodes , start , end){
    let keyToIndexMap = new Map(),
        tagToIndexArr = [];

    for(let i = start ; i <= end ; i++){
        let vnode = vnodes[i],
            key = vnode.key,
            tag = vnode.tag;

        if(key){
            keyToIndexMap.set(key , i);
        }else {
            tagToIndexArr.push([tag , i]);
        }
    }

    return {keyToIndexMap , tagToIndexArr};
}

function removeDomByVnode(vnode){
    let elm = vnode.elm;
    if(elm){
        let parentElm = nodeOps.parentNode(elm);
        parentElm && nodeOps.removeChild(parentElm , elm);
    } 
}

function removeDomsByVnodes(vnodes , start , end){
    for(let i = start ; i <= end ; i++){
        let vnode = vnodes[i];
        removeDomByVnode(vnode);
    }
}

function insertDomBeforeRefByVnode(refParentVnode , vnode , refVnode){
    let newElm = vnode.elm,
        refElm = (refVnode && refVnode.elm) || null,
        refElmParent = refParentVnode.elm;
    
    if(refElmParent && newElm){
        nodeOps.insertBefore(refElmParent , newElm , refElm);
    }  
}

function insertDomsBeforeRefByVnodes(refParentVnode , vnodes , refVnode , start , end){
    for(let i = start ; i <= end ; i++){
        let vnode = vnodes[i];
        insertDomBeforeRefByVnode(refParentVnode ,vnode , refVnode);
    }
}

function insertDomAfterRefByVnode(refParentVnode , vnode , refVnode){
    
    let newElm = vnode.elm,
        refElm = refVnode.elm,
        refElmParent = refParentVnode.elm,
        refElmNextSibling = refElm && nodeOps.nextSibling(refElm);

    if(refElmParent && newElm){
        nodeOps.insertBefore(refElmParent , newElm , refElmNextSibling);
    }
  
}

function modifyTextContentByVnode(vnode , newText){
    let elm = vnode.elm;
    elm && nodeOps.modifyTextContent(elm , newText);
}

function createDomByVnode(vnode){
    let {
        tag,
        children,
        text
    } = vnode;

    let elm = null;

    if(tag){
        elm = nodeOps.createDom(tag);
        vnode.elm = elm;
        modules.create(vnode);
        children && children.forEach(childVnode => {
            let childElm = createDomByVnode(childVnode);
            nodeOps.appendChild(elm , childElm);
        });
    }else {
        elm = nodeOps.createText(text);
        vnode.elm = elm;
    }

    return elm;
}

function createDomsByVnodes(vnodes , start , end){
    for(let i = start ; i <= end ; i++){
        let vnode = vnodes[i];
        createDomByVnode(vnode);
    }
}


function updateChildren(newVnode , oldVnode){

    let newChildren = (hasChildren(newVnode) && newVnode.children) || [],
        oldChildren = (hasChildren(oldVnode) && oldVnode.children) || [];

    let newStartIndex = 0,
        newEndIndex = newChildren.length - 1,
        oldStartIndex = 0,
        oldEndIndex = oldChildren.length - 1;

    while(newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex){
        
        let newStartVnode = newChildren[newStartIndex],
            oldStartVnode = oldChildren[oldStartIndex],
            newEndVnode = newChildren[newEndIndex],
            oldEndVnode = oldChildren[oldEndIndex];  
        
        if(!oldStartVnode){
            oldStartIndex++;
            continue;
        }else if(!oldEndVnode){
            oldEndIndex--;
            continue;
        }

        if(isSameVnode(newStartVnode , oldStartVnode)){
            //新前与新前
            patchVnode(newStartVnode , oldStartVnode);
            newStartIndex++;
            oldStartIndex++;
        }else if(isSameVnode(newEndVnode , oldEndVnode)){
            //新后与旧后
            patchVnode(newEndVnode , oldEndVnode);
            newEndIndex--;
            oldEndIndex--;
        }else if(isSameVnode(newEndVnode , oldStartVnode)){
            //新后与旧前
            insertDomAfterRefByVnode(oldVnode , oldStartVnode , oldEndVnode);
            patchVnode(newEndVnode , oldStartVnode);
            newEndIndex--;
            oldStartIndex++;
        }else if(isSameVnode(newStartVnode , oldEndVnode)){
            //新前与旧后
            insertDomBeforeRefByVnode(oldVnode , oldEndVnode , oldStartVnode);
            patchVnode(newStartVnode , oldEndVnode);
            newStartIndex++;
            oldEndIndex--;
        }else {
            let {keyToIndexMap , tagToIndexArr} = classifyVnodes(oldChildren , oldStartIndex + 1 , oldEndIndex - 1);
            let newKey = newStartVnode.key,
                newTag = newStartVnode.tag;

            if(newKey){

                let targetOldIndex = keyToIndexMap.get(newKey);
                if(targetOldIndex){
                    let targetOldVnode = oldChildren[targetOldIndex];

                    if(targetOldVnode.tag === newStartVnode.tag){
                        insertDomBeforeRefByVnode( oldVnode , targetOldVnode , oldStartVnode);
                        patchVnode(newStartVnode , targetOldVnode);
                    }else {
                        removeDomByVnode(targetOldVnode);
                        createDomByVnode(newStartVnode);
                        insertDomBeforeRefByVnode(oldVnode , newStartVnode , oldStartVnode);
                    }

                    oldChildren[targetOldIndex] = null;
                }else {
                    createDomByVnode(newStartVnode);
                    insertDomBeforeRefByVnode(oldVnode , newStartVnode , oldStartVnode);
                }

            }else {
                let target = tagToIndexArr.find(item => item[0] === newTag),
                    targetOldIndex = target && target[1];
                
                if(targetOldIndex){
                    let targetOldVnode = oldChildren[targetOldIndex];

                    insertDomBeforeRefByVnode(oldVnode , targetOldVnode , oldStartVnode);
                    patchVnode(newStartVnode , targetOldVnode);
                    oldChildren[targetOldIndex] = null;
                }else {
                    createDomByVnode(newStartVnode);
                    insertDomBeforeRefByVnode(oldVnode , newStartVnode , oldStartVnode);
                }
            }

            newStartIndex++;
        }
        
    }

    if(newStartIndex <= newEndIndex){
        createDomsByVnodes(newChildren , newStartIndex , newEndIndex);
        insertDomsBeforeRefByVnodes(oldVnode , newChildren , newChildren[newEndIndex + 1] , newStartIndex , newEndIndex);
    }else if(oldStartIndex <= oldEndIndex){
        removeDomsByVnodes(oldChildren , oldStartIndex , oldEndIndex);
    }
    

}

function patchVnode(newVnode , oldVnode){

    if(isTextVnode(newVnode)){
        if(newVnode.text !== oldVnode.text){
            modifyTextContentByVnode(oldVnode , newVnode.text);
        }
    }else {
        modules.update(newVnode , oldVnode);
        updateChildren(newVnode , oldVnode);
    }

    
    newVnode.elm = oldVnode.elm;
}

function _patch(parentVnode , newVnode , oldVnode){

    if(isSameVnode(newVnode , oldVnode)){
        patchVnode(newVnode , oldVnode)
    }else {
        createDomByVnode(newVnode);
        insertDomBeforeRefByVnode(parentVnode , newVnode , oldVnode);
        removeDomByVnode(oldVnode);
    }
}

export function patch(newVnode , oldVnodeOrContainer){
    
    let parentVnode , oldVnode;

    if(nodeOps.isElement(oldVnodeOrContainer)){
        parentVnode = createEmptyVnode();
        parentVnode.elm = oldVnodeOrContainer;
        oldVnode = createEmptyVnode();
    }else if(isVnode(oldVnodeOrContainer)){
        parentVnode = createEmptyVnode();
        parentVnode.elm = nodeOps.parentNode(oldVnodeOrContainer.elm);
        oldVnode = oldVnodeOrContainer;
    }

    _patch(parentVnode , newVnode , oldVnode);
}



