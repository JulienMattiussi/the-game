import React, { Fragment, useState } from 'react';
import { translate } from 'react-polyglot';
import styled from '@emotion/styled';
import {
    useLocation,
    Link,
} from "react-router-dom";
import {
    loadGame,
    isPlayable,
    getMinimalMoveNumber,
    move,
    reload,
    changeTurn,
    playATurn,
    playFullGame,
    LOST,
    WON,
} from '../model/game';
import { tactics, setBetterStarter } from '../model/player';
import {
    ActionsContainer,
    FormContainer,
    FormBottomContainer,
} from '../Components';
import FormCriteria from '../Forms/FormCriteria';
import Player from './Player';
import MiddleBoard from './MiddleBoard';
import History from './History';

const useQuery = () =>
    new URLSearchParams(useLocation().search);

const initNewGame = (cards, players, middle, turn, useBetterStarter) => {
    const newGame = loadGame(cards, players, middle, turn);
    if (useBetterStarter) {
        return setBetterStarter(newGame);
    }
    return newGame;
}

const boardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
}

const Board = styled.div(boardStyle);

const playerStyle = ({ player, total }) => {

    const position = 'absolute';

    switch (player) {
        case 0:
            return {
                top: '40%',
                left: 0,
                position
            };
        case 1:
            return {
                top: 0,
                left: 'calc(50% - 260px)',
                position
            };
        case 2:
            return {
                top: '40%',
                right: 0,
                position
            };
        case 3:
            if (total === 4) {
                return {
                    bottom: 0,
                    left: 'calc(50% - 260px)',
                    position
                };
            }
            return {
                bottom: 0,
                right: '10%',
                position
            };
        case 4:
            return {
                bottom: 0,
                left: '10%',
                position
            };
        default:
            return { position };
    }
}

const StyledPlayer = styled.div(props => playerStyle(props));

const Game = ({ t }) => {
    const query = useQuery();

    const options = JSON.parse(query.get("options"));
    const notPlayer = options.notPlayer;

    const cards = JSON.parse(query.get("cards"));
    const players = JSON.parse(query.get("players"));
    const middle = query.get("middle") ? JSON.parse(query.get("middle")) : undefined;
    const turn = query.get("turn") ? +query.get("turn") : undefined;

    const [tactic, setTactic] = useState(query.get("tactic"));
    const [useBetterStarter, setUseBetterStarter] = useState(options.useBetterStarter);
    const [minimumGainToForceVeto, setMinimumGainToForceVeto] = useState(options.minimumGainToForceVeto || 100);
    const [useVeto1, setUseVeto1] = useState(options.useVeto1);
    const [useVeto10, setUseVeto10] = useState(options.useVeto10);
    const [game, setGame] = useState(initNewGame(cards, players, middle, turn, useBetterStarter));
    const [choosenCard, setChoosenCard] = useState(0);
    const [turnNumber, setTurnNumber] = useState(0);
    const [loading, setLoading] = useState(false);

    const playOne = () => {
        setLoading(true);
        setChoosenCard(0);
        setTurnNumber(0);
        const newGame = playATurn(game, tactics[tactic].algo, { minimumGainToForceVeto, useBetterStarter, useVeto1, useVeto10 });
        setGame(newGame);
        setLoading(false);
    }

    const playToEnd = () => {
        setLoading(true);
        setChoosenCard(0);
        setTurnNumber(0);
        const newGame = playFullGame(game, tactics[tactic].algo, { minimumGainToForceVeto, useBetterStarter, useVeto1, useVeto10, notPlayer });
        setGame(newGame);
        setLoading(false);
    }

    const restart = () => {
        setChoosenCard(0);
        setTurnNumber(0);
        setGame(initNewGame(cards, players, middle, turn, useBetterStarter));
    }

    const chooseCard = (card) => {
        setChoosenCard(card);
    }

    const placeCard = (value, position) => {
        const minimalMoveNumber = getMinimalMoveNumber(game.cards);
        if (turnNumber === 0 && minimalMoveNumber === 2) {
            setGame(move(game, value, position, { useVeto1, useVeto10 }));
            setTurnNumber(1);
        } else {
            setGame(
                changeTurn(
                    reload(
                        move(game, value, position, { useVeto1, useVeto10 })
                    ),
                    { useVeto1, useVeto10 })
            );
            setTurnNumber(0);
        }
        setChoosenCard(0);
    }

    return (
        <Fragment>
            <FormContainer>
                <FormCriteria
                    tactic={tactic}
                    setTactic={setTactic}
                    minimumGainToForceVeto={minimumGainToForceVeto}
                    setMinimumGainToForceVeto={setMinimumGainToForceVeto}
                    useBetterStarter={useBetterStarter}
                    setUseBetterStarter={setUseBetterStarter}
                    useVeto10={useVeto10}
                    setUseVeto10={setUseVeto10}
                    useVeto1={useVeto1}
                    setUseVeto1={setUseVeto1} />
                <FormBottomContainer>
                    <ActionsContainer>
                        <button onClick={() => playOne()} disabled={!isPlayable(game)}>{t('button_play_next')}</button>
                        <button onClick={() => playToEnd()} disabled={!isPlayable(game) || notPlayer === game.turn}>{t('button_play_to_end')}</button>
                        <button onClick={() => restart()}>{t('button_restart')}</button>
                    </ActionsContainer>
                    <Link to="/">{t('link_statistics')}</Link>
                </FormBottomContainer>
            </FormContainer>
            <History list={game.history} end={game.lost ? LOST : game.won ? WON : false} />
            <Board>
                <MiddleBoard
                    goesUpOne={game.goesUpOne}
                    goesUpTwo={game.goesUpTwo}
                    goesDownOne={game.goesDownOne}
                    goesDownTwo={game.goesDownTwo}
                    remainingCards={game.cards.length}
                    placeCard={placeCard}
                    choosenCard={choosenCard}
                    vetos={game.vetos}
                    lost={game.lost}
                    won={game.won}
                    loading={loading}
                />
                {game && game.players.map((player, index) => {
                    return (
                        <StyledPlayer key={index} player={index} total={game.players.length} >
                            <Player
                                id={index}
                                cards={player}
                                isTurn={index === game.turn}
                                onlyPlayer={notPlayer}
                                choosenCard={choosenCard}
                                chooseCard={chooseCard}
                            />
                        </StyledPlayer>
                    )
                })}
            </Board>
        </Fragment >)
}

export default translate()(Game);
