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
    placeCard,
    choosenCard,
    vetos = [],
    lost,
    won,
}) => {
    const handlePlaceCard = (position) => {
        if (placeCard && choosenCard) {
            placeCard(choosenCard, position);
        }
    }

    return (
        <div className="Middle">
            <div className="MiddleBoard">
                <div className="Pile">
                    <div className="LeftHint">PILE MONTANTE</div>
                    <Card
                        value={goesUpOne[0]}
                        clickable={!!choosenCard}
                        onClick={() => handlePlaceCard('goesUpOne')} />
                    <Card
                        value={goesUpTwo[0]}
                        clickable={!!choosenCard}
                        onClick={() => handlePlaceCard('goesUpTwo')} />
                </div>
                <div className="Pile">
                    <div className="RightHint">PILE DESCENDANTE</div>
                    <Card
                        value={goesDownOne[0]}
                        clickable={!!choosenCard}
                        onClick={() => handlePlaceCard('goesDownOne')} />
                    <Card
                        value={goesDownTwo[0]}
                        clickable={!!choosenCard}
                        onClick={() => handlePlaceCard('goesDownTwo')} />
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
