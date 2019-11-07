import { STAT_PREFIX, getAllStatKeys, getStat, getStrategy, saveStrategy } from './save';

const VALIDITY_LIMIT = 1000;
export const BEST = 'best';
export const WORST = 'worst';
export const nbPlayers = [3, 4, 5];

export const getNbPlayersFromKey = key =>
    key.startsWith(STAT_PREFIX) ? key.charAt(STAT_PREFIX.length) : 0;


const buildStrategy = (statKey, stat, tx) => (
    { tx, statKey, numberOfGames: stat.numberOfGames, tactic: stat.tactic, options: { ...stat.options } }
);

const setStrategyDate = (strategy, nbPlayers, choice, newDate) => {
    const previousStrategy = getStrategy(nbPlayers, choice);
    if (previousStrategy.statKey !== strategy.statKey) {
        return ({ ...strategy, date: newDate });
    }
    return { ...strategy, date: previousStrategy.date || newDate };
}

export const computeStrategies = () => {
    const statKeys = getAllStatKeys();

    const bestStrategy = { tx: 0 };
    const worstStrategy = { tx: 100 };


    let playersStrategies = nbPlayers.reduce((all, number) => ({
        ...all,
        [number]: {
            bestStrategy: { ...bestStrategy },
            worstStrategy: { ...worstStrategy },
        }
    }), {});

    statKeys.map(key => {
        const statKey = key[0];
        const stat = getStat(statKey);
        if (stat && stat.numberOfGames >= VALIDITY_LIMIT) {
            const tx = stat.total.won / stat.numberOfGames * 100;
            let strategy = playersStrategies[getNbPlayersFromKey(statKey)];
            if (tx > strategy.bestStrategy.tx) {
                strategy.bestStrategy = buildStrategy(statKey, stat, tx);
            }
            if (tx < strategy.worstStrategy.tx) {
                strategy.worstStrategy = buildStrategy(statKey, stat, tx);
            }
        }

        return true;
    });

    const newDate = new Date();

    Object.keys(playersStrategies).map(key => {
        const playersStrategy = playersStrategies[key];
        saveStrategy(setStrategyDate(playersStrategy.bestStrategy, key, BEST, newDate), key, BEST);
        saveStrategy(setStrategyDate(playersStrategy.worstStrategy, key, BEST, newDate), key, WORST);

        return true;
    });


}
