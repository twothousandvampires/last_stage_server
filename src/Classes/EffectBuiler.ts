import Soul from '../Objects/Effects/Soul'
import GameObject from '../Objects/src/GameObject'

export default abstract class EffectBuilder {
    static createGroup(obj: GameObject) {
        let x = obj.x
        let y = obj.y
        let distance = 5
        let count = 5

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones

            let angle = min_a
            let e = new Soul(obj.level)
            e.x = x + Math.sin(angle) * distance
            e.y = y + Math.cos(angle) * distance

            obj.level.addEffect(e)
        }
    }
}
