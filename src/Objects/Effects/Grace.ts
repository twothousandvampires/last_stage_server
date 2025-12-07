import UpgradeManager from '../../Classes/UpgradeManager'
import Func from '../../Func'
import Level from '../../Level'
import TimeStoped from '../../Status/TimeStoped'
import Character from '../src/Character'
import Effect from './Effects'
import Forger from './Forger'
import Gate from './Gate'
import Star from './Star'
import Teacher from './Teacher'

export default class Grace extends Effect {
    time: number
    gatedPlayers: any
    not_deserving: any
    leaved: any

    constructor(
        level: Level,
        private duration = 60000
    ) {
        super(level)
        this.name = 'grace'
        this.time = Date.now()
        this.box_r = 4
        this.gatedPlayers = []
        this.leaved = []
        this.not_deserving = []
    }

    act(time: number) {
        if (time - this.time >= this.duration) {
            this.closeGate()
            return
        }

        this.level.players.forEach(elem => {
            if (
                !this.leaved.includes(elem.id) &&
                Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())
            ) {
                if (elem.grace <= 0 && !this.not_deserving.includes(elem.id)) {
                    this.level.addSound('not deserving', elem.x, elem.y)
                    this.not_deserving.push(elem.id)
                } else if (elem.grace > 0) {
                    if (this.gatedPlayers.length === 0) {
                        this.generateEffects()
                    }
                    this.gatedPlayers.push({
                        x: elem.x,
                        y: elem.y,
                        player: elem,
                    })

                    let status = new TimeStoped(elem.time)
                    status.setDuration(60000)

                    this.level.setStatus(elem, status)

                    elem.setZone(1, 180, 60)
                    elem.light_r = 32
                }
            }
        })
    }

    deleteStatus(player: Character) {
        for (let i = 0; i < this.level.status_pull.length; i++) {
            let s = this.level.status_pull[i]

            if (s.unit === player && s.name === 'time stoped') {
                s.clear()
                this.level.status_pull.splice(i, 1)
                break
            }
        }
    }

    playerLeave(player: Character) {
        let player_data = this.gatedPlayers.find(elem => elem.player.id === player.id)

        if (!player_data) return

        player.light_r = 16
        player.removeUpgrades()
        UpgradeManager.closeUpgrades(player)
        player.setZone(0, player_data.x, player_data.y)
        player.can_generate_upgrades = true
        player.spend_grace = false

        this.gatedPlayers = this.gatedPlayers.filter(elem => elem.player.id != player.id)
        this.leaved.push(player.id)

        this.deleteStatus(player)

        player.after_grace_statuses.forEach(status => {
            this.level.setStatus(player, status, true)
        })

        player.after_grace_statuses = []

        if (this.gatedPlayers.length === 0) {
            this.deleteEffects()
        }
    }

    closeGate() {
        this.gatedPlayers.forEach(player_data => {
            if (!this.leaved.includes(player_data.player.id)) {
                player_data.player.light_r = 16
                player_data.player.removeUpgrades()
                UpgradeManager.closeUpgrades(player_data.player)
                player_data.player.setZone(0, player_data.x, player_data.y)
                player_data.player.can_generate_upgrades = true
                player_data.player.spend_grace = false

                this.deleteStatus(player_data.player)

                player_data.player.after_grace_statuses.forEach(status => {
                    this.level.setStatus(player_data.player, status, true)
                })
                player_data.player.after_grace_statuses = []
            }
        })

        this.deleteEffects()
    }

    generateEffects() {
        let teacher = new Teacher(this.level)
        this.level.binded_effects.push(teacher)

        let forger = new Forger(this.level)
        this.level.binded_effects.push(forger)

        let exit = new Gate(this.level)
        this.level.binded_effects.push(exit)

        let stars_count = 60
        let centr_x = 180
        let centr_y = 60

        for (let i = 0; i < stars_count; i++) {
            let angle = Math.random() * 6.28

            let star = new Star(this.level)
            star.setZone(
                1,
                Math.round(centr_x + Math.sin(angle) * Func.random(12, 80)),
                Math.round(centr_y + Math.cos(angle) * Func.random(12, 80))
            )

            this.level.binded_effects.push(star)
        }
    }

    deleteEffects() {
        let to_delete = this.level.binded_effects.filter(elem => elem.zone_id === 1)

        to_delete.forEach(elem => {
            this.level.deleted.push(elem.id)
        })

        this.level.binded_effects = this.level.binded_effects.filter(elem => elem.zone_id != 1)

        this.level.deleted.push(this.id)
        this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
    }
}
