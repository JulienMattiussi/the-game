import React from 'react';
import './Card.css';



const Card = ({ value, clickable, selected, onClick }) => {
    return (
        <div
            className={`Card${clickable ? ' CardClickable' : ''}${selected ? ' CardSelected' : ''}`}
            onClick={onClick}
        >
            <div className="CardTop">
                <span>
                    {value}
                </span>
                <span>
                    {value}
                </span>
            </div>
            <span className={`CardMiddle${
                value === 1 ?
                    ' StartOne' :
                    value === 100 ?
                        ' Start100' :
                        ''
                } `}>
                {value}
            </span>
            <div className="CardBottom">
                <span>
                    {value}
                </span>
                <span>
                    {value}
                </span>
            </div>
        </div>)
}

export default Card;
