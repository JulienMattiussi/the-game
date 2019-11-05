import React, { useState } from 'react';
import {
    playManyGames,
} from '../model/game';
import { tactics } from '../model/player';
import Stat from './Stat';

const log = false;

const logStats = (stats) => {
    console.log(`STATS for ${stats.numberOfPlayers} players (${stats.numberOfGames} games)`);
    console.log("BEST")
    console.log('Won : ', stats.best.won);
    console.log('Remaining cards : ', stats.best.remaining);
    console.log('Turns : ', stats.best.time);
    console.log(stats.best.game);
    console.log("WORST")
    console.log('Won : ', stats.worst.won);
    console.log('Remaining cards : ', stats.worst.remaining);
    console.log('Turns : ', stats.worst.time);
    console.log(stats.worst.game);
    console.log("TOTAL")
    console.log('Won : ', stats.total.won);
    console.log('Lost <= 10 remaining : ', stats.total.lost10);
    console.log('Lost > 10 remaining : ', stats.total.lostMore);
    console.log("AVERAGE")
    console.log('Won : ', stats.average.wonPercent);
    console.log('Remaining cards : ', stats.average.remaining);
    console.log('Turns : ', stats.average.time);
}

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
                    if (log) logStats(stats[number]);
                }
                return null;
            }
        );
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

    const changeUseBetterStarter = () => {
        setUseBetterStarter(!useBetterStarter);
    }

    const changeUseVeto10 = () => {
        setUseVeto10(!useVeto10);
    }

    const changeUseVeto1 = () => {
        setUseVeto1(!useVeto1);
    }
    const changeMinimumGainToForceVeto = (event) => {
        setMinimumGainToForceVeto(+event.target.value);
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

    const changeTactic = (event) => {
        setTactic(event.target.value);
    }


    return (
        <div>
            <div className="Form">
                <label>
                    Tactique
                    <select onChange={changeTactic} >
                        {Object.keys(tactics).map(tactic => (
                            <option key={tactic} value={tactic} >{tactics[tactic].label}</option>
                        ))}
                    </select>
                </label>
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
                    <input type="checkbox" checked={useBetterStarter} onChange={changeUseBetterStarter} />
                    Optimiser le démarrage
                </label>
                <label>
                    <input type="checkbox" checked={useVeto10} onChange={changeUseVeto10} />
                    Annoncer les veto quand une reduction de 10 est possible
                </label>
                <label>
                    <input type="checkbox" checked={useVeto1} onChange={changeUseVeto1} />
                    Annoncer les veto quand la carte suivante est disponible
                </label>
                <label>
                    Valeur minimum de gain pour outrepasser un veto
                    <input type="number" value={minimumGainToForceVeto} onChange={changeMinimumGainToForceVeto} />
                </label>
                <label>
                    Nombre de jeux
                    <input type="number" value={nbGames} onChange={changeNbGames} />
                </label>
                <button onClick={() => computeStat(tactic, nbGames)}>Lancer les statistiques</button>
            </div>
            <div className="Stats">
                {
                    Object.keys(nbPlayers).map(key => {
                        if (nbPlayers[key]) {
                            return (<Stat key={key} stats={stats[key]} loading={loading} />)
                        }
                        return null;
                    })
                }
            </div>
        </div>)
}

export default Stats;
