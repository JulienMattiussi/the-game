import React, { Fragment } from 'react';
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { translate } from 'react-polyglot';
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

const StrategyZone = ({ t, strat, choice }) => {
    if (!strat)
        return null;
    const { tactic, options, tx, numberOfGames, date } = strat;
    const computedTx = tx ? Math.round(tx * 100) / 100 : 0;
    return (
        <Zone>
            <TitleElement title={
                choice === BEST
                    ? t('best_value', { computedTx })
                    : choice === WORST
                        ? t('worst_value', { computedTx })
                        : t('unknown_value', { computedTx })
            } />
            {tactic && options &&
                <Fragment>
                    <br />
                    <SimpleElement title={t('strategy_nb_games_title')} value={t('strategy_nb_games_value', { numberOfGames })} />
                    <SimpleElement title={t('strategy_date_title')} value={date ? formatDistance(new Date(date), new Date(), { locale: fr }) : t('never')} />
                    <br />
                    <SimpleElement title={t('form_tactic')} value={tactic ? tactics[tactic].label : ''} />
                    <br />
                    <SimpleElement title={t('form_better_starter')} value={options.useBetterStarter ? t('yes') : t('no')} />
                    <SimpleElement title={t('strategy_veto10')} value={options.useVeto10 ? t('yes') : t('no')} />
                    <SimpleElement title={t('strategy_veto1')} value={options.useVeto1 ? t('yes') : t('no')} />
                    <SimpleElement title={t('strategy_minimum_gain_to_force')} value={options.minimumGainToForceVeto} />
                </Fragment>}
        </Zone>
    )
}

const Strategy = ({ t, nbPlayers, best, worst, loading }) => {
    return (
        loading
            ? <Loader />
            : <ColumnLeftContainer>
                <TitleZone title={t('strategy_title', { nbPlayers })} />
                <StrategyZone strat={best} choice={BEST} t={t} />
                <StrategyZone strat={worst} choice={WORST} t={t} />
            </ColumnLeftContainer>
    )
}

export default translate()(Strategy);
