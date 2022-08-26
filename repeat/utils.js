export function parsePath(keyPath){
    let segments = keyPath.split('.');
    return function (root){
        return segments.reduce((obj , key) => {
            return obj[key];
        } , root)
    }
}

export function defStateProtype(obj , key , value , enumerable = true){
    Object.defineProperty(obj , key , {
        configurable: true,
        writable: true,
        enumerable,
        value
    })
}
