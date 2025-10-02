import Level from "../../Level"

export default abstract class GameObject {
    
    name: string = 'object'
    move_speed: number = 0
    box_r: number = 0
    z: number = 0
    light_r: number = 0
    zone_id: number = 0
    id: number | string
    invisible: boolean = false
    phasing: boolean = false

    constructor(public level: Level, public x: number = 0, public y: number = 0){
        this.id = level.getId()
        this.wasChanged()
    }

    abstract act(time: number): void

    wasChanged(){
        this.level.changed_actors.set(this.id, this)
    }

    public isOutOfMap(x: number = this.x, y: number = this.y): boolean{
        if(this.zone_id === 0){
            return x <= 10 || x >= 110 || y <= 20 || y >= 120   
        }
        else if(this.zone_id === 1){
            return x <= 165 || x >= 195 || y <= 40 || y >= 70
        }

        return false
    }

    getBoxElipse(x: number = 0, y: number = 0){
        return {
            x: this.x + x,
            y: this.y + y,
            r: this.box_r
        }
    }

    setZone(zone_id: number, x: number, y: number){
        this.zone_id = zone_id
        this.x = x
        this.y = y

        this.level.socket.to(this.id).emit('change_level', this.zone_id)
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.x = x
        this.y = y
    }

    addToPoint(x: number = 0, y: number = 0): void{
        if(!this.x || !this.y) return
        
        this.x += x
        this.y += y
    }
}