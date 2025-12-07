export default class EnemyAbility {
    static ability_list = [
        'blind',
        'frost nova',
        'shock nova',
        'despair',
        'summon',
        'fan of bones',
        'curse',
        'evil power',
        'flying mucus',
        'frost bolt',
        'ghost grip',
        'launch bones',
        'soul seekers',
        'soul vortex',
        'sparks',
        'unholy touch',
    ]

    last_used_time = 0
    cooldown = 0

    setCooldown(value) {
        this.cooldown = value
    }
}
