import React from 'react';
import styled from '@emotion/styled';
import { playersTheme, cardPositionTheme, borderRadius } from '../theme';
import CardFront from './CardFront';
import CardBack from './CardBack';

const cardsStyle = ({ isFew }) => {

    const cardMarginStyle = {
        marginLeft: 90,
        width: 397,
    }

    const basicStyle = {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    }

    if (isFew) {
        return ({
            ...basicStyle,
            ...cardMarginStyle,
        })
    }

    return basicStyle;
}

const Cards = styled.div(props => cardsStyle(props));

const cardPositionStyle = ({ number }) => ({
    transform: cardPositionTheme[number].transform,
})

const CardPosition = styled.div(props => cardPositionStyle(props));

const labelStyle = ({ isTurn, number }) => {

    const colorStyle = {
        backgroundColor: playersTheme[number].secondaryColor,
        borderColor: playersTheme[number].mainColor,
        color: playersTheme[number].mainColor,
    }

    const colorSelectedStyle = {
        backgroundColor: playersTheme[number].mainColor,
        color: playersTheme[number].selectedTextColor,
    }

    const basicStyle = {
        textAlign: 'center',
        paddingTop: 20,
        width: '100%',
        height: 34,
        maxHeight: 34,
        border: 'solid 2px',
        borderRadius,
        fontWeight: 'bolder',
    }

    return ({
        ...basicStyle,
        ...(isTurn ? colorSelectedStyle : colorStyle),
    })
}

const StyledLabel = styled.div(props => labelStyle(props));

const Label = ({ isTurn, number }) =>
    <StyledLabel isTurn={isTurn} number={number}>
        Joueur {number}
    </StyledLabel>

const selectorStyle = ({ number }) => {

    const colorStyle = {
        backgroundColor: playersTheme[number].mainColor,
        color: playersTheme[number].selectedTextColor,
    }

    const basicStyle = {
        position: 'absolute',
        bottom: 60,
        left: 0,
        height: 30,
        width: 30,
        border: 'solid 2px',
        borderRadius: 17,
    }

    return ({
        ...basicStyle,
        ...colorStyle,
    })
}

const Selector = styled.div(props => selectorStyle(props));

const playerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 487,
    height: 200,
    padding: 10,
}

const StyledPlayer = styled.div(playerStyle);

const Player = ({
    id,
    cards,
    isTurn,
    onlyPlayer,
    choosenCard,
    chooseCard,
}) => {
    const handleChooseCard = (value) => {
        if (isTurn && value) {
            chooseCard(choosenCard === value ? 0 : value);
        }
    }
    const nbCards = cards.length;
    return (
        <StyledPlayer>
            <Cards isFew={nbCards <= 4}>
                {cards && cards.map((card, index) =>
                    <CardPosition key={index} number={nbCards > 4 ? index : index + 1}>
                        {!onlyPlayer || onlyPlayer === id ?
                            <CardFront
                                value={card}
                                clickable={isTurn && card}
                                selected={choosenCard === card}
                                handleClick={() => handleChooseCard(card)}
                            /> :
                            <CardBack />
                        }
                    </CardPosition>)}
            </Cards>
            {isTurn && <Selector number={id} />}
            <Label isTurn={isTurn} number={id} />
        </StyledPlayer>
    )
}

export default Player;
