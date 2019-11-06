import { STAT_PREFIX, getAllStatKeys, getStat, saveStrategy } from './save';

const VALIDITY_LIMIT = 1000;
export const nbPlayers = [3, 4, 5];

export const getNbPlayersFromKey = key =>
    key.startsWith(STAT_PREFIX) ? key.charAt(STAT_PREFIX.length) : 0;


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
                strategy.bestStrategy = { tx, numberOfGames: stat.numberOfGames, tactic: stat.tactic, options: { ...stat.options } }
            }
            if (tx < strategy.worstStrategy.tx) {
                strategy.worstStrategy = { tx, numberOfGames: stat.numberOfGames, tactic: stat.tactic, options: { ...stat.options } }
            }
        }

        return true;
    });

    Object.keys(playersStrategies).map(key => {
        const playersStrategy = playersStrategies[key];
        saveStrategy(playersStrategy.bestStrategy, key, 'best');
        saveStrategy(playersStrategy.worstStrategy, key, 'worst');

        return true;
    });


}
