import React from 'react';
import Card from './Card';
import RemainingCard from './RemainingCard';
import './Player.css';


const cardStyle = (index, length) =>
    `Card${length > 4 ? index : index + 1}`;


const Player = ({
    id,
    cards,
    isTurn,
    onlyPlayer,
    choosenCard,
    chooseCard,
}) => {
    const handleChooseCard = (value) => {
        if (isTurn && value) {
            const newValue = choosenCard === value ? 0 : value;
            chooseCard(newValue);
        }
    }
    const nbCards = cards.length;
    return (
        <div className="Player">
            <div className={`Cards ${nbCards > 4 ? '' : ' CardMargin'}`}>
                {cards && cards.map((card, index) =>
                    <div key={index} className={cardStyle(index, nbCards)}>
                        {!onlyPlayer || onlyPlayer === id ?
                            <Card
                                value={card}
                                clickable={isTurn && card}
                                selected={choosenCard === card}
                                onClick={() => handleChooseCard(card)}
                            /> :
                            <RemainingCard />
                        }
                    </div>)}
            </div>
            <div className={`Selected ${isTurn ? `Selected${id}` : 'Invisible'}`}></div>
            <span className={`Title ${isTurn ? `Selected${id}` : `Title${id}`}`}>Joueur {id}</span>
        </div>
    )
}

export default Player;
