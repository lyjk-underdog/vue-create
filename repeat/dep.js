export class Dep {
    //依赖容器
    subs = [];

    //添加依赖
    addSub(sub){
        this.subs.push(sub);
    }

    //删除依赖
    removeSub(targetSub){
        this.subs = this.subs.filter(sub => {
            return targetSub !== sub;
        })
    }

    //收集依赖
    depned(){
        let sub = window.target;
        if(sub){
            this.addSub(sub);
            sub.addDep(this);
        }
    }

    //通知依赖更新
    notify(){
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}