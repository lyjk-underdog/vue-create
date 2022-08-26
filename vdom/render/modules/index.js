import attrs from "./attrs.js";
import className from "./class-name.js";
import eventListener from "./event-listener.js";
import style from "./style.js";

function create(vnode){

    attrs.create(vnode);
    className.create(vnode);
    eventListener.create(vnode);
    style.create(vnode);
}

function update(newVnode , oldVnode){

    attrs.update(newVnode , oldVnode);
    className.update(newVnode , oldVnode);
    eventListener.update(newVnode , oldVnode);
    style.update(newVnode , oldVnode);

}

export default {
    create,
    update
}