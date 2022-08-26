export class Vnode {
    constructor(tag , data , children , text){
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.key = data && data.key;
    }
}

export const createElement = Vnode.createElement;

