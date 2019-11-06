import React, { Fragment, useState } from 'react';
import './Stats.css';
import {
    playManyGames,
} from '../model/game';
import { tactics } from '../model/player';
import { computeAverage } from '../model/stats';
import { saveStats, getStat, getKeyForStat } from '../model/save';
import FormCriteria from '../Forms/FormCriteria';
import Stat from './Stat';

const emptyStat = { best: {}, worst: {}, total: {}, average: {}, tactic: '', options: {} };

const Stats = () => {
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
        <div className="Page">
            <div className="Form">
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
                <div className="Form-statistics">
                    <div className="NbPlayers">
                        {
                            Object.keys(nbPlayers).map(key => {
                                return (
                                    <label key={key}>
                                        <input
                                            type="checkbox"
                                            checked={nbPlayers[key]}
                                            onChange={() => changeNbPlayers(+key)} />
                                        {key} joueurs
                            </label>
                                )
                            })
                        }
                    </div>
                    <label>
                        Nombre de jeux
                        <input type="number" value={nbGames} onChange={changeNbGames} />
                    </label>
                    <div className="Actions">
                        <button onClick={() => computeStat(tactic, nbGames)}>Lancer les statistiques</button>
                    </div>
                </div>
            </div>
            <div className="Stats">
                {
                    Object.keys(nbPlayers).map(key => {
                        if (nbPlayers[key]) {
                            const emptyStat = getStat(getKeyForStat(stats[key]));
                            const globalStat = computeAverage(emptyStat, emptyStat.numberOfGames);
                            return (
                                <Fragment>
                                    <Stat key={key} stats={stats[key]} loading={loading} />
                                    <Stat key={`${key}Global`} global={true} stats={globalStat} loading={loading} />
                                </Fragment>)
                        }
                        return null;
                    })
                }
            </div>
        </div>)
}

export default Stats;
