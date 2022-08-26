class Dep {

    subs = new Map();

    addSub(sub){
        this.subs.set(sub.id , sub);
    }

    depend(){
        let sub = Dep.target;
        if(sub && !this.subs.has(sub.id)){
            this.addSub(sub);
        }
    }

    notify(){
        this.subs.forEach(sub => {
            sub.update();
        })
    }

}

export default Dep;