import React, { Fragment, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { translate } from 'react-polyglot';
import worker from '../workers/stat.worker';
import randomWorker from '../workers/randomStat.worker';
import { initGame } from '../model/game';
import {
    setBetterStarter,
    defaultOptions,
    defaultTactic,
    defaultPlayers
} from '../model/player';
import { computeAverage } from '../model/statistic';
import { saveStats, getStat, getKeyForStat, clearStat } from '../save';
import {
    ColumnLeftContainer,
    RowLeftContainer,
    RowMiddleContainer,
    ActionsContainer,
    RightFormContainer,
    FormContainer,
    FormBottomContainer,
    SimpleElement,
} from '../Components';
import FormCriteria from '../Forms/FormCriteria';
import Statistic, { playGame } from './Statistic';

const emptyStat = { best: {}, worst: {}, total: {}, average: {}, tactic: '', options: {} };

const rebuildStats = (nbPlayers, nbGames, tactic, criteria) =>
    Object.keys(nbPlayers).reduce((all, number) => ({
        ...all,
        [number]: {
            ...emptyStat,
            numberOfPlayers: +number,
            numberOfGames: nbGames,
            tactic,
            options: { ...criteria },
        }
    }), {});

const Statistics = ({ t }) => {
    const [criteria, setCriteria] = useState(defaultOptions);
    const [tactic, setTactic] = useState(defaultTactic);
    const [nbPlayers, setNbPlayers] = useState(defaultPlayers);
    const [nbGames, setNbGames] = useState(100);
    const [stats, setStats] = useState(rebuildStats(nbPlayers, nbGames, tactic, criteria));
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [nbWorkers, setNbWorkers] = useState(0);
    const [permanentWorker, setPermanentWorker] = useState(false);
    const [totalComputed, setTotalComputed] = useState(0);

    useEffect(() => {
        setLoading(true);
        setStats(rebuildStats(nbPlayers, nbGames, tactic, criteria));
    }, [criteria, tactic, nbPlayers, nbGames]);

    useEffect(() => {
        setLoading(false);
    }, [stats]);

    const statWorker = new worker();
    statWorker.addEventListener('message', ({ data: computedStats }) => {
        saveStats(computedStats);
        setNbWorkers(previousState => previousState - 1);
        setStats(previousState => {
            const redraw = Object.keys(nbPlayers).reduce((action, key) => {
                if (!action && nbPlayers[key] && computedStats[key] && previousState[key]) {
                    if (getKeyForStat(computedStats[key]) === getKeyForStat(previousState[key])) {
                        return true;
                    }
                }
                return action;
            }, false);
            return redraw ? computedStats : previousState;
        });
    });

    const computeStat = (tactic, numberOfGames) => {
        setLoading(true);

        statWorker.postMessage({ nbPlayers, tactic, criteria, numberOfGames });
        setNbWorkers(previousState => previousState + 1);
    }

    const changeNbGames = (event) => {
        setNbGames(+event.target.value);
    }

    const changeNbPlayers = (number) => {
        const players = { ...nbPlayers };
        players[number] = !players[number];
        setNbPlayers(players);
    }

    const playNewGame = (number) => {
        let game = initGame(number);
        if (criteria.useBetterStarter) {
            game = setBetterStarter(game);
        }

        playGame(
            game.cards,
            game.players,
            tactic,
            { ...criteria, notPlayer: game.turn },
        )
    }

    const handleClearStat = (stat) => {
        clearStat(stat);
        setRefresh(!refresh);
    }

    const numberToCompute = 100;

    const randomStatWorker = new randomWorker();
    randomStatWorker.addEventListener('message', ({ data: computedStats }) => {
        setNbWorkers(previousState => previousState - 1);
        saveStats(computedStats);
        setTotalComputed(previousState => previousState + numberToCompute);
        setPermanentWorker(previousState => {
            if (previousState) {
                randomStatWorker.postMessage({ numberOfGames: numberToCompute });
                setNbWorkers(previousState => previousState + 1);
            }
            return previousState;
        });

    });
    const handlePermanentCompute = (active) => {
        if (active) {
            setPermanentWorker(true);
            setTotalComputed(0);
            randomStatWorker.postMessage({ numberOfGames: numberToCompute });
            setNbWorkers(previousState => previousState + 1);
        }
        else {
            randomStatWorker.postMessage({ terminate: true });
            setPermanentWorker(false);
        }
    }

    return (
        <Fragment>
            <FormContainer>
                <FormCriteria
                    tactic={tactic}
                    criteria={criteria}
                    setTactic={setTactic}
                    setCriteria={setCriteria}
                />
                <FormBottomContainer>
                    <RowMiddleContainer>
                        {
                            Object.keys(nbPlayers).map(key => {
                                return (
                                    <label key={key}>
                                        <input
                                            type="checkbox"
                                            checked={nbPlayers[key]}
                                            onChange={() => changeNbPlayers(+key)}
                                        />
                                        {t('form_nb_players', { key })}
                                    </label>
                                )
                            })
                        }
                    </RowMiddleContainer>
                    <label>
                        {t('form_nb_games')}
                        <input
                            type="number"
                            min={1}
                            max={999999}
                            value={nbGames}
                            onChange={changeNbGames} />
                    </label>
                    <ActionsContainer>
                        <button
                            onClick={() => computeStat(tactic, nbGames)}>{t('button_stactistics')}
                        </button> {nbWorkers ? `(${nbWorkers}...)` : ''}
                        <RowMiddleContainer>
                            {t('button_play_game')}
                            <button onClick={() => playNewGame(3)}>{t('button_play_game_3')}</button>
                            <button onClick={() => playNewGame(4)}>{t('button_play_game_4')}</button>
                            <button onClick={() => playNewGame(5)}>{t('button_play_game_5')}</button>
                        </RowMiddleContainer>
                    </ActionsContainer>
                    <Link to="/strategies">{t('link_strategies')}</Link>
                </FormBottomContainer>
            </FormContainer>
            <RightFormContainer>
                <ActionsContainer>
                    {t('button_permanent_worker')}
                    <button
                        onClick={() => handlePermanentCompute(true)}
                        disabled={permanentWorker}
                    >{t('button_on')}</button>
                    <button
                        onClick={() => handlePermanentCompute(false)}
                        disabled={!permanentWorker}
                    >{t('button_off')}</button>
                </ActionsContainer>
                <FormBottomContainer>
                    <SimpleElement title={t('number_computed')} value={totalComputed} />
                </FormBottomContainer>
            </RightFormContainer>
            <RowMiddleContainer>
                {
                    Object.keys(nbPlayers).map(key => {
                        if (nbPlayers[key] && stats[key]) {
                            const emptyGlobalStat = getStat(getKeyForStat(stats[key]));
                            const globalStat = computeAverage(emptyGlobalStat, emptyGlobalStat
                                ? emptyGlobalStat.numberOfGames :
                                0);
                            return (
                                <RowLeftContainer key={key}>
                                    <Statistic stat={stats[key]} loading={loading} />
                                    <Statistic
                                        global={true}
                                        stat={globalStat}
                                        loading={loading}
                                        clearStat={() => handleClearStat(globalStat)} />
                                </RowLeftContainer>)
                        }
                        return null;
                    })
                }
            </RowMiddleContainer>
        </Fragment>)
}

export default translate()(Statistics);
