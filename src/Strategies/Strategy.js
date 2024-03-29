import React, { Fragment } from 'react';
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { translate } from 'react-polyglot';
import { BEST, WORST } from '../model/strategy';
import { tactics } from '../model/player';
import {
    Loader,
    RowMiddleContainer,
    ColumnLeftContainer,
    TitleZone,
    Zone,
    TitleElement,
    SimpleElement,
    Icon,
} from '../Components';

export const resetAllStat = (t, nbPlayers, clearAllStats) => {
    if (window.confirm(t('confirm_delete'))) {
        clearAllStats(nbPlayers);
    }
}

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
                    <SimpleElement title={t('strategy_minimum_difference_to_force')} value={options.minimumDifferenceToForceVeto} />
                    <SimpleElement title={t('strategy_play_combos')} value={options.playCombos ? t('yes') : t('no')} />
                </Fragment>}
        </Zone>
    )
}

const Strategy = ({ t, nbPlayers, best, worst, loading, clearAllStats }) => {

    const title =
        <RowMiddleContainer>
            {t('strategy_title', { nbPlayers })} {loading
                ? <Loader />
                : <Icon
                    handleClick={() => resetAllStat(t, nbPlayers, clearAllStats)}
                    label={'🗑'}
                    alert={true}
                    tooltip={t('reinit_all_stat')} />}
        </RowMiddleContainer>


    return (
        <ColumnLeftContainer>
            <TitleZone title={title} />
            <StrategyZone strat={best} choice={BEST} t={t} />
            <StrategyZone strat={worst} choice={WORST} t={t} />
        </ColumnLeftContainer>
    )
}

export default translate()(Strategy);
