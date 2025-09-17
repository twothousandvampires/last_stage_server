import Player from "../Objects/src/Character";

export default abstract class Ability{
    
    name: string | undefined
    used: boolean = false
    cd: number = 0
    cost: number = 0

    constructor(public owner: Player){

    }

    isEnergyEnough(){
        return this.owner.resource >= this.cost
    }
    
    abstract use(): void 
    abstract canUse(): boolean

    getCd(){
        let red = this.owner.getCdRedaction()
        
        if(red > 95){
            red = 95
        }

        return this.cd * (1 - red / 100)
    }

    afterUse(forced_cd: number | undefined = undefined){
        this.owner.using_ability = undefined
        this.owner.attack_angle = undefined

        if(!this.used) return

        let cd = forced_cd ? forced_cd : this.getCd()

        setTimeout(() => {
            this.used = false
        }, cd)
    }
}