import React, { useState } from 'react';
import {
    useLocation,
    Link,
} from "react-router-dom";
import './Game.css';
import {
    loadGame,
    playATurn,
} from '../model/game';
import { tactics } from '../model/player';
import Player from './Player';
import MiddleBoard from './MiddleBoard';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Game = () => {
    const query = useQuery();

    const cards = JSON.parse(query.get("cards"));
    const players = JSON.parse(query.get("players"));
    const options = JSON.parse(query.get("options"));

    const [tactic, setTactic] = useState(query.get("tactic"));
    const nbPlayers = players.length;
    const [useBetterStarter, setUseBetterStarter] = useState(options['useBetterStarter']);
    const [useVeto1, setUseVeto1] = useState(options['useVeto1']);
    const [useVeto10, setUseVeto10] = useState(options['useVeto10']);
    const [game, setGame] = useState(loadGame(cards, players));
    const [loading, setLoading] = useState(false);


    console.log(tactic);
    console.log(nbPlayers);
    console.log(useBetterStarter);
    console.log(useVeto1);
    console.log(useVeto10);

    const play = () => {
        setLoading(true);
        const newGame = playATurn(game, tactics[tactic], options);
        setGame(newGame);
        setLoading(false);
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
                <button onClick={() => play()}>Play</button>
                <Link to="/">Back to stats</Link>


            </div>
            <div className="Board">
                <MiddleBoard
                    goesUpOne={game.goesUpOne}
                    goesUpTwo={game.goesUpTwo}
                    goesDownOne={game.goesDownOne}
                    goesDownTwo={game.goesDownTwo}
                />
                {game && game.players.map((player, index) => {
                    return (
                        <div className={`Player${index}`}>
                            <Player id={index} cards={player} isTurn={index === game.turn} />
                        </div>
                    )
                })}
            </div>
        </div>)
}

export default Game;
