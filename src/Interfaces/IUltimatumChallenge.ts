export default interface IUltimatumChallenge {
    activated: boolean
    activated_players: string | number[]
    failed: boolean
    challenge_radius: number
    effect: any
    timer: number

    success(): void

    fail(): void

    activate(): void
}
