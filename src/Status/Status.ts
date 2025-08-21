import Unit from "../Objects/src/Unit"

export default abstract class Status{

    unit: any
    last_checked: number
    need_to_check_resist: boolean
    name: string | undefined
    power: any
    duration: any

    constructor(public time: number){
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
        if(!this.duration){
            return false
        }
        return tick_time - this.time >= this.duration
    }

    setDuration(duration: number){
        this.duration = duration
    }

    setPower(power: number){
        this.power = power
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