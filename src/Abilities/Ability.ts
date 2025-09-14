import Player from "../Objects/src/Character";

export default abstract class Ability{
    
    name: string | undefined
    used: boolean = false
    cd: number = 0
    cost: number = 0

    constructor(public owner: Player){

    }
    
    abstract use(): void 
    abstract canUse(): boolean

    getCd(){
        let red = this.owner.getCdRedaction()
        
        if(red > 90){
            red = 90
        }

        return this.cd * (1 - red / 100)
    }

    afterUse(){
        this.owner.using_ability = undefined
        this.owner.attack_angle = undefined

        if(!this.used) return

        setTimeout(() => {
            this.used = false
        }, this.getCd())
    }
}