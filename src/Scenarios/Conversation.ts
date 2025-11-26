import Func from "../Func";
import Level from "../Level";
import Bonfire from "../Objects/Effects/Bonfire";
import NatureNoLight from "../Objects/Effects/NatureNoLight";
import NatureWithLight from "../Objects/Effects/NatureWithLight";
import SmallTextLanguage1 from "../Objects/Effects/SmallTextLanguage1";
import TextLanguage1 from "../Objects/Effects/TextLanguage1";
import Torch from "../Objects/Effects/Torch";
import Cultist from "../Objects/src/PlayerClasses/Cultist";
import Flyer from "../Objects/src/PlayerClasses/Flyer";
import Swordman from "../Objects/src/PlayerClasses/Swordman";
import Scenario from "./Scenario";

export default class Conversation extends Scenario {

    map: any
    targets: any
    swordman: any
    cultist: any
    flyer: any
    centr_x: number =  60
    centr_y:number = 60
    back: any
    bonfire: any
    bonfire_y: number = this.centr_x + 14

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
            {
            time: 10000,
            action: (level: Level) => {
                    let phrase = new TextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)
        
                    level.effects.push(phrase)
                }
            },
            {
            time: 15000,
            action: (level: Level) => {
                    level.binded_effects = level.binded_effects.filter(elem => elem != this.back)
                    level.deleted.push(this.back.id)

                    this.back = new NatureNoLight(level)
                    this.back.setPoint(this.centr_x, this.centr_y)
                    level.effects.push(this.back)
                    this.bonfire.light_r = 14
                     this.bonfire.act = () => {}
                    this.bonfire.invisible = true
                    this.bonfire.wasChanged()
                   
                  
                }
            },
            
        ]
    }
                     
    start(level: Level){

        this.back = new NatureWithLight(level)
        this.back.setPoint(this.centr_x, this.centr_y)
      
        level.binded_effects.push(this.back)

        this.bonfire = new Bonfire(level)
        this.bonfire.setPoint(this.centr_x, this.bonfire_y)
        level.binded_effects.push(this.bonfire)

        level.players.forEach((elem) => {
            elem.x = this.centr_x
            elem.y = this.centr_x + 14
            elem.flipped = true
            elem.invisible = true
            elem.can_be_controlled_by_player = false
            elem.light_r = 0
        })

        let flyer = new Flyer(level)
        flyer.setPoint(this.centr_x - 5, this.bonfire_y - 5)
        level.players.push(flyer)
        this.flyer = flyer

        let swordman = new Swordman(level)
        swordman.flipped = true
        swordman.setPoint(this.centr_x + 4, this.bonfire_y - 4)
        level.players.push(swordman)
        this.swordman = flyer

        let cultist = new Cultist(level)
        cultist.setPoint(this.centr_x - 5, this.bonfire_y  - 1)
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