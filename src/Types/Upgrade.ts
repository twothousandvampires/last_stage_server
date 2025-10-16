import Character from "../Objects/src/Character"

type Upgrade = {
    name: string,
    type?: string,
    canUse: (character: Character) => boolean,
    teach: (character: Character) => void,
    cost: number,
    ascend?: number,
    desc: string
}

export default Upgrade