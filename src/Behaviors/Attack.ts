export default (tick: number) => {
    if(this.can_check_player){
        this.checkPlayer()
    }
    
    if(!this.target){
        return
    } 

    let a_e = this.getBoxElipse()
    a_e.r = this.attack_radius

    if(Func.elipseCollision(a_e, this.target.getBoxElipse())){
        if (this.enemyCanAtack(tick)){
            this.setState(this.setAttackState)
        }

        else{
            this.setState(this.setIdleAct)
        }
    }
    else{
        this.moveAct()
    }
}