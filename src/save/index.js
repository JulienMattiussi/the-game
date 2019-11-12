import {
    saveStat,
    getStat,
    getAllStatKeys,
    clearStat,
    clearAllStats,
    saveStrategy,
    getStrategy
} from './localSave';
import { STAT_PREFIX, STRATEGY_PREFIX, keyToOption, getKeyForStat } from './saveTools';


const saveStats = (stats, reset = false) => {
    Object.keys(stats).map(key => saveStat(stats[key], reset));
}

export {
    STAT_PREFIX,
    STRATEGY_PREFIX,
    keyToOption,
    getKeyForStat,
    saveStats,
    clearStat,
    clearAllStats,
    getStat,
    getAllStatKeys,
    saveStrategy,
    getStrategy,
}
