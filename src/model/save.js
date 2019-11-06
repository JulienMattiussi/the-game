const OPTION_KEYS = {
    minimumGainToForceVeto: 'mGTFV',
    useBetterStarter: 'uBS',
    useVeto1: 'uV1',
    useVeto10: 'uV10'
}

const keyToOption = optionKey => {
    const keys = Object.keys(OPTION_KEYS);
    const keysObject = keys.reduce((list, key) => ({ ...list, [OPTION_KEYS[key]]: key }), {});
    return keysObject[optionKey];
}

export const getKeyForStat = ({ numberOfPlayers, tactic, options }) => {
    const allCaracteristics = Object.keys(options);
    let trueCaracteristics = allCaracteristics.filter(carac => options[carac]);
    trueCaracteristics.sort();
    const caracString = trueCaracteristics.map(carac => {
        const key = OPTION_KEYS[carac];
        if (typeof options[carac] !== 'boolean') {
            return `${key}:${JSON.stringify(options[carac])}`;
        }
        return key;
    }).join('-');
    return `stat-${numberOfPlayers}-${tactic}-${caracString}`;
}

export const saveStats = (stats, reset = false) => {
    Object.keys(stats).map(key => saveStat(stats[key], reset));
}

const appendStatToSave = (key, stat) => {
    const previousStat = getStat(key);
    let { average, best, worst, ...newStat } = stat;
    if (!previousStat) {
        return { ...newStat, best, worst };
    }
    newStat.numberOfGames += previousStat.numberOfGames;
    let newBest = previousStat.best;
    let newWorst = previousStat.worst;
    newStat.total = {
        lost5: previousStat.total.lost5 + newStat.total.lost5,
        lost10: previousStat.total.lost10 + newStat.total.lost10,
        lostMore: previousStat.total.lostMore + newStat.total.lostMore,
        remaining: previousStat.total.remaining + newStat.total.remaining,
        timeLost: previousStat.total.timeLost + newStat.total.timeLost,
        timeWon: previousStat.total.timeWon + newStat.total.timeWon,
        won: previousStat.total.won + newStat.total.won,
    }
    if ((newBest.won && best.won && best.time < newBest.time)
        ||
        best.remaining < newBest.remaining
    ) {
        newBest = best;
    }
    if (
        worst.remaining > newWorst.remaining ||
        (worst.remaining === newWorst.remaining && newWorst.time > worst.time)
    ) {
        newWorst = worst;
    }
    return { ...newStat, best: newBest, worst: newWorst };
}

const saveStat = (stat, reset = false) => {
    const key = getKeyForStat(stat);
    const statToSave = reset ? stat : appendStatToSave(key, stat);
    localStorage.setItem(key, JSON.stringify(statToSave));
}

export const getStat = key => {
    const stat = localStorage.getItem(key);
    return stat && stat !== 'undefined' ? JSON.parse(stat) : null;
}

export const clearStat = stat => {
    clearStatByKey(getKeyForStat(stat));
}

export const clearStatByKey = key => {
    localStorage.removeItem(key);
}

export const clearAllStats = () => {
    localStorage.clear();
}