import React from 'react';
import styled from '@emotion/styled';
import { colors, playersTheme, borderRadius } from '../theme';
import { StrongElement } from '../Components';
import {
    goesUpOne,
    goesUpTwo,
    goesDownOne,
    LOST,
    WON,
} from '../model/game';

const sensStyle = ({ goesUp }) => ({
    fontWeight: 'bold',
    color: goesUp ? colors.goesUpColor : colors.goesDownColor,
})

const StyledSens = styled.strong(props => sensStyle(props));

const SensElement = ({ goesUp }) =>
    <StyledSens goesUp={goesUp}>
        {goesUp ? 'PILE MONTANTE' : 'PILE DESCENDANTE'}
    </StyledSens>

const playerStyle = ({ number }) => ({
    color: playersTheme[number].mainColor,
})

const StyledPlayer = styled.strong(props => playerStyle(props));

const PlayerElement = ({ number }) =>
    <StyledPlayer number={number}>
        Joueur {number}
    </StyledPlayer>

const ResultElement = ({ result }) =>
    <StrongElement
        value={result === WON ? 'GAGNE !!!' : result === LOST ? 'PERDU ...' : ''} />

const historyStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    backgroundColor: colors.whiteTransparency,
    borderRadius: `0 0 0 ${borderRadius}px`,
    overflowY: 'scroll',
    width: 500,
    height: 200,
    maxHeight: 200,
    whiteSpace: 'pre-wrap',
}

const StyledHistory = styled.div(historyStyle);

const History = ({ list, end }) => {
    const turns = list.filter(item => item.type === 'move').length;
    return (
        <StyledHistory>
            <StrongElement value={`HISTORIQUE (${turns} tours)`} />
            <ResultElement result={end} />
            {
                list && list.map((event, index) => {
                    const player = <PlayerElement number={event.player} />
                    const value = <StrongElement value={event.value} />
                    const previous = <StrongElement value={event.previous} />
                    const positionPartSense = <SensElement goesUp={
                        event.position === goesUpOne ||
                        event.position === goesUpTwo} />

                    const positionPartNumber = <StrongElement
                        value={
                            event.position === goesUpOne || event.position === goesDownOne
                                ? 1
                                : 2} />

                    switch (event.type) {
                        case 'move':
                            return (
                                <span key={index}>
                                    {player} joue ( {value} sur {previous} ) en {positionPartSense} {positionPartNumber}
                                </span>);
                        case 'veto':
                            return <span key={index}>
                                {player} demande un <StrongElement value="VETO" /> en {positionPartSense} {positionPartNumber}
                            </span>
                        default:
                            return null;
                    }
                })
            }
        </StyledHistory>
    )
}

export default History;
