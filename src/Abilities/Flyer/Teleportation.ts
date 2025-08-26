import Func from "../../Func";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Teleportation extends FlyerAbility{
    
    state: number
    teleport_x: number | undefined
    teleport_y: number | undefined
    cd: boolean
    protected: boolean
    increased_gate: boolean

    constructor(owner: Flyer){
        super(owner)
       
        this.state = 0
        this.cd = false
        this.name = 'teleportaion'
        this.protected = false
        this.increased_gate = false
    }

    canUse(){
        return !this.cd
    }

    use(){
        if(this.cd) return
        if(!this.owner.pressed.over_x  || !this.owner.pressed.over_y) return

        this.teleport_x = Math.round(this.owner.pressed.over_x + this.owner.x - 40)
        this.teleport_y = Math.round(this.owner.pressed.over_y + this.owner.y - 40)

        if(this.owner.isOutOfMap(this.teleport_x, this.teleport_x)){
            this.teleport_x = undefined
            this.teleport_y = undefined
            return
        }

        this.cd = true
        setTimeout(() => {
            this.cd = false
        }, 20000 - this.owner.getSecondResource() * 1000)

        this.owner.can_move_by_player = false
        this.owner.state = 'teleport start'
        this.owner.level.addSound('cast', this.owner.x, this.owner.y)
        this.owner.stateAct = this.act()

        if(this.protected){
            this.owner.can_be_damaged = false
        }

        this.owner.action_time = this.owner.getCastSpeed()
        
        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.can_move_by_player = true
            this.teleport_x = undefined
            this.teleport_y = undefined
            this.state = 0
            this.owner.can_be_damaged = true
        }
    }

    act(){
        let ability = this
        let owner = this.owner

        return () => {
            if(this.owner.action){
                this.owner.action = false
                
                if(ability.state === 0){
                    owner.x = 666
                    owner.y = 666
                    owner.can_be_damaged = false
                    setTimeout(() => {
                        owner.x = ability.teleport_x
                        owner.y = ability.teleport_y
                        owner.state = 'teleport end'
                        ability.state = 1
                    }, 500)
                }
                else{
                    let box = owner.getBoxElipse()

                    if(ability.increased_gate){
                        box.r += 3
                    }
                    
                    owner.can_be_damaged = true
                    owner.level.enemies.forEach((e) => {
                        if(!e.is_dead && Func.elipseCollision(box, e.getBoxElipse())){
                            e.takeDamage(owner, {
                                explode: true
                            })
                        }
                    })
                    owner.level.players.forEach((p) => {
                        if(p != owner && !p.is_dead && Func.elipseCollision(box, p.getBoxElipse())){
                            p.takeDamage(owner, {
                                explode: true
                            })
                        }
                    })

                    ability.state = 0
                    ability.teleport_x = undefined
                    ability.teleport_y = undefined
                    owner.getState()
                    this.attack_angle = undefined
                }
            }
            
        }
    }
}