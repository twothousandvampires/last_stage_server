import Character from "../Objects/src/Character";

export default class BlockingTechnique {

    cd: number = 1000
    last_trigger_time: number = 0
    proc_count: number = 0
    trashhold:number = 5
    activated: boolean = false
    blocked: number = 0
    max_blocked: number = 3

    constructor(){
        
    }

    trigger(player: Character){
        if(this.activated){
            this.blocked ++

            if(this.blocked >= this.max_blocked){
                this.activated = false
                player.chance_to_block -= 100
                this.blocked = 0

                player.emitStatusEnd('blocking technique')
            }
        }
        else{
            this.proc_count ++

            if(this.proc_count >= this.trashhold){
                this.proc_count = 0
                player.chance_to_block += 100
                this.activated = true

                player.newStatus({
                    name: 'blocking technique',
                    duration: undefined,
                    desc: 'you will block any hit'
                })
            }
        }
    }
}