export class Dep {
    subs = [];

    addSub(sub){
        this.subs.push(sub);
    }

    removeSub(targetSub){
        this.subs = this.subs.filter(sub => {
            return sub !== targetSub;
        })
    }

    depend(){
        let sub = Dep.target;
        if(sub){
            this.addSub(sub);
            sub.addDep(this);
        }
    }

    notify(){
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}