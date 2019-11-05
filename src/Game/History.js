import React from 'react';
import './History.css';
import {
    goesUpOne,
    goesUpTwo,
    goesDownOne,
} from '../model/game';

const History = ({ list, end }) => {
    const turns = list.filter(item => item.type === 'move').length;
    return <div className="History">
        <strong>HISTORIQUE ({turns} tours)</strong>
        <strong>{end === 'lost' ? 'PERDU ...' : end === 'won' ? 'GAGNE !!!' : ''}</strong>
        {list && list.map((event, index) => {
            const player = <strong className={`PlayerHistory${event.player}`}>Joueur {event.player}</strong>
            const value = <strong>{event.value}</strong>
            const previous = <strong>{event.previous}</strong>
            const positionPartSense = event.position === goesUpOne ||
                event.position === goesUpTwo ?
                <strong className="LeftHistory">PILE MONTANTE</strong> :
                <strong className="RightHistory">PILE DESCENDANTE</strong>

            const positionPartNumber = event.position === goesUpOne ||
                event.position === goesDownOne ?
                <strong>1</strong> :
                <strong>2</strong>

            switch (event.type) {
                case 'move':
                    return (
                        <span key={index}>
                            {player} joue ( {value} sur {previous} ) en {positionPartSense} {positionPartNumber}
                        </span>);
                case 'veto':
                    return <span key={index}>
                        {player} demande un <strong>VETO</strong> en {positionPartSense} {positionPartNumber}
                    </span>
                default:
                    return null;
            }
        })
        }
    </div>
}

export default History;
