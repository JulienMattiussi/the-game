import React from 'react';

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
                    <StatElement title="Won" value={stats.best.won ? "Yes" : "No"} />
                    <StatElement title="Remaining cards" value={stats.best.remaining} />
                    <StatElement title="Turns" value={stats.best.time} />
                    {/* <span>{stats.best.game}</span> */}
                    <br />
                    <StatElement title="WORST" />
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
