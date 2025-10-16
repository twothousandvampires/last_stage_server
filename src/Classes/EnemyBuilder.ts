import BlindAbility from "../EnemyAbilities.ts/BlindAbility";
import CurseOfDamnedAbility from "../EnemyAbilities.ts/CurseOfDamnedAbility";
import DespairAbility from "../EnemyAbilities.ts/DespairAbility";
import EnemyAbility from "../EnemyAbilities.ts/EnemyAbility";
import EnemyFrostNova from "../EnemyAbilities.ts/EnemyFrostNova";
import EnemySparks from "../EnemyAbilities.ts/EnemySparks";
import EnemyStormNova from "../EnemyAbilities.ts/EnemyStormNova";
import EvilPowerAbility from "../EnemyAbilities.ts/EvilPowerAbility";
import FanOfBonesAbility from "../EnemyAbilities.ts/FanOfBonesAbility";
import FlyingMucusAbility from "../EnemyAbilities.ts/FlyingMucusAbility";
import FrostBoltAbility from "../EnemyAbilities.ts/FrostBoltAbility";
import GhostGripAbility from "../EnemyAbilities.ts/GhostGripAbility";
import SoulSeekers from "../EnemyAbilities.ts/SoulSeekers";
import SoulVortex from "../EnemyAbilities.ts/SoulVortex";
import Summon from "../EnemyAbilities.ts/Summon";
import UnholyTouch from "../EnemyAbilities.ts/UnholyTouch";
import Level from "../Level";
import Skull from "../Objects/src/Enemy/Skull";

export default class EnemyBuilder{
    static createEnemy(enemy_name: string, level: Level){
        if(enemy_name === 'skull'){
            return new Skull(level)
        }

        else{
            return new Skull(level)
        }
    }

    static getRanromEnemyAbility(cd = 0){
        let name = EnemyAbility.ability_list[Math.floor(Math.random() * EnemyAbility.ability_list.length)]

        let abilty = undefined

        if(name === 'blind'){
            abilty = new BlindAbility()
        }
        else if(name === 'frost nova'){
            abilty = new EnemyFrostNova()
        }
        else if(name === 'shock nova'){
            abilty = new EnemyStormNova()
        }
        else if(name === 'despair'){
            abilty = new DespairAbility()
        }
        else if(name === 'summon'){
            abilty = new Summon()
        }
        else if(name === 'fan of bones'){
            abilty = new FanOfBonesAbility()
        }
        else if(name === 'curse'){
            abilty = new CurseOfDamnedAbility()
        }
        else if(name === 'evil power'){
            abilty = new EvilPowerAbility()
        }
        else if(name === 'flying mucus'){
            abilty = new FlyingMucusAbility()
        }
        else if(name === 'frost bolt'){
            abilty = new FrostBoltAbility()
        }
        else if(name === 'ghost grip'){
            abilty = new GhostGripAbility()
        }
        else if(name === 'soul seekers'){
            abilty = new SoulSeekers()
        }
        else if(name === 'soul vortex'){
            abilty = new SoulVortex()
        }
        else if(name === 'sparks'){
            abilty = new EnemySparks()
        }
        else if(name === 'unholy touch'){
            abilty = new UnholyTouch()
        }
        else{
            abilty = new GhostGripAbility()
        }

        if(cd != 0){
            abilty.setCooldown(cd)
        }

        return abilty
    }
}