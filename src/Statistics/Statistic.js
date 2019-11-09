import React from 'react';
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { translate } from 'react-polyglot';
import { LEFT, RIGHT } from '../theme';
import {
    Loader,
    ActionsContainer,
    ColumnLeftContainer,
    RowMiddleContainer,
    TitleZone,
    Zone,
    TitleElement,
    SimpleElement,
    Icon,
} from '../Components';

export const playGame = (cards, players, tactic, options) => {
    window.location.href = `/game?cards=${
        JSON.stringify(cards)}&players=${
        JSON.stringify(players)}&tactic=${
        tactic}&options=${
        JSON.stringify(options)}`;
}

export const resetStat = (t, clearStat) => {
    if (window.confirm(t('confirm_delete'))) {
        clearStat();
    }
}

const GameElement = ({ t, type, global, game, tactic, options }) => {
    const exists = game.game && game.game.cards;
    console.log(game);
    return <Zone position={global ? RIGHT : LEFT}>
        <TitleElement title={t(type)} />
        <ActionsContainer>
            {exists && <button onClick={() =>
                playGame(
                    game.cards,
                    game.players,
                    tactic,
                    options,
                )}>{t('button_see_detailled_game')}</button>}
        </ActionsContainer>
        <SimpleElement title={t('statistic_won')} value={game.won ? t('yes') : t('no')} />
        <SimpleElement title={t('remaning_cards', { s: 's' })} value={exists && game.remaining} />
        <SimpleElement title={t('turns')} value={exists && game.time} />
        <SimpleElement title={t('statistic_total_veto10')} value={exists && game.game.vetosAnalysis && game.game.vetosAnalysis.vetos10Invoked} />
        <SimpleElement title={t('statistic_total_veto1')} value={exists && game.game.vetosAnalysis && game.game.vetosAnalysis.vetos1Invoked} />
    </Zone>
}


const Statistic = ({ t, stat, global, loading, clearStat }) => {
    const title = global
        ? t('statistic_title_global', { numberOfGames: stat.numberOfGames })
        : t('statistic_title', {
            numberOfPlayers: stat.numberOfPlayers,
            numberOfGames: stat.numberOfGames
        });

    const dateTitle = global
        ? stat.date
            ? <RowMiddleContainer>
                {formatDistance(new Date(stat.date), new Date(), { locale: fr })} <Icon
                    handleClick={() => resetStat(t, clearStat)}
                    label={'🗑'}
                    alert={true}
                    tooltip={t('reinit_stat')} />
            </RowMiddleContainer>
            : t('never')
        : t('statistic_date_title');

    console.log(stat);
    return (
        loading
            ? <Loader />
            : <ColumnLeftContainer>
                <TitleZone title={title} position={global ? RIGHT : LEFT} />
                <GameElement
                    t={t}
                    type={'best'}
                    global={global}
                    game={stat.best}
                    tactic={stat.tactic}
                    options={stat.options} />
                <GameElement
                    t={t}
                    type={'worst'}
                    global={global}
                    game={stat.worst}
                    tactic={stat.tactic}
                    options={stat.options} />
                <TitleZone title={dateTitle} position={global ? RIGHT : LEFT} />
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title={t('total')} />
                    <SimpleElement title={t('statistic_won')} value={stat.total.won} />
                    <SimpleElement title={t('statistic_lost_remaining', { range: '<= 5' })} value={stat.total.lost5} />
                    <SimpleElement title={t('statistic_lost_remaining', { range: '>5 à 10' })} value={stat.total.lost10} />
                    <SimpleElement title={t('statistic_lost_remaining', { range: '> 10' })} value={stat.total.lostMore} />
                    <SimpleElement title={t('statistic_total_veto10')} value={stat.total.vetos10Invoked} />
                    <SimpleElement title={t('statistic_total_veto1')} value={stat.total.vetos1Invoked} />
                </Zone>
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title={t('average')} />
                    <SimpleElement title={t('statistic_won')} value={stat.average.wonPercent} />
                    <SimpleElement title={t('remaning_cards', { s: 's' })} value={stat.average.remaining} />
                    <SimpleElement title={t('statistic_number_winning_turn')} value={stat.average.timeWon} />
                    <SimpleElement title={t('statistic_number_loosing_turn')} value={stat.average.timeLost} />
                    <SimpleElement title={t('statistic_average_veto10')} value={stat.average.vetos10Invoked} />
                    <SimpleElement title={t('statistic_average_veto1')} value={stat.average.vetos1Invoked} />
                </Zone>
            </ColumnLeftContainer>
    )
}

export default translate()(Statistic);
