export const computeAverage = (stat, numberOfGames) => {

    const average = {
        wonPercent: `${Math.round(stat.total.won / numberOfGames * 10000) / 100} %`,
        remaining: Math.round(stat.total.remaining / numberOfGames * 100) / 100,
        timeWon: stat.total.won ? Math.round(stat.total.timeWon / stat.total.won * 100) / 100 : 0,
        timeLost: Math.round(stat.total.timeLost / (numberOfGames - stat.total.won) * 100) / 100,
    };

    return { ...stat, average };
}
