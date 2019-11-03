import {
    goesUpOne,
    goesUpTwo,
    goesDownOne,
    goesDownTwo,
    cloneGame,
    move,
    getValidPositions,
    isTenReducingCard,
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

export const getBestCard = (game, validCards) => {
    const valueArray = validCards.map(card => {
        return { ...card, value: Math.abs(game[card.position][0] - card.card) }
    });

    valueArray.sort((itemA, itemB) => itemA.value - itemB.value);

    return valueArray[0];
}

export const chooseCard = (game) => {
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
                return getBestCard(game, validWithoutVetoCards);
            }
        }
        const bestCard = getBestCard(game, validCards);

        return bestCard;
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

export const setVeto = game => {
    const newGame = cloneGame(game);
    for (let player = 0; player < newGame.players.length; player++) {
        if (newGame.turn !== player && !newGame.vetos.some(veto => veto.player === player)) {
            const tenReducingCards = getTenReducingCards(newGame, player);
            if (tenReducingCards.cards.length) {
                newGame.vetos.push({ player, position: tenReducingCards.positions[0][0] })
            }
        }
    }
    return newGame;
}

export const simpleTactic = (game, useVeto = false) => {
    const card1 = chooseCard(game);
    if (!card1.card) {
        return { ...game, lost: true };
    }
    let turn1 = move(game, card1.card, card1.position);
    if (useVeto) {
        turn1 = setVeto(turn1);
    }
    if (game.cards.length) {
        const card2 = chooseCard(turn1);
        if (!card2.card) {
            return { ...turn1, lost: true };
        }
        let turn2 = move(turn1, card2.card, card2.position);
        if (useVeto) {
            turn2 = setVeto(turn2);
        }
        return turn2;
    }
    return turn1;
}


export const tactics = {
    'simpleTactic': simpleTactic,
}
