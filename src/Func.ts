import GameObject from './Objects/src/GameObject'
import Unit from './Objects/src/Unit'

type Rect = {
    x: number
    y: number
    width: number
    height: number
}

type Elip = {
    x: number
    y: number
    r: number
}

export default class Func {
    public static angle(x: number, y: number, x1: number, y1: number): number {
        if (x === x1 && y === y1) return 0

        let angle = Math.atan((x - x1) / (y - y1))

        if (x1 <= x && y1 <= y) {
            angle += Math.PI
        }
        if (x1 >= x && y1 <= y) {
            angle += Math.PI
        }
        if (x1 <= x && y1 >= y) {
            angle += Math.PI * 2
        }

        return angle
    }

    static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    static distance(one: GameObject, two: GameObject) {
        let a = Func.angle(one.x, one.y, two.x, two.y)

        let l = 1 - Math.abs(0.5 * Math.cos(a))

        return Math.sqrt((one.x - two.x) ** 2 + ((one.y - two.y) / l) ** 2)
    }

    static getRandomFromArray(array: any) {
        return array[Math.floor(Math.random() * array.length)]
    }

    public static elipseCollision(one: Elip, two: Elip) {
        let a1 = one.r
        let b1 = one.r / 2
        let a2 = two.r
        let b2 = two.r / 2

        let maxDistanceX = a1 + a2
        let maxDistanceY = b1 + b2

        if (Math.abs(one.x - two.x) > maxDistanceX || Math.abs(one.y - two.y) > maxDistanceY) {
            return false
        }

        let dx = two.x - one.x
        let dy = two.y - one.y
        let centerDistanceSquared = dx * dx + dy * dy

        if (centerDistanceSquared === 0) {
            return true
        }

        const distance = Math.sqrt(centerDistanceSquared)
        const nx = dx / distance
        const ny = dy / distance

        // "Радиус" каждого эллипса в направлении к другому эллипсу
        const r1 = Math.sqrt((a1 * nx) ** 2 + (b1 * ny) ** 2)
        const r2 = Math.sqrt((a2 * nx) ** 2 + (b2 * ny) ** 2)

        return distance <= r1 + r2
    }
    public static checkAngle(one: GameObject, two: GameObject, angle: number, diff_check: number) {
        let a = Func.angle(one.x, one.y, two.x, two.y)

        let d = Math.abs(a - angle)
        if (d >= 3.24) d = 6.24 - d

        return d <= diff_check / 2
    }
    public static isReactCollision(rect: Rect, rect2: Rect) {
        return (
            rect.y + rect.height > rect2.y &&
            rect.y < rect2.y + rect2.height &&
            rect.x + rect.width > rect2.x &&
            rect.x < rect2.x + rect2.width
        )
    }

    public static pointInRect(x: number, y: number, rect: Rect) {
        return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height
    }

    public static random(min: number = 0, max: number = 100): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    public static chance(chance: number, luck: boolean | undefined = undefined) {
        if (luck) {
            let f = Func.random()
            if (chance > f) return true

            let s = Func.random()
            return chance > s
        } else {
            return chance > Func.random()
        }
    }

    public static notChance(chance: number = 0, luck: boolean | undefined = undefined) {
        if (luck) {
            let f = Func.random()
            if (chance >= f) return false

            let s = Func.random()
            return chance <= s
        } else {
            return chance <= Func.random()
        }
    }
}
