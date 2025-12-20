import Func from '../Func'
import Forging from '../Items/Forgings/Forging'
import Item from '../Items/Item'
import Character from '../Objects/src/Character'
import Builder from './Builder'

export default class UpgradeManager {
    static closeForgings(player: Character) {
        player.level.socket.to(player.id).emit('close_forgings')
    }

    static showForgings(player: Character) {
        player.level.socket.to(player.id).emit('show_forgings', {
            items: player.item,
            gold: player.gold,
            can_buy: player.purchased_items < 2,
            stats: player.getStats(),
            triggers: player.getTriggersInfo(),
            carved_sparks: player.carved_sparks,
            grand_forgings: player.grand_forgings
        })
    }

    static addMastery(player: Character, data: object) {
        let mastery = player.masteries.find(elem => elem.name === data.mastery)

        if (!mastery) return

        let abilities = [
            player.first_ability,
            player.second_ability,
            player.third_ability,
            player.utility,
        ]

        let ability = abilities.find(elem => elem.name === data.ability)

        if (!ability) {
            return
        }

        mastery.apply(ability)
        player.masteries = player.masteries.filter(elem => elem != mastery)

        UpgradeManager.closeUpgrades(player)
    }

    static closeSuggest(player: Character) {
        player.level.socket.to(player.id).emit('close_suggest')
    }

    static pickForging(item_id: number, id: number, player: Character) {
        let item = player.item[item_id]

        item.pick(id)
        item.suggested_forgings = []

        UpgradeManager.closeForgings(player)
        UpgradeManager.closeSuggest(player)
    }

    static buyItem(id: number, player: Character) {
        player.gold -= 100

        let item = player.items_to_buy[id]

        item.setPlayer(player)

        player.item.push(item)

        player.items_to_buy = []

        player.purchased_items++

        UpgradeManager.closeForgings(player)
        UpgradeManager.closeSuggest(player)
    }

    static getGrandForging(amount: number, player: Character){
        if(Func.chance(amount)){
            let name = Func.getRandomFromArray(Object.keys(Builder.greatForgingMap))
            let f = Builder.createGreatForging(name, undefined)

            player.grand_forgings.push(f)

            UpgradeManager.closeForgings(player)
        }
    }

    static applyGrandForging(f_name: string, i_name: string, player: Character){
        console.log(f_name, i_name)
        let item = player.item.find(elem => elem.name === i_name)

        if(!item) return

        let f = player.grand_forgings.find(elem => elem.name === f_name)

        if(!f) return

        if(item.forge.length >= item.max_forgings) return

        f.setItem(item)
        f.forge(player)
        
        item.forge.push(f)
        player.grand_forgings = player.grand_forgings.filter(elem => elem != f)
        UpgradeManager.closeForgings(player)
    }

    static forgeItem(data: any, player: Character): void {
        let item = player.item.find(elem => elem.name === data.item_name)

        if (!item) return

        let forging: Forging = item.forge[data.forge]

        if (!forging) return

        forging.forge(player)

        player.level.addSound('forge', player.x, player.y)
        

        UpgradeManager.closeForgings(player)
    }

    static unlockForging(item_name: string, player: Character): void {
        let item = player.item.find(elem => elem.name === item_name)

        if (!item) return

        let cost = item.forge.length * 15 + 15

        if (player.gold < cost) return

        if (item.unlockForgings()) {
            player.level.addSound('gold spending', player.x, player.y)
            player.gold -= cost
        }

        UpgradeManager.createSuggestForge(
            item.suggested_forgings,
            player.item.indexOf(item),
            player
        )
    }

    static createSuggestForge(data: any, item_id: any, player: Character) {
        player.level.socket.to(player.id).emit('suggest_forgings', data, item_id)
    }

    static buyNewItem(player: Character) {
        if (player.gold < 100) return
        if (player.purchased_items >= 2) return

        if (player.items_to_buy.length === 0) {
            for (let i = 0; i < Character.MAX_ITEMS_TO_PURCHASE; i++) {
                let item_name = Item.list[Math.floor(Math.random() * Item.list.length)].name
                let item = Builder.createItem(item_name)

                if (player.item.some(elem => elem.name === item.name)) {
                    i--
                } else {
                    player.items_to_buy.push(item)
                }
            }
        }

        UpgradeManager.createSuggest(player.items_to_buy, player)
    }

    static createSuggest(data: any, player: Character) {
        player.level.socket.to(player.id).emit('suggest_items', data)
    }

    static showUpgrades(player: Character): void {
        player.level.socket.to(player.id).emit('show_upgrades', {
            upgrades: player.upgrades,
            grace: player.grace,
            can_hold: !player.spend_grace,
            ascend: player.ascend_level,
            life: player.life_status,
            free: player.free_upgrade_count,
            stats: player.getStats(),
            masteries: player.masteries,
            triggers: player.getTriggersInfo(),
        })
    }

    static closeUpgrades(player: Character): void {
        player.level.socket.to(player.id).emit('close_upgrades')
    }

    static holdAscend(player: Character): void {
        player.ascend_level -= 1

        player.upgrades = []
        UpgradeManager.closeUpgrades(player)
    }

    static holdGrace(player: Character): void {
        player.can_generate_upgrades = false

        player.grace = Math.round(player.grace * 1.2)
        player.removeUpgrades()
        player.spend_grace = true

        UpgradeManager.closeUpgrades(player)
    }

    static sacrifice(player: Character): void {
        player.spend_grace = true
        player.can_generate_upgrades = false
        player.removeUpgrades()
        let start = player.life_status
        player.takePureDamage(start - 1)

        player.grace += start - player.life_status

        UpgradeManager.closeUpgrades(player)
    }
}
