import React, { Fragment } from 'react';
import './Strategy.css';
import { tactics } from '../model/player';

const StatElement = ({ title, value }) =>
    (<span><strong>{title}{value != null ? ' : ' : ''}</strong> {value}</span>)


const StrategyTitle = ({ title }) =>
    (<span className="Strategy-title">{title}</span>)

const StrategyBigTitle = ({ title }) =>
    (<span className="Strategy-big-title">{title}</span>)

const StrategyZone = ({ strat, choice }) => {

    const { tactic, options, tx } = strat;
    const computedTx = tx ? Math.round(tx * 100) / 100 : 0;
    return <div className="Strategy-zone">
        <StrategyTitle title={`LA ${choice === 'best' ? 'MEILLEURE' : 'PIRE'} : ${computedTx}%`} />
        {tactic && options &&
            <Fragment>
                <br />
                <StatElement title="Caculée sur" value={strat.numberOfGames + " parties"} />
                <br />
                <StatElement title="Tactique" value={strat.tactic ? tactics[tactic].label : ''} />
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
                    <StrategyZone strat={best} choice="best" />
                    <StrategyZone strat={worst} choice="worst" />
                </div>
            }
        </div>)
}

export default Strategy;
