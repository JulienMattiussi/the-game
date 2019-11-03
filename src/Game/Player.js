import React from 'react';
import Card from './Card';
import './Player.css';



const Player = ({ id, cards, isTurn }) => {
    return (
        <div className="Player">
            <div className="Cards">
                {cards && cards.map((card, index) =>
                    <div className={`Card${index}`}>
                        <Card value={card} />
                    </div>)}
            </div>
            <span className={`Title ${isTurn ? 'Selected' : ''}`}>Player {id}</span>
        </div>
    )
}

export default Player;
