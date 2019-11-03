import React from 'react';
import {
    Link
} from "react-router-dom";

const playGame = (cards, players, tactic, options) => {
    window.location.href = `/game?cards=${
        JSON.stringify(cards)}&players=${
        JSON.stringify(players)}&tactic=${
        tactic}&options=${
        JSON.stringify(options)}`;
}

const StatElement = ({ title, value }) =>
    (<span><strong>{title}{value != null ? ' : ' : ''}</strong> {value}</span>)


const Stat = ({ stats, loading }) => {

    return (
        <div>
            {loading ?
                <span>LOADING</span> :
                <div className="Stat">
                    <StatElement title={`STATS for ${stats.numberOfPlayers} players (${stats.numberOfGames} games)`} />
                    <br />
                    <StatElement title="BEST" />
                    {stats.best.game && <button onClick={() =>
                        playGame(
                            stats.best.cards,
                            stats.best.players,
                            stats.tactic,
                            stats.options,
                        )}>Replay it</button>}
                    <StatElement title="Won" value={stats.best.won ? "Yes" : "No"} />
                    <StatElement title="Remaining cards" value={stats.best.remaining} />
                    <StatElement title="Turns" value={stats.best.time} />
                    {/* <span>{stats.best.game}</span> */}
                    <br />
                    <StatElement title="WORST" />
                    {stats.worst.game && <button onClick={() =>
                        playGame(
                            stats.worst.cards,
                            stats.worst.players,
                            stats.tactic,
                            stats.options,
                        )}>Replay it</button>}
                    <StatElement title="Won" value={stats.worst.won ? "Yes" : "No"} />
                    <StatElement title="Remaining cards" value={stats.worst.remaining} />
                    <StatElement title="Turns" value={stats.worst.time} />
                    {/* <span>{stats.worst.game}</span> */}
                    <br />
                    <StatElement title="TOTAL" />
                    <StatElement title="Won" value={stats.total.won} />
                    <StatElement title="Lost &lt;= 10 remaining" value={stats.total.lost10} />
                    <StatElement title="Lost &gt; 10 remaining" value={stats.total.lostMore} />
                    <br />
                    <StatElement title="AVERAGE" />
                    <StatElement title="Won" value={stats.average.wonPercent} />
                    <StatElement title="Remaining cards" value={stats.average.remaining} />
                    <StatElement title="Turns" value={stats.average.time} />
                </div>
            }
        </div>)
}

export default Stat;
