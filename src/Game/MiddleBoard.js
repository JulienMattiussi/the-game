import React from 'react';
import Card from './Card';
import RemainingCard from './RemainingCard';
import './MiddleBoard.css';



const MiddleBoard = ({
    goesUpOne,
    goesUpTwo,
    goesDownOne,
    goesDownTwo,
    remainingCards,
    lost,
    won,
}) => {
    return (
        <div className="Middle">
            <div className="MiddleBoard">
                <div className="Pile">
                    <div className="LeftHint">PILE MONTANTE</div>
                    <Card value={goesUpOne[0]} />
                    <Card value={goesUpTwo[0]} />
                </div>
                <div className="Pile">
                    <div className="RightHint">PILE DESCENDANTE</div>
                    <Card value={goesDownOne[0]} />
                    <Card value={goesDownTwo[0]} />
                </div>
                <div className="RemainingCard">
                    <RemainingCard value={remainingCards} />
                </div>
            </div>
            {lost && <div className="Lost">PERDU ...</div>}
            {won && <div className="Won">GAGNE !!!!</div>}
        </div >
    )
}

export default MiddleBoard;
