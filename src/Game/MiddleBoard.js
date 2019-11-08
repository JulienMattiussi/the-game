import React from 'react';
import styled from '@emotion/styled';
import { colors, playersTheme } from '../theme';
import { RowMiddleContainer } from '../Components';
import CardFront from './CardFront';
import CardBack from './CardBack';
import {
    goesUpOne as pileGoesUpOne,
    goesUpTwo as pileGoesUpTwo,
    goesDownOne as pileGoesDownOne,
    goesDownTwo as pileGoesDownTwo,
    isCardValid,
} from '../model/game';

const boardStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    top: 240,
    margin: '0 auto',
}

const Board = styled.div(boardStyle);

const cardsColumnStyle = {
    padding: 10,
}

const CardsColumn = styled.div(cardsColumnStyle);

const lockStyle = ({ position, player }) => {
    const basicStyle = {
        position: 'absolute',
        paddingTop: 4,
        height: 26,
        width: 30,
        borderRadius: 15,
        backgroundColor: playersTheme[player].mainColor,
    }

    switch (position) {
        case pileGoesUpTwo:
            return { ...basicStyle, bottom: 0 };
        case pileGoesDownOne:
            return { ...basicStyle, right: 0 };
        case pileGoesDownTwo:
            return {
                ...basicStyle,
                right: 0,
                bottom: 0,
            };
        default:
            return basicStyle;
    }
}

const StyledLock = styled.span(props => lockStyle(props));

const Lock = ({ position, player }) =>
    <StyledLock role="img" aria-label="Verrou" player={player} position={position}>
        🔒
    </StyledLock>

const endStyle = ({ end, won }) => ({
    display: end ? 'block' : 'none',
    position: 'absolute',
    bottom: -60,
    width: 250,
    margin: '0 auto',
    fontWeight: 'bolder',
    fontSize: '50px',
    color: won ? colors.won : colors.lost,
})

const StyledEnd = styled.div(props => endStyle(props));

const EndElement = ({ lost, won }) =>
    <StyledEnd end={lost || won} won={won} >
        {lost ? 'PERDU ...' : won ? 'GAGNE!!!!' : ''}
    </StyledEnd >

const hintStyle = ({ leftPosition }) => {
    const basicStyle = {
        fontWeight: 'bolder',
        position: 'absolute',
        transform: leftPosition ? 'rotate(-90deg)' : 'rotate(90deg)',
        color: leftPosition ? colors.goesUpColor : colors.goesDownColor,
        top: '50%',
    };

    if (leftPosition) {
        return { ...basicStyle, left: -70 };
    }

    return { ...basicStyle, right: -82 };
}

const StyledHint = styled.div(props => hintStyle(props));

const HintElement = ({ left }) =>
    <StyledHint leftPosition={left} >
        {left ? 'PILE MONTANTE' : 'PILE DESCENDANTE'}
    </StyledHint >

const remainingStyle = {
    position: 'absolute',
    right: -130,
    bottom: 'calc(50% - 80px)',
}

const StyledRemaining = styled.div(remainingStyle);

const RemainingCard = ({ value }) =>
    <StyledRemaining>
        <CardBack value={value} />
    </StyledRemaining>

const MiddleBoard = ({
    goesUpOne,
    goesUpTwo,
    goesDownOne,
    goesDownTwo,
    remainingCards,
    placeCard,
    choosenCard,
    vetos = [],
    lost,
    won,
}) => {
    const handlePlaceCard = (position, actualValue) => {
        if (isCardValid(choosenCard, position, actualValue)) {
            placeCard(choosenCard, position);
        }
    }
    return (
        <Board>
            <RowMiddleContainer>
                <CardsColumn>
                    <HintElement left />
                    <CardFront
                        value={goesUpOne[0]}
                        clickable={isCardValid(choosenCard, pileGoesUpOne, goesUpOne[0])}
                        handleClick={() => handlePlaceCard(pileGoesUpOne, goesUpOne[0])} />
                    <CardFront
                        value={goesUpTwo[0]}
                        clickable={isCardValid(choosenCard, pileGoesUpTwo, goesUpTwo[0])}
                        handleClick={() => handlePlaceCard(pileGoesUpTwo, goesUpTwo[0])} />
                </CardsColumn>
                <CardsColumn>
                    <HintElement right />
                    <CardFront
                        value={goesDownOne[0]}
                        clickable={isCardValid(choosenCard, pileGoesDownOne, goesDownOne[0])}
                        handleClick={() => handlePlaceCard(pileGoesDownOne, goesDownOne[0])} />
                    <CardFront
                        value={goesDownTwo[0]}
                        clickable={isCardValid(choosenCard, pileGoesDownTwo, goesDownTwo[0])}
                        handleClick={() => handlePlaceCard(pileGoesDownTwo, goesDownTwo[0])} />
                </CardsColumn>
                <RemainingCard value={remainingCards} />
            </RowMiddleContainer>
            {vetos.map(veto => <Lock key={veto.player} player={veto.player} position={veto.position} />)}
            <EndElement lost={lost} won={won} />
        </Board >
    )
}

export default MiddleBoard;
