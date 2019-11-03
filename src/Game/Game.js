import React, { useState } from 'react';
import {
    useLocation,
    Link,
} from "react-router-dom";
import './Game.css';
import {
    goesUpOne,
    goesUpTwo,
    goesDownOne,
    loadGame,
    playATurn,
    playFullGame,
} from '../model/game';
import { tactics } from '../model/player';
import Player from './Player';
import MiddleBoard from './MiddleBoard';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const History = ({ list }) => {
    const turns = list.filter(item => item.type === 'move').length;
    return <div className="History">
        <strong>HISTORIQUE ({turns} tours)</strong>
        {list && list.map((event, index) => {
            const player = <strong className={`PlayerHistory${event.player}`}>Joueur {event.player}</strong>
            const value = <strong>{event.value}</strong>
            const positionPartSense = event.position === goesUpOne ||
                event.position === goesUpTwo ?
                <strong className="LeftHistory">PILE MONTANTE</strong> :
                <strong className="RightHistory">PILE DESCENDANTE</strong>

            const positionPartNumber = event.position === goesUpOne ||
                event.position === goesDownOne ?
                <strong>1</strong> :
                <strong>2</strong>

            switch (event.type) {
                case 'move':
                    return (
                        <span key={index}>
                            {player} joue ( {value} ) en {positionPartSense} {positionPartNumber}
                        </span>);
                case 'veto':
                    return <span key={index}>
                        {player} demande un <strong>VETO</strong> en {positionPartSense} {positionPartNumber}
                    </span>
                default:
                    return null;
            }
        })
        }
    </div>
}

const Game = () => {
    const query = useQuery();

    const options = JSON.parse(query.get("options"));

    const cards = JSON.parse(query.get("cards"));
    const players = JSON.parse(query.get("players"));
    const middle = query.get("middle") ? JSON.parse(query.get("middle")) : undefined;
    const turn = query.get("turn") ? +query.get("turn") : undefined;

    const [tactic, setTactic] = useState(query.get("tactic"));
    const [useBetterStarter, setUseBetterStarter] = useState(options['useBetterStarter']);
    const [useVeto1, setUseVeto1] = useState(options['useVeto1']);
    const [useVeto10, setUseVeto10] = useState(options['useVeto10']);
    const [game, setGame] = useState(loadGame(cards, players, middle, turn));
    const [loading, setLoading] = useState(false);

    const playOne = () => {
        setLoading(true);
        const newGame = playATurn(game, tactics[tactic], { useBetterStarter, useVeto1, useVeto10 });
        setGame(newGame);
        setLoading(false);
    }

    const playToEnd = () => {
        setLoading(true);
        const newGame = playFullGame(game, tactics[tactic], { useBetterStarter, useVeto1, useVeto10 });
        setGame(newGame);
        setLoading(false);
    }

    const restart = () => {
        setGame(loadGame(cards, players, middle, turn));
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
                    <button onClick={() => playOne()}>Jouer une action</button>
                    <button onClick={() => playToEnd()}>Jouer et finir</button>
                    <button onClick={() => restart()}>Relancer</button>
                </div>
                <Link to="/">Back to stats</Link>


            </div>
            <History list={game.history} />
            <div className="Board">
                <MiddleBoard
                    goesUpOne={game.goesUpOne}
                    goesUpTwo={game.goesUpTwo}
                    goesDownOne={game.goesDownOne}
                    goesDownTwo={game.goesDownTwo}
                    remainingCards={game.cards.length}
                />
                {game && game.players.map((player, index) => {
                    return (
                        <div key={index} className={`Player${index}${index === 3 ? `For${game.players.length}` : ''}`}>
                            <Player id={index} cards={player} isTurn={index === game.turn} />
                        </div>
                    )
                })}
            </div>
        </div>)
}

export default Game;
