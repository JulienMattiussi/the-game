import React, { useState } from 'react';
import './Strategies.css';
import { Link } from "react-router-dom";
import { computeStrategies, BEST, WORST } from '../model/strategy';
import { getStrategy } from '../model/save';
import Strategy from './Strategy';


const Strategies = () => {
    const [bestStrategy3, setBestStrategy3] = useState(getStrategy(3, BEST));
    const [worstStrategy3, setWorstStrategy3] = useState(getStrategy(3, WORST));
    const [bestStrategy4, setBestStrategy4] = useState(getStrategy(4, BEST));
    const [worstStrategy4, setWorstStrategy4] = useState(getStrategy(4, WORST));
    const [bestStrategy5, setBestStrategy5] = useState(getStrategy(5, BEST));
    const [worstStrategy5, setWorstStrategy5] = useState(getStrategy(4, WORST));

    const reComputeStrategies = () => {
        computeStrategies();

        setBestStrategy3(getStrategy(3, BEST));
        setWorstStrategy3(getStrategy(3, WORST));
        setBestStrategy4(getStrategy(4, BEST));
        setWorstStrategy4(getStrategy(4, WORST));
        setBestStrategy5(getStrategy(5, BEST))
        setWorstStrategy5(getStrategy(5, WORST));
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
