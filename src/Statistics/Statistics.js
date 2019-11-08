import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";
import { translate } from 'react-polyglot';
import {
    playManyGames,
} from '../model/game';
import { tactics } from '../model/player';
import { computeAverage } from '../model/stats';
import { saveStats, getStat, getKeyForStat } from '../model/save';
import {
    RowLeftContainer,
    RowMiddleContainer,
    ActionsContainer,
    FormContainer,
    FormBottomContainer,
} from '../Components';
import FormCriteria from '../Forms/FormCriteria';
import Statistic from './Statistic';

const emptyStat = { best: {}, worst: {}, total: {}, average: {}, tactic: '', options: {} };

const Stats = ({ t }) => {
    const [tactic, setTactic] = useState(Object.keys(tactics)[0]);
    const [nbPlayers, setNbPlayers] = useState({ 3: false, 4: true, 5: true });
    const [nbGames, setNbGames] = useState(100);
    const [minimumGainToForceVeto, setMinimumGainToForceVeto] = useState(100);
    const [useBetterStarter, setUseBetterStarter] = useState(true);
    const [useVeto10, setUseVeto10] = useState(true);
    const [useVeto1, setUseVeto1] = useState(false);
    const [stats, setStats] = useState(
        Object.keys(nbPlayers).reduce((all, number) => ({
            ...all,
            [number]: {
                ...emptyStat,
                numberOfPlayers: +number,
                numberOfGames: nbGames,
                tactic,
                options: { minimumGainToForceVeto, useBetterStarter, useVeto10, useVeto1 },
            }
        }), {}));
    const [loading, setLoading] = useState(false);

    const computeStat = (tactic, numberOfGames) => {
        setLoading(true);
        const stats = {};
        Object.keys(nbPlayers).map(
            number => {
                if (nbPlayers[number]) {
                    stats[number] = {
                        ...playManyGames(
                            tactics[tactic].algo,
                            { minimumGainToForceVeto, useBetterStarter, useVeto10, useVeto1 },
                            +number,
                            numberOfGames),
                        tactic,
                        options: { minimumGainToForceVeto, useBetterStarter, useVeto10, useVeto1 },
                    };
                }
                return null;
            }
        );
        saveStats(stats);
        setStats(stats);
        setLoading(false);
    }

    const changeNbGames = (event) => {
        setNbGames(+event.target.value);
        setStats(Object.keys(nbPlayers).reduce((all, number) => ({
            ...all,
            [number]: {
                ...emptyStat,
                numberOfPlayers: +number,
                numberOfGames: +event.target.value,
                tactic,
                options: { minimumGainToForceVeto, useBetterStarter, useVeto10, useVeto1 },
            }
        }), {}));
    }

    const changeNbPlayers = (number) => {
        const players = { ...nbPlayers };
        players[number] = !players[number];
        setNbPlayers(players);
        setStats(Object.keys(players).reduce((all, number) => ({
            ...all,
            [number]: {
                ...emptyStat,
                numberOfPlayers: +number,
                numberOfGames: nbGames,
                tactic,
                options: { minimumGainToForceVeto, useBetterStarter, useVeto10, useVeto1 },
            }
        }), {}));
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
                    setUseVeto1={setUseVeto1}
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
                                        {key} joueurs
                            </label>
                                )
                            })
                        }
                    </RowMiddleContainer>
                    <label>
                        Nombre de jeux
                        <input type="number" value={nbGames} onChange={changeNbGames} />
                    </label>
                    <ActionsContainer>
                        <button onClick={() => computeStat(tactic, nbGames)}>Lancer les statistiques</button>
                    </ActionsContainer>
                    <Link to="/strategies">{t('link_strategies')}</Link>
                </FormBottomContainer>
            </FormContainer>
            <RowMiddleContainer>
                {
                    Object.keys(nbPlayers).map(key => {
                        if (nbPlayers[key]) {
                            const emptyStat = getStat(getKeyForStat(stats[key]));
                            const globalStat = computeAverage(emptyStat, emptyStat ? emptyStat.numberOfGames : 0);
                            return (
                                <RowLeftContainer key={key}>
                                    <Statistic stats={stats[key]} loading={loading} />
                                    <Statistic global={true} stats={globalStat} loading={loading} />
                                </RowLeftContainer>)
                        }
                        return null;
                    })
                }
            </RowMiddleContainer>
        </Fragment>)
}

export default translate()(Stats);
