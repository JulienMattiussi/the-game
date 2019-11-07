import React from 'react';
import CardFront from './CardFront';
import CardBack from './CardBack';
import './MiddleBoard.css';
import {
    goesUpOne as pileGoesUpOne,
    goesUpTwo as pileGoesUpTwo,
    goesDownOne as pileGoesDownOne,
    goesDownTwo as pileGoesDownTwo,
    isCardValid,
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
    const handlePlaceCard = (position, actualValue) => {
        if (isCardValid(choosenCard, position, actualValue)) {
            placeCard(choosenCard, position);
        }
    }

    return (
        <div className="Middle">
            <div className="MiddleBoard">
                <div className="Pile">
                    <div className="LeftHint">PILE MONTANTE</div>
                    <CardFront
                        value={goesUpOne[0]}
                        clickable={isCardValid(choosenCard, pileGoesUpOne, goesUpOne[0])}
                        handleClick={() => handlePlaceCard(pileGoesUpOne, goesUpOne[0])} />
                    <CardFront
                        value={goesUpTwo[0]}
                        clickable={isCardValid(choosenCard, pileGoesUpTwo, goesUpTwo[0])}
                        handleClick={() => handlePlaceCard(pileGoesUpTwo, goesUpTwo[0])} />
                </div>
                <div className="Pile">
                    <div className="RightHint">PILE DESCENDANTE</div>
                    <CardFront
                        value={goesDownOne[0]}
                        clickable={isCardValid(choosenCard, pileGoesDownOne, goesDownOne[0])}
                        handleClick={() => handlePlaceCard(pileGoesDownOne, goesDownOne[0])} />
                    <CardFront
                        value={goesDownTwo[0]}
                        clickable={isCardValid(choosenCard, pileGoesDownTwo, goesDownTwo[0])}
                        handleClick={() => handlePlaceCard(pileGoesDownTwo, goesDownTwo[0])} />
                </div>
                <div className="RemainingCard">
                    <CardBack value={remainingCards} />
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
