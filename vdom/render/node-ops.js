
export const nodeOps = {
    createDom(tag){
        return document.createElement(tag);
    },
    createText(text){
        return document.createTextNode(text);
    },
    modifyTextContent(el , text){
        el.textContent = text;
    },
    appendChild(parent , el){
        parent.appendChild(el);
    },
    removeChild(parent , el){
        parent.removeChild(el);
    },
    parentNode(el){
        return el.parentNode;
    },
    nextSibling(el){
        return el.nextSibling;
    },
    setAttribute(el , name , value){
        el.setAttribute(name,value);
    },
    removeAttribute(el , name){
        el.removeAttribute(name);
    },
    setStyle(el , name , value){
        el.style[name] = value;
    },
    addClassName(el , name){
        el.classList.add(name);
    },
    removeClassName(el , name){
        el.classList.remove(name);
    },
    addEventListener(el , event , cb){
        el.addEventListener(event , cb);
    },
    removeEventListener(el , event , cb){
        el.removeEventListener(event , cb);
    },
    insertBefore(parentEl , newEl , referenceEl){
        parentEl.insertBefore(newEl , referenceEl);
    },
    isElement(target){
        return target instanceof HTMLElement;
    },
    getElement(name){
        switch(name.charAt(0)){
            case '#':
                return document.getElementById(name.slice(1));
            case '.':
                return document.getElementsByClassName(name.slice(1));
        }
    }
}