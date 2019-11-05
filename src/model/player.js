import {
    cloneGame,
    move,
    getValidPositions,
    getMinimalMoveNumber,
    isTenReducingCard,
    NB_CARDS_IN_HAND,
} from './game';

export const getValidCards = (game, player) => game.players[player].reduce((list, card) => {
    const positions = getValidPositions(game, card);
    if (positions.length) {
        const newList = { cards: [...list.cards, card], positions: [...list.positions, positions] };
        return newList;
    }
    return list;
}, { cards: [], positions: [] });

export const getFlattenValidCards = validCards => {
    const flattenArray = [];
    for (let i = 0; i < validCards.positions.length; i++) {
        const positions = validCards.positions[i];
        for (let j = 0; j < positions.length; j++) {
            flattenArray.push({ card: validCards.cards[i], position: positions[j] })
        }
    }

    return flattenArray;
}


export const getTenReducingCards = (game, player) => game.players[player].reduce((list, card) => {
    const positions = isTenReducingCard(game, card);
    if (positions) {
        const newList = { cards: [...list.cards, card], positions: [...list.positions, [positions]] };
        return newList;
    }
    return list;
}, { cards: [], positions: [] });

export const getValuedCards = (game, cards) => {
    const valueArray = cards.map(card => {
        return { ...card, value: Math.abs(game[card.position][0] - card.card) }
    });

    valueArray.sort((itemA, itemB) => itemA.value - itemB.value);

    return valueArray;
}

export const getBestCard = (game, validCards) => {
    return getValuedCards(game, validCards)[0];
}

export const chooseCard = (game, options = { minimumGainToForceVeto: 100 }) => {
    const tenReducingCards = getTenReducingCards(game, game.turn);
    if (tenReducingCards.cards.length) {
        return { card: tenReducingCards.cards[0], position: tenReducingCards.positions[0][0] }
    }
    const validCards = getFlattenValidCards(getValidCards(game, game.turn));
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
    const validCards = newGame.players.map((player, index) => getValidCards(newGame, index));
    const bestCards = validCards.map((validCards, index) => (
        { ...getBestCard(newGame, getFlattenValidCards(validCards)), player: index }));
    bestCards.sort((itemA, itemB) => itemA.value - itemB.value);
    newGame.turn = bestCards[0].player;
    return newGame;
}

export const setVeto = (game, useVeto10, useVeto1) => {
    const newGame = cloneGame(game);
    newGame.vetos = [];
    if (newGame.won || newGame.lost) {
        return newGame;
    }
    if (useVeto10) {
        for (let player = 0; player < newGame.players.length; player++) {
            if (newGame.turn !== player && !newGame.vetos.some(veto => veto.player === player)) {
                const tenReducingCards = getTenReducingCards(newGame, player);
                if (tenReducingCards.cards.length) {
                    const newVeto = { player, position: tenReducingCards.positions[0][0] }
                    newGame.vetos.push(newVeto)
                    if (!game.statsMode && !game.vetos.some(veto => veto.player === newVeto.player && veto.position === newVeto.position)) {
                        newGame.history.unshift({ player, type: 'veto', position: tenReducingCards.positions[0][0] });
                    }
                }
            }
        }
    }
    if (useVeto1) {
        for (let player = 0; player < newGame.players.length; player++) {
            if (newGame.turn !== player && !newGame.vetos.some(veto => veto.player === player)) {
                const bestCard = getBestCard(
                    newGame,
                    getFlattenValidCards(getValidCards(newGame, player)));
                if (bestCard && bestCard.value === 1) {
                    const newVeto = { player, position: bestCard.position }
                    newGame.vetos.push(newVeto)
                    if (!game.statsMode && !game.vetos.some(veto => veto.player === newVeto.player && veto.position === newVeto.position)) {
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
