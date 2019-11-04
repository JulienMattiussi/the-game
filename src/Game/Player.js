import React from 'react';
import Card from './Card';
import './Player.css';



const cardStyle = (index, length) =>
    `Card${length > 4 ? index : index + 1}`;

const Player = ({ id, cards, isTurn }) => {
    const nbCards = cards.length;
    return (
        <div className="Player">
            <div className={`Cards ${nbCards > 4 ? '' : ' CardMargin'}`}>
                {cards && cards.map((card, index) =>
                    <div key={index} className={cardStyle(index, nbCards)}>
                        <Card value={card} />
                    </div>)}
            </div>
            <div className={`Selected ${isTurn ? `Selected${id}` : 'Invisible'}`}></div>
            <span className={`Title ${isTurn ? `Selected${id}` : `Title${id}`}`}>Joueur {id}</span>
        </div>
    )
}

export default Player;
