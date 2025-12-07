import Character from '../Objects/src/Character'

export default interface ITrigger {
    name: string
    cd: number
    last_trigger_time: number
    chance: number

    getTriggerChance(player: Character | undefined): number
}
