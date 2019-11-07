import React, { Fragment } from 'react';
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import './Strategy.css';
import { BEST, WORST } from '../model/strategy';
import { tactics } from '../model/player';

const StatElement = ({ title, value }) =>
    (<span><strong>{title}{value != null ? ' : ' : ''}</strong> {value}</span>)


const StrategyTitle = ({ title }) =>
    (<span className="Strategy-title">{title}</span>)

const StrategyBigTitle = ({ title }) =>
    (<span className="Strategy-big-title">{title}</span>)

const StrategyZone = ({ strat, choice }) => {
    if (!strat)
        return null;
    const { tactic, options, tx, numberOfGames, date } = strat;
    const computedTx = tx ? Math.round(tx * 100) / 100 : 0;
    console.log(date);
    return <div className="Strategy-zone">
        <StrategyTitle title={`LA ${choice === BEST ?
            'MEILLEURE' :
            choice === WORST ?
                'PIRE' :
                '?'} : ${computedTx}%`} />
        {tactic && options &&
            <Fragment>
                <br />
                <StatElement title="Calculée sur" value={numberOfGames + " parties"} />
                <StatElement title="Déterminé il y a" value={date ? formatDistance(new Date(date), new Date(), { locale: fr }) : 'jamais'} />
                <br />
                <StatElement title="Tactique" value={tactic ? tactics[tactic].label : ''} />
                <br />
                <StatElement title="Optimiser le démarrage" value={options.useBetterStarter ? 'Oui' : 'Non'} />
                <StatElement title="Annoncer les vétos de -10" value={options.useVeto10 ? 'Oui' : 'Non'} />
                <StatElement title="Annoncer les vétos de +1" value={options.useVeto1 ? 'Oui' : 'Non'} />
                <StatElement title="Valeur de gain minimum" value={options.minimumGainToForceVeto} />
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
