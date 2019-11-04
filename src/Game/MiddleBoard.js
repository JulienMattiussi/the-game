import React from 'react';
import Card from './Card';
import RemainingCard from './RemainingCard';
import './MiddleBoard.css';
import {
    goesUpOne as pileGoesUpOne,
    goesUpTwo as pileGoesUpTwo,
    goesDownOne as pileGoesDownOne,
    goesDownTwo as pileGoesDownTwo
} from '../model/game';

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
    const isValid = (position, actualValue) => {
        if (!choosenCard) {
            return false;
        }
        if (
            (position === pileGoesUpOne || position === pileGoesUpTwo)
            && actualValue > choosenCard
        ) {
            return false;
        }
        if (
            (position === pileGoesDownOne || position === pileGoesDownTwo)
            && actualValue < choosenCard
        ) {
            return false;
        }
        return true;
    }

    const handlePlaceCard = (position, actualValue) => {
        if (isValid(position, actualValue)) {
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
                        clickable={isValid(pileGoesUpOne, goesUpOne[0])}
                        onClick={() => handlePlaceCard(pileGoesUpOne, goesUpOne[0])} />
                    <Card
                        value={goesUpTwo[0]}
                        clickable={isValid(pileGoesUpTwo, goesUpTwo[0])}
                        onClick={() => handlePlaceCard(pileGoesUpTwo, goesUpTwo[0])} />
                </div>
                <div className="Pile">
                    <div className="RightHint">PILE DESCENDANTE</div>
                    <Card
                        value={goesDownOne[0]}
                        clickable={isValid(pileGoesDownOne, goesDownOne[0])}
                        onClick={() => handlePlaceCard(pileGoesDownOne, goesDownOne[0])} />
                    <Card
                        value={goesDownTwo[0]}
                        clickable={isValid(pileGoesDownTwo, goesDownTwo[0])}
                        onClick={() => handlePlaceCard(pileGoesDownTwo, goesDownTwo[0])} />
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
