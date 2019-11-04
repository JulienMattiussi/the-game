import React, { useState } from 'react';
import {
    useLocation,
    Link,
} from "react-router-dom";
import './Game.css';
import {
    loadGame,
    playATurn,
    playFullGame,
} from '../model/game';
import { tactics, setBetterStarter } from '../model/player';
import Player from './Player';
import MiddleBoard from './MiddleBoard';
import History from './History';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const initNewGame = (cards, players, middle, turn, useBetterStarter) => {
    const newGame = loadGame(cards, players, middle, turn);
    if (useBetterStarter) {
        return setBetterStarter(newGame);
    }
    return newGame;
}

const isPlayable = (game) => game && !game.lost && !game.won;

const Game = () => {
    const query = useQuery();

    const options = JSON.parse(query.get("options"));
    const notPlayer = options.notPlayer;

    const cards = JSON.parse(query.get("cards"));
    const players = JSON.parse(query.get("players"));
    const middle = query.get("middle") ? JSON.parse(query.get("middle")) : undefined;
    const turn = query.get("turn") ? +query.get("turn") : undefined;

    const [tactic, setTactic] = useState(query.get("tactic"));
    const [useBetterStarter, setUseBetterStarter] = useState(options.useBetterStarter);
    const [useVeto1, setUseVeto1] = useState(options.useVeto1);
    const [useVeto10, setUseVeto10] = useState(options.useVeto10);
    const [game, setGame] = useState(initNewGame(cards, players, middle, turn, useBetterStarter));
    const [loading, setLoading] = useState(false);

    const playOne = () => {
        setLoading(true);
        const newGame = playATurn(game, tactics[tactic], { useBetterStarter, useVeto1, useVeto10 });
        setGame(newGame);
        setLoading(false);
    }

    const playToEnd = () => {
        setLoading(true);
        const newGame = playFullGame(game, tactics[tactic], { useBetterStarter, useVeto1, useVeto10, notPlayer });
        setGame(newGame);
        setLoading(false);
    }

    const restart = () => {
        setGame(initNewGame(cards, players, middle, turn, useBetterStarter));
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

    const changeTactic = (event) => {
        setTactic(event.target.value);
    }


    return (
        <div className="Page">
            <div className="Form">
                <label>
                    Tactique
                    <select onChange={changeTactic} >
                        {Object.keys(tactics).map(tactic => (
                            <option key={tactic} value={tactic} >{tactic}</option>
                        ))}
                    </select>
                </label>
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
                <div className="Actions">
                    <button onClick={() => playOne()} disabled={!isPlayable(game)}>Jouer une action</button>
                    <button onClick={() => playToEnd()} disabled={!isPlayable(game) || notPlayer === game.turn}>Jouer et finir</button>
                    <button onClick={() => restart()}>Relancer</button>
                </div>
                <Link to="/">Back to stats</Link>


            </div>
            <History list={game.history} end={game.lost ? 'lost' : game.won ? 'won' : false} />
            <div className="Board">
                <MiddleBoard
                    goesUpOne={game.goesUpOne}
                    goesUpTwo={game.goesUpTwo}
                    goesDownOne={game.goesDownOne}
                    goesDownTwo={game.goesDownTwo}
                    remainingCards={game.cards.length}
                    vetos={game.vetos}
                    lost={game.lost}
                    won={game.won}
                />
                {game && game.players.map((player, index) => {
                    return (
                        <div key={index} className={`Player${index}${index === 3 ? `For${game.players.length}` : ''}`}>
                            <Player
                                id={index}
                                cards={player}
                                isTurn={index === game.turn}
                                onlyPlayer={notPlayer}
                            />
                        </div>
                    )
                })}
            </div>
        </div>)
}

export default Game;
