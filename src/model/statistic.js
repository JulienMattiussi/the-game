
import { tactics, defaultOptions } from './player';


const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));
const getRandomBoolean = () => getRandomInt(1) ? true : false;

export const randomParams = () => {
    const tacticsName = Object.keys(tactics);
    const tactic = tacticsName[getRandomInt(tacticsName.length - 1)];

    const criteria = Object.keys(defaultOptions).reduce((options, key) => {
        const option = defaultOptions[key];
        switch (typeof option) {
            case "number":
                return { ...options, [key]: 100 };
            case "boolean":
                return { ...options, [key]: getRandomBoolean() };
            default:
                return { ...options, [key]: defaultOptions[key] };
        }
    }, {});

    return {
        tactic,
        criteria,
    };
}

export const getEmptyStat = (numberOfPlayers, numberOfGames = 0) => ({

    numberOfPlayers,
    numberOfGames,
    best: {
        won: false,
        remaining: 100,
        time: 2000,
        game: {},
    },
    worst: {
        won: true,
        remaining: 0,
        time: 0,
        game: {},
    },
    total: {
        won: 0,
        lost5: 0,
        lost10: 0,
        lostMore: 0,
        remaining: 0,
        timeWon: 0,
        timeLost: 0,
        vetos10Invoked: 0,
        vetos1Invoked: 0,
        vetos10Ignored: 0,
        vetos1Ignored: 0,
    },
    average: {
        wonPercent: 0,
        remaining: 0,
        timeWon: 0,
        timeLost: 0,
        vetos10Invoked: 0,
        vetos1Invoked: 0,
        vetos10Ignored: 0,
        vetos1Ignored: 0,
    },

});

export const computeAverage = (stat, numberOfGames) => {
    if (!stat) {
        return getEmptyStat(4);
    }

    const average = {
        wonPercent: stat.total.won ? Math.round(stat.total.won / numberOfGames * 10000) / 100 : 0,
        remaining: Math.round(stat.total.remaining / numberOfGames * 100) / 100,
        timeWon: stat.total.won ? Math.round(stat.total.timeWon / stat.total.won * 100) / 100 : 0,
        timeLost: (numberOfGames - stat.total.won) ? Math.round(stat.total.timeLost / (numberOfGames - stat.total.won) * 100) / 100 : 0,
        vetos10Invoked: Math.round(stat.total.vetos10Invoked / numberOfGames * 100) / 100,
        vetos1Invoked: Math.round(stat.total.vetos1Invoked / numberOfGames * 100) / 100,
        vetos10Ignored: Math.round(stat.total.vetos10Ignored / numberOfGames * 100) / 100,
        vetos1Ignored: Math.round(stat.total.vetos1Ignored / numberOfGames * 100) / 100,
    };

    return { ...stat, average };
}
