import React from 'react';
import Card from './Card';
import './MiddleBoard.css';



const MiddleBoard = ({
    goesUpOne,
    goesUpTwo,
    goesDownOne,
    goesDownTwo }) => {
    return (
        <div className="MiddleBoard">
            <div className="Pile">
                <div className="LeftHint">GOES UP</div>
                <Card value={goesUpOne[0]} />
                <Card value={goesUpTwo[0]} />
            </div>
            <div className="Pile">
                <div className="RightHint">GOES DOWN</div>
                <Card value={goesDownOne[0]} />
                <Card value={goesDownTwo[0]} />
            </div>
        </div >
    )
}

export default MiddleBoard;
