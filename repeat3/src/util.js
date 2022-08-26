export function parsePath(exp){
    let segments = exp.split('.');
    
    return function(root){
        return segments.reduce((obj , key) => {
            return obj[key];
        } , root)
    }
}

export function defStateProperty(obj , key , value , enumerable = true){
    Object.defineProperty(obj , key , {
        configurable:true,
        enumerable,
        value,
        writable:true
    })
}