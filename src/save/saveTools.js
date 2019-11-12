import { getStat } from './localSave';

export const STAT_PREFIX = "stat-";
export const STRATEGY_PREFIX = "strategy-";

const OPTION_KEYS = {
    minimumGainToForceVeto: 'mGTFV',
    minimumDifferenceToForceVeto: 'mDTFV',
    useBetterStarter: 'uBS',
    useVeto1: 'uV1',
    useVeto10: 'uV10',
    playCombos: 'pC',
}

export const keyToOption = optionKey => {
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
    return `${STAT_PREFIX}${numberOfPlayers}-${tactic}-${caracString}`;
}

export const appendStatToSave = (key, stat) => {
    const previousStat = getStat(key);
    let { average, best, worst, ...newStat } = stat;
    if (!previousStat) {
        return { ...newStat, best, worst, date: new Date() };
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
        vetos10Invoked: (previousStat.total.vetos10Invoked || 0) + newStat.total.vetos10Invoked,
        vetos1Invoked: (previousStat.total.vetos1Invoked || 0) + newStat.total.vetos1Invoked,
        vetos10Ignored: (previousStat.total.vetos10Ignored || 0) + newStat.total.vetos10Ignored,
        vetos1Ignored: (previousStat.total.vetos1Ignored || 0) + newStat.total.vetos1Ignored,

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
    return { ...newStat, best: newBest, worst: newWorst, date: new Date() };
}
