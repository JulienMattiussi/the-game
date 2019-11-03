import React from 'react';
import Card from './Card';
import './Player.css';



const Player = ({ id, cards, isTurn }) => {
    return (
        <div className="Player">
            <div className="Cards">
                {cards && cards.sort((ca, cb) => ca - cb).map((card, index) =>
                    <div key={index} className={`Card${index}`}>
                        <Card value={card} />
                    </div>)}
            </div>
            <div className={`Selected ${isTurn ? `Selected${id}` : 'Invisible'}`}></div>
            <span className={`Title ${isTurn ? `Selected${id}` : `Title${id}`}`}>Joueur {id}</span>
        </div>
    )
}

export default Player;
