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
    vetos = [],
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
            {vetos.map(veto => {
                return <span key={veto.player} role="img" aria-label="Verrou" className={`Veto Selected${veto.player} Veto${veto.position}`}>🔒</span>
            })}
            {lost && <div className="Lost">PERDU ...</div>}
            {won && <div className="Won">GAGNE !!!!</div>}
        </div >
    )
}

export default MiddleBoard;
