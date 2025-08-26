import Player from "../Objects/src/Character";

export default abstract class Ability{
    
    name: string | undefined
    used: boolean = false
    cd: number | undefined = undefined

    constructor(public owner: Player){

    }
    
    abstract use(): void 
    abstract canUse(): boolean
    
    afterUse(){
        
    }
}