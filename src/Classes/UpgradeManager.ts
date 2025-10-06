import Forging from "../Items/Forgings/Forging";
import Item from "../Items/Item";
import Character from "../Objects/src/Character";
import Builder from "./Builder";

export default class UpgradeManager {

    static closeForgings(player: Character){
        player.level.socket.to(player.id).emit('close_forgings')
    }

    static showForgings(player: Character){
        player.level.socket.to(player.id).emit('show_forgings', {
            items: player.item,
            gold: player.gold,
            can_buy: player.purchased_items < 2
        })
    }

    static  closeSuggest(player: Character){
        player.level.socket.to(player.id).emit('close_suggest')
    }

    static pickForging(item_id: number, id: number, player: Character){
        let item = player.item[item_id]

        item.pick(id)
        item.suggested_forgings = []

        UpgradeManager.closeForgings(player)
        UpgradeManager.closeSuggest(player)
    }

    static  buyItem(id: number, player: Character){
        player.gold -= 30

        let item = player.items_to_buy[id]

        item.setPlayer(player)
        
        player.item.push(item)

        player.items_to_buy = []

        player.purchased_items ++

        UpgradeManager.closeForgings(player)
        UpgradeManager.closeSuggest(player)
    }

    static forgeItem(data: any, player: Character): void{
        let item = player.item.find(elem => elem.name === data.item_name)

        if(!item) return

        let forging: Forging = item.forge[data.forge]

        if(!forging) return

        forging.forge(player)

        player.level.addSound('gold spending', player.x, player.y)

        UpgradeManager.closeForgings(player)
    }

    static unlockForging(item_name: string, player: Character): void{
        let item = player.item.find(elem => elem.name === item_name)

        if(!item) return

        let cost = (item.forge.length * 5) + 5

        if(player.gold < cost) return

        if(item.unlockForgings()){
            player.level.addSound('gold spending', player.x, player.y)
            player.gold -= cost
        }
          
        UpgradeManager.createSuggestForge(item.suggested_forgings, player.item.indexOf(item), player)
    }

    static createSuggestForge(data: any, item_id: any, player: Character){
        player.level.socket.to(player.id).emit('suggest_forgings', data , item_id)
    }

    static buyNewItem(player: Character){
        if(player.gold < 30) return
        if(player.purchased_items >= 2) return

        if(player.items_to_buy.length === 0){
            for(let i = 0; i < Character.MAX_ITEMS_TO_PURCHASE; i++){
                let item_name = Item.list[Math.floor(Math.random() * Item.list.length)].name
                let item = Builder.createItem(item_name)

                if(player.item.some(elem => elem.name === item.name)){
                    i--
                }
                else{
                    player.items_to_buy.push(item)
                }
            }
        }

        UpgradeManager.createSuggest(player.items_to_buy, player)
    }
    
    static createSuggest(data: any, player: Character){
        player.level.socket.to(player.id).emit('suggest_items', data)
    }

    static showUpgrades(player: Character): void{
        player.level.socket.to(player.id).emit('show_upgrades', {
            upgrades: player.upgrades,
            grace: player.grace,
            can_hold: !player.spend_grace
        })
    }

    static closeUpgrades(player: Character): void{
        player.level.socket.to(player.id).emit('close_upgrades')
    }

    static holdGrace(player: Character): void{
        player.can_generate_upgrades = false
        player.grace += 4

        UpgradeManager.closeUpgrades(player)
    }
}