export function defStateProperty(obj , key , value , enumerable = true){
    Object.defineProperty(obj , key , {
        configurable: true,
        enumerable,
        writable: true,
        value
    })
}

export function parsePath(keyPath){
    let segments = keyPath.split('.');
    return function(root){
        return segments.reduce((obj , key) => {
            return obj[key];
        } , root)
    }
}

export function proxy(source , target){
    let keys = Object.keys(target);
    keys.forEach(key => {
        Object.defineProperty(source , key , {
            configurable: true,
            enumerable: true,
            get(){
                return target[key];
            },
            set(newVal){
                target[key] = newVal;
            }
        })
    })
}
