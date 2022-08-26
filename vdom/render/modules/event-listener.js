import { nodeOps } from '../node-ops.js';

function addEventListenerByVnode(vnode , event , cb){
    let elm = vnode.elm;
    elm && nodeOps.addEventListener(elm , event , cb);
}

function removeEventListenerByVnode(vnode , event , cb){
    let elm = vnode.elm;
    elm && nodeOps.removeEventListener(elm , event , cb);
}

function createEventListener(vnode){
    let eventsObj = vnode.data.on || {};

    for(let event in eventsObj){
        let eventCb = eventsObj[event];
        addEventListenerByVnode(vnode , event , eventCb);
    }
}

function updateEventListener(newVnode , oldVnode){

    let newEventsObj = newVnode.data.on || {},
        oldEventsObj = oldVnode.data.on || {};
    
    for(let event in newEventsObj){
        let newEventCb = newEventsObj[event],
            oldEventCb = oldEventsObj[event];
        
        if(!oldEventsObj.hasOwnProperty(event)){
            addEventListenerByVnode(oldVnode , event , newEventCb);
        }else {
            if(newEventCb !== oldEventCb){
                removeEventListenerByVnode(oldVnode , event , oldEventCb);
                addEventListenerByVnode(oldVnode , event , newEventCb);
            }

            delete oldEventsObj[event];
        }
    }

    for(let rmEvent in oldEventsObj){
        removeEventListenerByVnode(oldVnode , rmEvent , oldEventsObj[rmEvent]);
    }
}

export default {
    create:createEventListener,
    update:updateEventListener
}