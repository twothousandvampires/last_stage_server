import Builder from "../../Classes/Builder";
import Func from "../../Func";
import Item from "../../Items/Item";
import Level from "../../Level";
import Effect from "./Effects";

export default class ItemDrop extends Effect{
    time: number
    
    constructor(level: Level){
        super(level)
        this.name = 'item drop'
        this.box_r = 3.2
        this.time = Date.now()
    }

    act(time: number){
        if(time - this.time >= 10000){
            this.level.deleted.push(this.id)
            this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            return
        }

        this.level.players.forEach(elem => {
            if(elem.item.length < 6 && Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())){
                
                for(let i = 0; i < 1; i++){
                    let item_name = Item.list[Math.floor(Math.random() * Item.list.length)].name
                    let item = Builder.createItem(item_name)
    
                    if(elem.item.some(elem => elem.name === item.name)){
                        i--
                    }
                    else{
                        item.setPlayer(elem)
                        elem.item.push(item)
                    }
                }

                this.level.deleted.push(this.id)
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            }
        })
    }

}