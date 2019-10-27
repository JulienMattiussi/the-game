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

const emptyStat = { best: {}, worst: {}, total: {}, average: {} };

const Stats = () => {
    const [tactic, setTactic] = useState('simpleTactic');
    const [nbPlayers, setNbPlayers] = useState({ 3: true, 4: true, 5: true });
    const [nbGames, setNbGames] = useState(1000);
    const [useBetterStarter, setUseBetterStarter] = useState(false);
    const [stats, setStats] = useState(
        Object.keys(nbPlayers).reduce((all, number) => ({
            ...all,
            [number]: {
                ...emptyStat,
                numberOfPlayers: +number,
                numberOfGames: nbGames,
            }
        }), {}));
    const [loading, setLoading] = useState(false);

    const computeStat = (tactic, games) => {
        setLoading(true);
        const stats = {};
        Object.keys(nbPlayers).map(
            number => {
                if (nbPlayers[number]) {
                    stats[number] = playManyGames(tactics[tactic], useBetterStarter, +number, games);
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
            }
        }), {}));
    }

    const changeUseBetterStarter = () => {
        setUseBetterStarter(!useBetterStarter);
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
                            <option key={tactic} value={tactic} >{tactic}</option>
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
                    Nombre de jeux
                    <input type="number" value={nbGames} onChange={changeNbGames} />
                </label>
                <button onClick={() => computeStat(tactic, nbGames)}>Compute stats</button>
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
