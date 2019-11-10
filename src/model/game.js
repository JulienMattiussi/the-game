import { setBetterStarter, setVeto } from './player';
import { computeAverage, getEmptyStat } from './statistic';

export const NB_CARDS_IN_HAND = 6;

export const WON = 'won';
export const LOST = 'lost';

export const HISTORY_MOVE = 'move';
export const HISTORY_VETO = 'veto';

export const goesUpOne = 'goesUpOne';
export const goesUpTwo = 'goesUpTwo';
export const goesDownOne = 'goesDownOne';
export const goesDownTwo = 'goesDownTwo';

const createCards = () => {
    let pile = [];
    for (let i = 2; i <= 99; i++) {
        pile.push(i);
    }
    return pile;
}

const randomizeCards = (cards) => {
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = cards[i];
        cards[i] = cards[j];
        cards[j] = tmp;
    }
    return cards;
}

export const initGame = (nbPlayers = 4) => {
    let cards = randomizeCards(createCards());
    let players = new Array(nbPlayers);
    for (let player = 0; player < nbPlayers; player++) {
        players[player] = [];
    }
    for (let i = 0; i < NB_CARDS_IN_HAND; i++) {
        for (let player = 0; player < nbPlayers; player++) {
            players[player].push(cards[0]);
            players[player].sort((ca, cb) => ca - cb);
            cards.shift();
        }
    }
    return {
        goesUpOne: [1],
        goesUpTwo: [1],
        goesDownOne: [100],
        goesDownTwo: [100],
        turn: 0,
        vetos: [],
        players,
        cards,
        history: [],
        turnsNumber: 0,
        vetosAnalysis: {
            vetos10Invoked: 0,
            vetos1Invoked: 0,
            vetos10Ignored: 0,
            vetos1Ignored: 0,
        },
    }
}

export const loadGame = (
    cards,
    players,
    middle = {
        goesUpOne: [1],
        goesUpTwo: [1],
        goesDownOne: [100],
        goesDownTwo: [100],
    },
    turn = 0,
) => {
    const sortedPlayers = [...players].map(player => player.sort((ca, cb) => ca - cb));
    return ({
        goesUpOne: middle.goesUpOne,
        goesUpTwo: middle.goesUpTwo,
        goesDownOne: middle.goesDownOne,
        goesDownTwo: middle.goesDownTwo,
        turn,
        vetos: [],
        players: sortedPlayers,
        cards: [...cards],
        history: [],
        turnsNumber: 0,
        vetosAnalysis: {
            vetos10Invoked: 0,
            vetos1Invoked: 0,
            vetos10Ignored: 0,
            vetos1Ignored: 0,
        },
    })
}

export const cloneGame = game => {
    const players = [...game.players];
    const newGame = {
        goesUpOne: [...game.goesUpOne],
        goesUpTwo: [...game.goesUpTwo],
        goesDownOne: [...game.goesDownOne],
        goesDownTwo: [...game.goesDownTwo],
        turn: game.turn,
        players: players.map(player => [...player]),
        cards: [...game.cards],
        lost: game.lost,
        vetos: game.vetos,
        won: game.won,
        history: game.history,
        turnsNumber: game.turnsNumber,
        vetosAnalysis: { ...game.vetosAnalysis },
        statsMode: game.statsMode,
    }

    return newGame;
}

export const appendToHistory = (game, event, notPlayer) => {
    if (!game.statsMode) {
        if (event.type === HISTORY_MOVE) {
            const movesList = game.history.filter(row => row.type === HISTORY_MOVE);
            if (!movesList.length || movesList[0].player !== event.player) {
                game.turnsNumber += 1;
            }
        }
        if (notPlayer != null) {
            game.history = game.history.filter((row, index) => index < 8);
        }
        game.history.unshift(event);
    }
    return game;
};

export const move = (game, card, position, options = {}) => {
    const { useVeto10, useVeto1 } = options;
    const newGame = cloneGame(game);
    const player = newGame.players[newGame.turn];
    const index = player.findIndex(c => c === card);
    player.splice(index, 1);

    newGame[position].unshift(card);
    appendToHistory(
        newGame,
        {
            player: newGame.turn,
            type: HISTORY_MOVE,
            value: card, previous: newGame[position][1],
            position: position
        },
        options.notPlayer,
    );

    if (useVeto10 || useVeto1) {
        return setVeto(newGame, useVeto10, useVeto1);
    }

    return newGame;
}

export const reload = (game) => {
    const newGame = cloneGame(game);
    for (let i = newGame.players[newGame.turn].length; i < NB_CARDS_IN_HAND; i++) {
        if (newGame.cards.length) {
            newGame.players[newGame.turn].push(newGame.cards[0])
            newGame.players[newGame.turn].sort((ca, cb) => ca - cb);
            newGame.cards.shift();
        }
        else {
            break;
        }
    }
    return newGame;
}

export const getMinimalMoveNumber = cards => cards.length ? 2 : 1;

export const changeTurn = (game, options = {}) => {
    const { useVeto10, useVeto1 } = options;
    const newGame = cloneGame(game);
    newGame.turn = newGame.turn === game.players.length - 1 ? 0 : newGame.turn + 1;

    if (useVeto10 || useVeto1) {
        return setVeto(newGame, useVeto10, useVeto1);
    }
    return newGame;
}

export const playATurn = (
    game,
    tactic,
    options = { minimumGainToForceVeto: 100, useBetterStarter: false, useVeto10: false, useVeto1: false }
) => {
    const newGame = reload(tactic(game, options));

    if (isGameWon(newGame)) {
        newGame.won = true;
    }
    return changeTurn(newGame, options);
}

export const isPlayable = (game) => game && !game.lost && !game.won;

export const isGameWon = game => {
    if (!game.cards.length) {
        return game.players.reduce((total, player) => {
            if (player.length)
                return total;
            return total - 1
        }, game.players.length) === 0
    }
    return false;
}

export const getRemainingCards = game =>
    game.players.reduce((total, player) => total + player.length, 0) + game.cards.length;

export const playFullGame = (
    game,
    tactic,
    options = { minimumGainToForceVeto: 100, useBetterStarter: false, useVeto10: false, useVeto1: false, notPlayer: -1 }
) => {
    let newGame = cloneGame(game);
    let security = 0;
    while (true) {
        security++;
        newGame = playATurn(newGame, tactic, options)
        if (newGame.lost) {
            break;
        }
        if (newGame.won) {
            break;
        }
        if (options.notPlayer === newGame.turn) {
            break;
        }
        if (security >= 1000) {
            console.log('Bug', newGame);
            break;
        }
    }
    newGame.time = security;
    return newGame;
}


export const playManyGames = (
    tactic,
    options = { minimumGainToForceVeto: 100, useBetterStarter: false, useVeto10: false, useVeto1: false },
    numberOfPlayers = 4,
    numberOfGames = 1000
) => {
    const stats = getEmptyStat(numberOfPlayers, numberOfGames);
    for (let i = 0; i < numberOfGames; i++) {
        let game = initGame(numberOfPlayers);
        game.statsMode = true;
        if (options.useBetterStarter) {
            game = setBetterStarter(game);
        }
        const cards = [...game.cards];
        const players = [...game.players];
        const endGame = playFullGame(game, tactic, options);
        const remaining = getRemainingCards(endGame);
        stats.total.won += endGame.won ? 1 : 0;
        stats.total.lost5 += !endGame.won && remaining <= 5 ? 1 : 0;
        stats.total.lost10 += !endGame.won && remaining > 5 && remaining <= 10 ? 1 : 0;
        stats.total.lostMore += !endGame.won && remaining > 10 ? 1 : 0;
        stats.total.remaining += remaining;
        stats.total.timeWon += endGame.won ? endGame.time : 0;
        stats.total.timeLost += endGame.won ? 0 : endGame.time;
        stats.total.vetos10Invoked += endGame.vetosAnalysis.vetos10Invoked;
        stats.total.vetos1Invoked += endGame.vetosAnalysis.vetos1Invoked;
        stats.total.vetos10Ignored += endGame.vetosAnalysis.vetos10Ignored;
        stats.total.vetos1Ignored += endGame.vetosAnalysis.vetos1Ignored;

        if ((stats.best.won && endGame.won && endGame.time < stats.best.time)
            ||
            remaining < stats.best.remaining
        ) {
            stats.best = {
                won: endGame.won ? true : !endGame.lost,
                remaining,
                time: endGame.time,
                game: endGame,
                cards,
                players,
            };
        }
        if (
            remaining > stats.worst.remaining ||
            (remaining === stats.worst.remaining && stats.worst.time > endGame.time)
        ) {
            stats.worst = {
                won: endGame.won ? true : !endGame.lost,
                remaining,
                time: endGame.time,
                game: endGame,
                cards,
                players,
            };
        }
    }

    return computeAverage(stats, numberOfGames);
}

export const isCardValid = (card, position, actualValue) => {
    if (!card) {
        return false;
    }
    if (position === goesUpOne || position === goesUpTwo) {
        if (actualValue === card + 10) {
            return true;
        } else if (actualValue > card) {
            return false;
        }
    }
    if (position === goesDownOne || position === goesDownTwo) {
        if (actualValue === card - 10) {
            return true;
        } else if (actualValue < card) {
            return false;
        }
    }
    return true;
}

export const isTenReducingCard = (game, card) => {
    if (game[goesUpOne][0] === card + 10) {
        return goesUpOne;
    }
    if (game[goesUpTwo][0] === card + 10) {
        return goesUpTwo;
    }
    if (game[goesDownOne][0] === card - 10) {
        return goesDownOne;
    }
    if (game[goesDownTwo][0] === card - 10) {
        return goesDownTwo;
    }
    return false;
}

const getValidPositions = (game, card) => {
    let validPositions = []
    if (game[goesUpOne][0] < card) {
        validPositions.push(goesUpOne);
    }
    if (game[goesUpTwo][0] < card) {
        validPositions.push(goesUpTwo);
    }
    if (game[goesDownOne][0] > card) {
        validPositions.push(goesDownOne);
    }
    if (game[goesDownTwo][0] > card) {
        validPositions.push(goesDownTwo);
    }
    const tenReducing = isTenReducingCard(game, card);
    if (tenReducing) {
        if (validPositions.indexOf(tenReducing) < 0) {
            validPositions.push(tenReducing);
        }
    }
    return validPositions;
}

const getValidComboPositions = (game, comboCard) => {
    let validPositions = []
    if (comboCard.cardA === comboCard.cardB + 10 && game[goesUpOne][0] < comboCard.cardA) {
        validPositions.push(goesUpOne);
    }
    if (comboCard.cardA === comboCard.cardB + 10 && game[goesUpTwo][0] < comboCard.cardA) {
        validPositions.push(goesUpTwo);
    }
    if (comboCard.cardA === comboCard.cardB - 10 && game[goesDownOne][0] > comboCard.cardA) {
        validPositions.push(goesDownOne);
    }
    if (comboCard.cardA === comboCard.cardB - 10 && game[goesDownTwo][0] > comboCard.cardA) {
        validPositions.push(goesDownTwo);
    }

    return validPositions;
}

export const getValuedCards = (game, cards) => {
    const valueArray = cards.map(card => {
        return { ...card, value: Math.abs(game[card.position][0] - card.card) }
    });

    valueArray.sort((itemA, itemB) => itemA.value - itemB.value);

    return valueArray;
}


export const getValidCardsAndPositions = (game, player) =>
    game.players[player].reduce((accc, card) =>
        getValidPositions(game, card).reduce((accp, position) =>
            [...accp, { card, position }]
            , accc)
        , []);

export const getTenReducingCards = (game, player) => game.players[player].reduce((list, card) => {
    const position = isTenReducingCard(game, card);
    if (position) {
        return [...list, { card, position }];
    }
    return list;
}, []);

export const getValidComboCardsAndPositions = (game, comboCards) =>
    comboCards.reduce((accc, comboCard) =>
        getValidComboPositions(game, comboCard).reduce((accp, position) =>
            [...accp, { ...comboCard, position }]
            , accc)
        , []);

export const getValuedComboCards = (game, comboCards) => {
    const valueArray = comboCards.map(comboCard => {
        const value = comboCard.cardB - game[comboCard.position][0];
        return {
            ...comboCard,
            value: comboCard.position === goesUpOne || comboCard.position === goesUpTwo
                ? value : -value
        }
    });

    valueArray.sort((itemA, itemB) => itemA.value - itemB.value);

    return valueArray;
}
