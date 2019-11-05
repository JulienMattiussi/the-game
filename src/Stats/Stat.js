import React from 'react';

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
                    <StatElement title={`STATS pour ${stats.numberOfPlayers} joueurs (${stats.numberOfGames} parties)`} />
                    <br />
                    <StatElement title="LA MEILLEURE" />
                    {stats.best.game && <button onClick={() =>
                        playGame(
                            stats.best.cards,
                            stats.best.players,
                            stats.tactic,
                            stats.options,
                        )}>Rejouer cette partie</button>}
                    <StatElement title="Gagné" value={stats.best.won ? "Oui" : "Non"} />
                    <StatElement title="Cartes restantes" value={stats.best.remaining} />
                    <StatElement title="Tours" value={stats.best.time} />
                    {/* <span>{stats.best.game}</span> */}
                    <br />
                    <StatElement title="LA PIRE" />
                    {stats.worst.game && <button onClick={() =>
                        playGame(
                            stats.worst.cards,
                            stats.worst.players,
                            stats.tactic,
                            stats.options,
                        )}>Rejouer cette partie</button>}
                    <StatElement title="Gagné" value={stats.worst.won ? "Oui" : "Non"} />
                    <StatElement title="Cartes restantes" value={stats.worst.remaining} />
                    <StatElement title="Tours" value={stats.worst.time} />
                    {/* <span>{stats.worst.game}</span> */}
                    <br />
                    <StatElement title="TOTAL" />
                    <StatElement title="Gagné" value={stats.total.won} />
                    <StatElement title="Perdu &lt;= 5 restantes" value={stats.total.lost5} />
                    <StatElement title="Perdu &gt;5 à 10 restantes" value={stats.total.lost10} />
                    <StatElement title="Perdu &gt; 10 restantes" value={stats.total.lostMore} />
                    <br />
                    <StatElement title="MOYENNE" />
                    <StatElement title="Gagné" value={stats.average.wonPercent} />
                    <StatElement title="Cartes restantes" value={stats.average.remaining} />
                    <StatElement title="Tours" value={stats.average.time} />
                </div>
            }
        </div>)
}

export default Stat;
