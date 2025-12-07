import IUnitState from '../Interfaces/IUnitState'
import Character from '../Objects/src/Character'

export default class PlayerIdleState implements IUnitState<Character> {
    enter(player: Character) {
        player.state = 'idle'
    }

    update(player: Character) {
        if (player.pressed.l_click && player.can_use_skills && player.first_ability) {
            if (player.first_ability.canUse()) {
                player.useAbility(player.first_ability)
            }
        } else if (player.pressed.r_click && player.can_use_skills) {
            if (player.third_ability && player.third_ability.canUse()) {
                player.useAbility(player.third_ability)
            } else if (player.second_ability && player.second_ability.canUse()) {
                player.useAbility(player.second_ability)
            }
        } else if (player.pressed[69] && player.can_use_skills) {
            if (player.utility && player.utility.canUse()) {
                player.useAbility(player.utility)
            }
        }
    }

    exit(player: Character) {}
}
