import React, { Fragment } from 'react';
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import './Strategy.css';
import { BEST, WORST } from '../model/strategy';
import { tactics } from '../model/player';
import TitleElement from '../Components/TitleElement';
import SimpleElement from '../Components/SimpleElement';

const StrategyBigTitle = ({ title }) =>
    (<span className="Strategy-big-title">{title}</span>)

const StrategyZone = ({ strat, choice }) => {
    if (!strat)
        return null;
    const { tactic, options, tx, numberOfGames, date } = strat;
    const computedTx = tx ? Math.round(tx * 100) / 100 : 0;
    return <div className="Strategy-zone">
        <TitleElement title={`LA ${choice === BEST ?
            'MEILLEURE' :
            choice === WORST ?
                'PIRE' :
                '?'} : ${computedTx}%`} />
        {tactic && options &&
            <Fragment>
                <br />
                <SimpleElement title="Calculée sur" value={numberOfGames + " parties"} />
                <SimpleElement title="Déterminé il y a" value={date ? formatDistance(new Date(date), new Date(), { locale: fr }) : 'jamais'} />
                <br />
                <SimpleElement title="Tactique" value={tactic ? tactics[tactic].label : ''} />
                <br />
                <SimpleElement title="Optimiser le démarrage" value={options.useBetterStarter ? 'Oui' : 'Non'} />
                <SimpleElement title="Annoncer les vétos de -10" value={options.useVeto10 ? 'Oui' : 'Non'} />
                <SimpleElement title="Annoncer les vétos de +1" value={options.useVeto1 ? 'Oui' : 'Non'} />
                <SimpleElement title="Valeur de gain minimum" value={options.minimumGainToForceVeto} />
            </Fragment>}
    </div>
}

const Strategy = ({ nbPlayers, best, worst, loading }) => {
    const title = `Strategie pour ${nbPlayers} joueurs`;
    return (
        <div>
            {loading ?
                <span>LOADING</span> :
                <div className="Strategy">
                    <StrategyBigTitle title={title} />
                    <StrategyZone strat={best} choice={BEST} />
                    <StrategyZone strat={worst} choice={WORST} />
                </div>
            }
        </div>)
}

export default Strategy;
