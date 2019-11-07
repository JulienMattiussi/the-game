import React, { Fragment } from 'react';
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BEST, WORST } from '../model/strategy';
import { tactics } from '../model/player';
import {
    Loader,
    ColumnLeftContainer,
    TitleZone,
    Zone,
    TitleElement,
    SimpleElement
} from '../Components';

const StrategyZone = ({ strat, choice }) => {
    if (!strat)
        return null;
    const { tactic, options, tx, numberOfGames, date } = strat;
    const computedTx = tx ? Math.round(tx * 100) / 100 : 0;
    return (
        <Zone>
            <TitleElement title={
                `LA ${choice === BEST
                    ? 'MEILLEURE'
                    : choice === WORST
                        ? 'PIRE'
                        : '?'} : ${computedTx}%`
            } />
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
        </Zone>
    )
}

const Strategy = ({ nbPlayers, best, worst, loading }) => {
    const title = `Strategie pour ${nbPlayers} joueurs`;
    return (
        loading
            ? <Loader />
            : <ColumnLeftContainer>
                <TitleZone title={title} />
                <StrategyZone strat={best} choice={BEST} />
                <StrategyZone strat={worst} choice={WORST} />
            </ColumnLeftContainer>
    )
}

export default Strategy;
