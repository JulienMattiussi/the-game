import React from 'react';

const Stat = ({ stats, loading }) => {

    return (
        <div>
            {loading ?
                <span>LOADING</span> :
                <div className="Stat">
                    <span><strong>STATS for {stats.numberOfPlayers} players ({stats.numberOfGames} games)</strong></span>
                    <br />
                    <span><strong>BEST</strong></span>
                    <span><strong>Won :</strong> {stats.best.won ? "Yes" : "No"}</span>
                    <span><strong>Remaining cards :</strong> {stats.best.remaining}</span>
                    <span><strong>Turns :</strong> {stats.best.time}</span>
                    {/* <span>{stats.best.game}</span> */}
                    <br />
                    <span><strong>WORST</strong></span>
                    <span><strong>Won :</strong> {stats.worst.won ? "Yes" : "No"}</span>
                    <span><strong>Remaining cards :</strong> {stats.worst.remaining}</span>
                    <span><strong>Turns :</strong> {stats.worst.time}</span>
                    {/* <span>{stats.worst.game}</span> */}
                    <br />
                    <span><strong>TOTAL</strong></span>
                    <span><strong>Won :</strong> {stats.total.won}</span>
                    <span><strong>Lost &lt;= 10 remaining :</strong> {stats.total.lost10}</span>
                    <span><strong>Lost &gt; 10 remaining :</strong> {stats.total.lostMore}</span>
                    <br />
                    <span><strong>AVERAGE</strong></span>
                    <span><strong>Won :</strong> {stats.average.wonPercent}</span>
                    <span><strong>Remaining cards :</strong> {stats.average.remaining}</span>
                    <span><strong>Turns :</strong> {stats.average.time}</span>
                </div>
            }
        </div>)
}

export default Stat;
