import Unit from '../Objects/src/Unit'

export default interface IUnitState<T extends Unit> {
    enter(unit: T): void
    update(unit: T, time: number): void
    exit(unit: T): void
}
