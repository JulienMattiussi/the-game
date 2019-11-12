import { BEST, WORST } from '../model/strategy';
import {
    STAT_PREFIX, STRATEGY_PREFIX, appendStatToSave, getKeyForStat
} from './saveTools';

const storage = localStorage;

export const saveStat = (stat, reset = false) => {
    const key = getKeyForStat(stat);
    const statToSave = reset ? stat : appendStatToSave(key, stat);
    storage.setItem(key, JSON.stringify(statToSave));
}

export const getStat = key => {
    const stat = storage.getItem(key);
    return stat && stat !== 'undefined' ? JSON.parse(stat) : null;
}

export const getAllStatKeys = () =>
    Object.entries(storage).filter(key => key[0].startsWith(STAT_PREFIX));

export const getStrategy = (nbPlayers, choice) => {
    const strat = storage.getItem(`${STRATEGY_PREFIX}${nbPlayers}-${choice}`);
    return strat && strat !== 'undefined' ? JSON.parse(strat) : null;
}

export const saveStrategy = (strategy, nbPlayers, choice) => {
    storage.setItem(`${STRATEGY_PREFIX}${nbPlayers}-${choice}`, JSON.stringify(strategy));
}

const clearStrategy = (nbPlayers) => {
    storage.removeItem(`${STRATEGY_PREFIX}${nbPlayers}-${BEST}`);
    storage.removeItem(`${STRATEGY_PREFIX}${nbPlayers}-${WORST}`);
}

const clearStatByKey = key => {
    storage.removeItem(key);
}

export const clearStat = stat => {
    clearStatByKey(getKeyForStat(stat));
}

export const clearAllStats = (nbPlayers) => {
    if (!nbPlayers) {
        storage.clear();
        return;
    }
    const statKeys = getAllStatKeys();
    statKeys.map(key => {
        const statKey = key[0];
        const stat = getStat(statKey);
        if (stat && stat.numberOfPlayers === nbPlayers) {
            storage.removeItem(statKey);
        }
        return true;
    });
    clearStrategy(nbPlayers);
}
