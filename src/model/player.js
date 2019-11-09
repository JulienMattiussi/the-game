import {
    cloneGame,
    move,
    getValidCardsAndPositions,
    getValidComboCardsAndPositions,
    getTenReducingCards,
    getValuedCards,
    getValuedComboCards,
    getMinimalMoveNumber,
    isTenReducingCard,
    NB_CARDS_IN_HAND,
} from './game';

export const getReducingComboCards = (game, player) => {
    const cards = game.players[player];
    const reducingCards = cards.reduce((accA, cardA) =>
        cards.reduce((accB, cardB) =>
            Math.abs(cardA - cardB) === 10 ? [...accB, { cardA, cardB }] : accB
            , accA)
        , []);

    const valuedCombos = getValuedComboCards(
        game,
        getValidComboCardsAndPositions(game, reducingCards));
    return valuedCombos;
}

export const getBestCard = (game, validCards) => {
    return getValuedCards(game, validCards)[0];
}

export const chooseCard = (game, options = { minimumGainToForceVeto: 100 }) => {
    const tenReducingCards = getTenReducingCards(game, game.turn);
    if (tenReducingCards.length) {
        return tenReducingCards[0];
    }
    if (options.playCombos) {
        const comboCards = getReducingComboCards(game, game.turn);
        if (comboCards.length && comboCards[0].value < 0) {
            return comboCards[0].cardA;
        }
    }
    const validCards = getValidCardsAndPositions(game, game.turn);
    if (validCards.length) {
        if (game.vetos.length) {
            const currentVetos = game.vetos.filter(veto => veto.player !== game.turn);
            const validWithoutVetoCards = validCards.filter(card => !currentVetos.some(veto => veto.position === card.position));
            if (validWithoutVetoCards.length) {
                const bestVetoCard = getBestCard(game, validWithoutVetoCards);
                if (bestVetoCard.value > options.minimumGainToForceVeto) {
                    return getBestCard(game, validCards);
                }
                return bestVetoCard;
            }
        }
        return getBestCard(game, validCards);
    }
    return {};
}

export const setBetterStarter = game => {
    const newGame = cloneGame(game);
    const validCards = newGame.players.map((player, index) => getValidCardsAndPositions(newGame, index));
    const bestCards = validCards.map((validCards, index) => (
        { ...getBestCard(newGame, validCards), player: index }));
    bestCards.sort((itemA, itemB) => itemA.value - itemB.value);
    newGame.turn = bestCards[0].player;
    return newGame;
}

export const setVeto = (game, useVeto10, useVeto1) => {
    const newGame = cloneGame(game);
    const nbPlayers = newGame.players.length;
    newGame.vetos = [];
    if (newGame.won || newGame.lost) {
        return newGame;
    }
    if (useVeto10) {
        for (let player = 0; player < nbPlayers; player++) {
            if (newGame.turn !== player) {
                const tenReducingCards = getTenReducingCards(newGame, player);
                if (tenReducingCards.length) {
                    const newVeto = { player, position: tenReducingCards[0].position }
                    newGame.vetos.push(newVeto)
                    if (!newGame.statsMode && !game.vetos.some(veto => veto.player === newVeto.player && veto.position === newVeto.position)) {
                        newGame.history.unshift({ player, type: 'veto', position: tenReducingCards[0].position });
                    }
                }
            }
        }
    }
    if (useVeto1) {
        for (let player = 0; player < nbPlayers; player++) {
            if (newGame.turn !== player && !newGame.vetos.some(veto => veto.player === player)) {
                const bestCard = getBestCard(
                    newGame,
                    getValidCardsAndPositions(newGame, player));
                if (bestCard && bestCard.value === 1) {
                    const newVeto = { player, position: bestCard.position }
                    newGame.vetos.push(newVeto)
                    if (!newGame.statsMode && !game.vetos.some(veto => veto.player === newVeto.player && veto.position === newVeto.position)) {
                        newGame.history.unshift({ player, type: 'veto', position: bestCard.position });
                    }
                }
            }
        }
    }
    return newGame;
}

export const mininumCardsTactic = (
    game,
    options = { minimumGainToForceVeto: 100, useVeto10: false, useVeto1: false }
) => {
    const { useVeto10, useVeto1 } = options;
    const minimalMoveNumber = getMinimalMoveNumber(game.cards);
    const card1 = chooseCard(game, options);
    if (!card1.card) {
        return { ...game, lost: true };
    }
    let turn1 = move(game, card1.card, card1.position, { useVeto1, useVeto10 });
    if (minimalMoveNumber === 2) {
        const card2 = chooseCard(turn1, options);
        if (!card2.card) {
            return { ...turn1, lost: true };
        }
        let turn2 = move(turn1, card2.card, card2.position, { useVeto1, useVeto10 });
        return turn2;
    }
    return turn1;
}

export const threeBestCardsTactic = (
    game,
    options = { minimumGainToForceVeto: 100, useVeto10: false, useVeto1: false }
) => {
    const { useVeto10, useVeto1 } = options;
    const minimalMoveNumber = getMinimalMoveNumber(game.cards);
    let nbPlayed = 0;
    let newGame = cloneGame(game);
    while (nbPlayed < 3) {
        const card = chooseCard(newGame, options);
        if (nbPlayed < minimalMoveNumber && !card.card) {
            return { ...newGame, lost: true };
        }
        if (nbPlayed >= minimalMoveNumber) {
            if (!card.card || (card.value > 1 && !isTenReducingCard(newGame, card.card))) {
                break;
            }
        }
        newGame = move(newGame, card.card, card.position, { useVeto1, useVeto10 });
        nbPlayed++;
    }
    return newGame;
}

export const allBestCardsTactic = (
    game,
    options = { minimumGainToForceVeto: 100, useVeto10: false, useVeto1: false }
) => {
    const { useVeto10, useVeto1 } = options;
    const minimalMoveNumber = getMinimalMoveNumber(game.cards);
    let nbPlayed = 0;
    let newGame = cloneGame(game);
    while (nbPlayed < NB_CARDS_IN_HAND) {
        const card = chooseCard(newGame, options);
        if (nbPlayed < minimalMoveNumber && !card.card) {
            return { ...newGame, lost: true };
        }
        if (nbPlayed >= minimalMoveNumber) {
            if (!card.card || (card.value > 1 && !isTenReducingCard(newGame, card.card))) {
                break;
            }
        }
        newGame = move(newGame, card.card, card.position, { useVeto1, useVeto10 });
        nbPlayed++;
    }
    return newGame;
}

export const allBestCardsUntilEmptyTactic = (
    game,
    options = { minimumGainToForceVeto: 100, useVeto10: false, useVeto1: false }
) => {
    const minimalMoveNumber = getMinimalMoveNumber(game.cards);
    if (minimalMoveNumber === 2) {
        return allBestCardsTactic(game, options);
    } else {
        return mininumCardsTactic(game, options);
    }
}


export const tactics = {
    'mininumCards': { label: 'Jouer minimum de cartes', algo: mininumCardsTactic },
    'threeBestCards': { label: "Jouer jusqu'à 3 bonnes cartes", algo: threeBestCardsTactic },
    'allBestCards': { label: 'Jouer toutes les bonnes cartes', algo: allBestCardsTactic },
    'allBestCardsUntilEmpty': { label: 'Jouer les bonnes cartes puis le minimum', algo: allBestCardsUntilEmptyTactic },

}
