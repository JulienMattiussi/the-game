import React from 'react';
import styled from '@emotion/styled';
import { translate } from 'react-polyglot';
import { colors, playersTheme, borderRadius } from '../theme';
import { TitleElement, StrongElement } from '../Components';
import {
    goesUpOne,
    goesUpTwo,
    goesDownOne,
    LOST,
    WON,
    HISTORY_MOVE,
    HISTORY_VETO,
} from '../model/game';

const sensStyle = ({ goesUp }) => ({
    fontWeight: 'bold',
    color: goesUp ? colors.goesUpColor : colors.goesDownColor,
})

const StyledSens = styled.strong(props => sensStyle(props));

const SensElement = ({ t, goesUp }) =>
    <StyledSens goesUp={goesUp}>
        {goesUp ? t('goesUpPile') : t('goesDownPile')}
    </StyledSens>

const playerStyle = ({ number }) => ({
    color: playersTheme[number].mainColor,
})

const StyledPlayer = styled.strong(props => playerStyle(props));

const PlayerElement = ({ t, number }) =>
    <StyledPlayer number={number}>
        {t('player', { number })}
    </StyledPlayer>

const ResultElement = ({ t, result }) =>
    <StrongElement
        value={result === WON ? t('won') : result === LOST ? t('lost') : ''} />

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

const History = ({ t, list, end }) => {
    const turns = list
        .filter(item => item.type === HISTORY_MOVE)
        .reduce((turnsList, row) =>
            turnsList.length
                ? turnsList[0] !== row.player
                    ? [row.player, ...turnsList]
                    : turnsList
                : [row.player]
            , []).length;
    console.log(turns);
    return (
        <StyledHistory>
            <TitleElement title={t('history_title', { turns })} />
            <ResultElement t={t} result={end} />
            {
                list && list.map((event, index) => {
                    const player = <PlayerElement t={t} number={event.player} />
                    const value = <StrongElement value={event.value} />
                    const previous = <StrongElement value={event.previous} />
                    const positionPartSense = <SensElement t={t} goesUp={
                        event.position === goesUpOne ||
                        event.position === goesUpTwo} />

                    const positionPartNumber = <StrongElement
                        value={
                            event.position === goesUpOne || event.position === goesDownOne
                                ? 1
                                : 2} />

                    switch (event.type) {
                        case HISTORY_MOVE:
                            return (
                                <span key={index}>
                                    {player} {t('play')} ( {value} {t('on')} {previous} ) {t('in')} {positionPartSense} {positionPartNumber}
                                </span>);
                        case HISTORY_VETO:
                            return <span key={index}>
                                {player} {t('ask_for')} <StrongElement value={t('veto')} /> {t('in')} {positionPartSense} {positionPartNumber}
                            </span>
                        default:
                            return null;
                    }
                })
            }
        </StyledHistory>
    )
}

export default translate()(History);
