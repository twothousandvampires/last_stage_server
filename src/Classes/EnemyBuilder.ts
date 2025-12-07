import BlindAbility from '../EnemyAbilities/BlindAbility'
import CurseOfDamnedAbility from '../EnemyAbilities/CurseOfDamnedAbility'
import DespairAbility from '../EnemyAbilities/DespairAbility'
import EnemyAbility from '../EnemyAbilities/EnemyAbility'
import EnemyFrostNova from '../EnemyAbilities/EnemyFrostNova'
import EnemySparks from '../EnemyAbilities/EnemySparks'
import EnemyStormNova from '../EnemyAbilities/EnemyStormNova'
import EvilPowerAbility from '../EnemyAbilities/EvilPowerAbility'
import FanOfBonesAbility from '../EnemyAbilities/FanOfBonesAbility'
import FlyingMucusAbility from '../EnemyAbilities/FlyingMucusAbility'
import FrostBoltAbility from '../EnemyAbilities/FrostBoltAbility'
import GhostGripAbility from '../EnemyAbilities/GhostGripAbility'
import SoulSeekers from '../EnemyAbilities/SoulSeekers'
import SoulVortex from '../EnemyAbilities/SoulVortex'
import Summon from '../EnemyAbilities/Summon'
import UnholyTouch from '../EnemyAbilities/UnholyTouch'
import Level from '../Level'
import Skull from '../Objects/src/Enemy/Skull'

export default class EnemyBuilder {
    static createEnemy(enemy_name: string, level: Level) {
        if (enemy_name === 'skull') {
            return new Skull(level)
        } else {
            return new Skull(level)
        }
    }

    static getRanromEnemyAbility(cd = 0) {
        let name =
            EnemyAbility.ability_list[Math.floor(Math.random() * EnemyAbility.ability_list.length)]

        let abilty = undefined

        if (name === 'blind') {
            abilty = new BlindAbility()
        } else if (name === 'frost nova') {
            abilty = new EnemyFrostNova()
        } else if (name === 'shock nova') {
            abilty = new EnemyStormNova()
        } else if (name === 'despair') {
            abilty = new DespairAbility()
        } else if (name === 'summon') {
            abilty = new Summon()
        } else if (name === 'fan of bones') {
            abilty = new FanOfBonesAbility()
        } else if (name === 'curse') {
            abilty = new CurseOfDamnedAbility()
        } else if (name === 'evil power') {
            abilty = new EvilPowerAbility()
        } else if (name === 'flying mucus') {
            abilty = new FlyingMucusAbility()
        } else if (name === 'frost bolt') {
            abilty = new FrostBoltAbility()
        } else if (name === 'ghost grip') {
            abilty = new GhostGripAbility()
        } else if (name === 'soul seekers') {
            abilty = new SoulSeekers()
        } else if (name === 'soul vortex') {
            abilty = new SoulVortex()
        } else if (name === 'sparks') {
            abilty = new EnemySparks()
        } else if (name === 'unholy touch') {
            abilty = new UnholyTouch()
        } else {
            abilty = new GhostGripAbility()
        }

        if (cd != 0) {
            abilty.setCooldown(cd)
        }

        return abilty
    }
}
