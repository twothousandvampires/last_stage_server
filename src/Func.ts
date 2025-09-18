import GameObject from "./Objects/src/GameObject"
import Unit from "./Objects/src/Unit"

type Rect ={
    x: number
    y: number
    width: number
    height: number
}

type Elip = {
    x: number,
    y: number,
    r: number
}

export default class Func{

    public static angle(x: number, y: number, x1: number, y1: number): number{
        let angle = Math.atan( (x - x1) / (y - y1) )
       
        if(x1 <= x && y1 <= y){
            angle += Math.PI
        }
        if(x1 >= x && y1 <= y){
            angle += Math.PI
        }
        if(x1 <= x && y1 >= y){
            angle += Math.PI*2
        }

        return angle
    }

    static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static distance(one: GameObject, two: GameObject){
        let a = Func.angle(one.x, one.y, two.x, two.y)

        let l = 1 - Math.abs(0.5 * Math.cos(a))

        return Math.sqrt(((one.x - two.x) ** 2) + ((one.y - two.y) ** 2)) * l
    }

    public static elipseCollision(el: Elip, el2: Elip){

        let unit_angle = Func.angle(el.x, el.y, el2.x, el2.y)
        let unit1_angle = Func.angle(el2.x, el2.y, el.x, el.y)

        let angle = Math.atan2((el.r / 2) * Math.cos(unit_angle), el.r * Math.sin(unit_angle))

        let d = Math.cos(angle) * el.r + el.x
        let d2 = Math.sin(angle) * (el.r / 2) + el.y
       
        let res = (d - el2.x) ** 2 / el2.r ** 2 + (d2 - el2.y) ** 2 / (el2.r / 2) ** 2 <= 1

        if(res){
            return res
        }

        angle = Math.atan2((el2.r / 2) * Math.cos(unit1_angle), el2.r * Math.sin(unit1_angle))

        d = Math.cos(angle) * el2.r + el2.x
        d2 = Math.sin(angle) * (el2.r / 2) + el2.y
       
        res = (d - el.x) ** 2 / el.r ** 2 + (d2 - el.y) ** 2 / (el.r / 2) ** 2 <= 1

        if(res){
            return res
        }

        if(el.x === el2.x && el.y === el2.y){
            return true
        }

        return false
    }
    public static checkAngle(one: GameObject, two: GameObject, angle: number, diff_check: number){
       
        let a = Func.angle(one.x, one.y, two.x, two.y)

        let d = Math.abs(a - angle)
        if(d >= 3.24) d = 6.24 - d
        
        return d <= diff_check / 2
    }
    public static isReactCollision(rect: Rect, rect2: Rect){
        return (rect.y + rect.height > rect2.y) && (rect.y  < rect2.y + rect2.height) &&
               (rect.x + rect.width > rect2.x) && (rect.x < rect2.x + rect2.width)
    }

    public static pointInRect(x: number, y: number, rect: Rect){
        return (x > rect.x
            && x < rect.x + rect.width
            && y > rect.y
            && y < rect.y + rect.height)
    }

    public static random(min: number = 0, max: number = 100): number{
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static chance(chance: number, luck: boolean | undefined  = undefined){
        if(luck){
            let f = Func.random()
            if(chance >= f) return true

            let s = Func.random()
            return chance >= s
        }
        else{
            return chance >= Func.random()
        }
    }

    public static notChance(chance: number = 0, luck: boolean | undefined = undefined){
        if(luck){
            let f = Func.random()
            if(chance >= f) return false

            let s = Func.random()
            return chance <= s
        }
        else{
            return chance < Func.random()
        }
    }
}