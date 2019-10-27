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


export const getTenReducingCards = (game, player) => game.players[player].reduce((list, card) => {
    const positions = isTenReducingCard(game, card);
    if (positions) {
        const newList = { cards: [...list.cards, card], positions: [...list.positions, [positions]] };
        return newList;
    }
    return list;
}, { cards: [], positions: [] });

export const getBestCard = (game, validCards) => {
    const flattenArray = [];

    for (let i = 0; i < validCards.positions.length; i++) {
        const positions = validCards.positions[i];
        for (let j = 0; j < positions.length; j++) {
            flattenArray.push({ card: validCards.cards[i], position: positions[j] })
        }
    }

    const valueArray = flattenArray.map(card => {
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
    const validCards = getValidCards(game, game.turn);
    if (validCards.cards.length) {
        const bestCard = getBestCard(game, validCards);

        return bestCard;
    }
    return {};
}

export const setBetterStarter = game => {
    const newGame = cloneGame(game);
    const validCards = newGame.players.map((player, index) => getValidCards(newGame, index));
    const bestCards = validCards.map((validCards, index) => (
        { ...getBestCard(newGame, validCards), player: index }));
    bestCards.sort((itemA, itemB) => itemA.value - itemB.value);
    newGame.turn = bestCards[0].player;
    return newGame;
}

export const simpleTactic = (game) => {
    const card1 = chooseCard(game);
    if (!card1.card) {
        return { ...game, lost: true };
    }
    const turn1 = move(game, card1.card, card1.position);
    if (game.cards.length) {
        const card2 = chooseCard(turn1);
        if (!card2.card) {
            return { ...turn1, lost: true };
        }
        const turn2 = move(turn1, card2.card, card2.position);
        return turn2;
    }
    return turn1;
}


export const tactics = {
    'simpleTactic': simpleTactic,
}
