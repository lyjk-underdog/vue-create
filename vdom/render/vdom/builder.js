import { Vnode } from './vnode.js';

export function createVnode(tag , data , children){
    if(children){
        children = children.map(child => {
            if(typeof child === 'string' || typeof child === 'number'){
                return createTextVnode(String(child));
            } else {
                return child;
            }
        })
    }
    
    return createElmVnode(tag , data , children);
}

export function createElmVnode(tag , data , children){
    return new Vnode(tag , data , children);
}

export function createTextVnode(text){
    return new Vnode(undefined , undefined , undefined , text);
}

export function createEmptyVnode(){
    return new Vnode();
}


/**
元素节点:
    {
        tag:'',
        data:{
            'class': {
                foo: true,
                bar: false
            },
            style: {
                color: 'red',
                fontSize: '14px'
            },
            // 普通的 HTML attribute
            attrs: {
                id: 'foo'
            },
        },
        children:[]
    }

文本节点:
    {
        text:''
    }
**/