import React from 'react';
import './Card.css';



const Card = ({ value }) => {
    return (
        <div className="Card">
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
                        ''}`}>
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
