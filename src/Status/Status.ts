import Character from "../Objects/src/Character"
import Unit from "../Objects/src/Unit"

export default abstract class Status{

    unit: any
    last_checked: number
    need_to_check_resist: boolean
    name: string | undefined

    constructor(public time: number, public duration: number){
        this.last_checked = time
        this.need_to_check_resist = false
    }

    checkResist(player: Unit){
        if(!this.need_to_check_resist){
            return false
        }
        else{
            return player.isStatusResist()
        }
    }

    isExpired(tick_time: number){
        return tick_time - this.time >= this.duration
    }

    unitDead(){
        
    }

    clear(){
        
    }

    update(status: any){
        this.time = Date.now()
    }

    act(tick_time: number){
        
    }

    abstract apply(unit: any): void
}