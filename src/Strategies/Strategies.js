import React, { useState } from 'react';
import './Strategies.css';
import { Link } from "react-router-dom";
import { tactics } from '../model/player';
import { computeStrategies, nbPlayers } from '../model/strategy';
import { getStrategy } from '../model/save';


const Strategies = () => {

    return (
        <div className="Page">
            <div className="Form">
                <div className="Form-statistics">
                    <div className="Actions">
                        <button onClick={computeStrategies}>Recalculer les meilleurs stratégies</button>
                    </div>
                    <Link to="/">Retour aux statistiques</Link>
                </div>
            </div>
            <div className="Stats">
                {
                    nbPlayers.map(key => {
                        const bestStrategy = getStrategy(key, 'best');
                        const worstStrategy = getStrategy(key, 'worst');
                        console.log(bestStrategy);
                        console.log(worstStrategy);
                        /*return (
                            <div key={key} className="Stat-container">
                                <Stat stats={stats[key]} loading={loading} />
                                <Stat global={true} stats={globalStat} loading={loading} />
                            </div>)
*/
                        return null;
                    })
                }
            </div>
        </div>)
}

export default Strategies;
