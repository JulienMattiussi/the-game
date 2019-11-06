import React, { useState } from 'react';
import './Strategies.css';
import { Link } from "react-router-dom";
import { computeStrategies } from '../model/strategy';
import { getStrategy } from '../model/save';
import Strategy from './Strategy';


const Strategies = () => {
    const [bestStrategy3, setBestStrategy3] = useState(getStrategy(3, 'best'));
    const [worstStrategy3, setWorstStrategy3] = useState(getStrategy(3, 'worst'));
    const [bestStrategy4, setBestStrategy4] = useState(getStrategy(4, 'best'));
    const [worstStrategy4, setWorstStrategy4] = useState(getStrategy(4, 'worst'));
    const [bestStrategy5, setBestStrategy5] = useState(getStrategy(5, 'best'));
    const [worstStrategy5, setWorstStrategy5] = useState(getStrategy(4, 'worst'));

    const reComputeStrategies = () => {
        computeStrategies();

        setBestStrategy3(getStrategy(3, 'best'));
        setWorstStrategy3(getStrategy(3, 'worst'));
        setBestStrategy4(getStrategy(4, 'best'));
        setWorstStrategy4(getStrategy(4, 'worst'));
        setBestStrategy5(getStrategy(5, 'best'))
        setWorstStrategy5(getStrategy(5, 'worst'));
    }

    return (
        <div className="Page">
            <div className="Form">
                <div className="Form-statistics">
                    <div className="Actions">
                        <button onClick={reComputeStrategies}>Recalculer les meilleures stratégies</button>
                    </div>
                    <Link to="/">Retour aux statistiques</Link>
                </div>
            </div>
            <div className="Strategies">
                <Strategy nbPlayers={3} best={bestStrategy3} worst={worstStrategy3} />
                <Strategy nbPlayers={4} best={bestStrategy4} worst={worstStrategy4} />
                <Strategy nbPlayers={5} best={bestStrategy5} worst={worstStrategy5} />

            </div>
        </div>)
}

export default Strategies;
