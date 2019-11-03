import React from 'react';
import './Card.css';

const pluralise = value => value > 1 ? 's' : '';

const RemainingCard = ({ value }) => {
    return (
        <div className="Card CardBack">
            <span className="CardRemaining">
                <span className="CardRemainingNumber">
                    {value}
                </span>
                Carte{pluralise(value)} restante{pluralise(value)}
            </span>
        </div>)
}

export default RemainingCard;
