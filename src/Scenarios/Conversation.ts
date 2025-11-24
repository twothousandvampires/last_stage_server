import Func from "../Func";
import Level from "../Level";
import Bonfire from "../Objects/Effects/Bonfire";
import SmallTextLanguage1 from "../Objects/Effects/SmallTextLanguage1";
import Torch from "../Objects/Effects/Torch";
import Cultist from "../Objects/src/PlayerClasses/Cultist";
import Flyer from "../Objects/src/PlayerClasses/Flyer";
import Scenario from "./Scenario";

export default class Conversation extends Scenario {

    map: any
    targets: any
    swordman: any
    cultist: any
    flyer: any

    constructor(){
        super()
        this.targets = []
        this.map = [{
            time: 2000,
            action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)
        
                    level.effects.push(phrase)
                }
            },
            {
            time: 3600,
            action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)
        
                    level.effects.push(phrase)
                }
            },
            {
            time: 5000,
            action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.flyer.x, this.flyer.y)
        
                    level.effects.push(phrase)
                }
            },
            {
            time: 8000,
            action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)
        
                    level.effects.push(phrase)
                }
            },
        ]
    }
                     
    start(level: Level){

        let bonfire = new Bonfire(level)
        bonfire.setPoint(43, 50)

        level.binded_effects.push(bonfire)

        let torch = new Torch(level)
        torch.setPoint(55, 50)

        level.binded_effects.push(torch)

        level.players.forEach((elem) => {
            elem.x = 48
            elem.y = 56
            elem.flipped = true
            elem.light_r = 8
            this.swordman = elem
        })



        let flyer = new Flyer(level)
        flyer.setPoint(36, 50)
        level.players.push(flyer)
        this.flyer = flyer

        let cultist = new Cultist(level)
        cultist.setPoint(38, 60)
        level.players.push(cultist)
        this.cultist = cultist
    }

    checkTime(level: Level){
        let time_elapsed = level.time - level.started
        let next_action = this.map[0]

        if(next_action && next_action.time <= time_elapsed){
            next_action.action(level)
            this.map.shift()
        }
    }
}