
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
    },
    average: {
        wonPercent: '0 %',
        remaining: 0,
        timeWon: 0,
        timeLost: 0,
    },

});

export const computeAverage = (stat, numberOfGames) => {
    if (!stat) {
        return getEmptyStat(4);
    }

    const average = {
        wonPercent: `${Math.round(stat.total.won / numberOfGames * 10000) / 100} %`,
        remaining: Math.round(stat.total.remaining / numberOfGames * 100) / 100,
        timeWon: stat.total.won ? Math.round(stat.total.timeWon / stat.total.won * 100) / 100 : 0,
        timeLost: Math.round(stat.total.timeLost / (numberOfGames - stat.total.won) * 100) / 100,
    };

    return { ...stat, average };
}
