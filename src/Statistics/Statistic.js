import React from 'react';
import { translate } from 'react-polyglot';
import { LEFT, RIGHT } from '../theme';
import {
    Loader,
    ActionsContainer,
    ColumnLeftContainer,
    TitleZone,
    Zone,
    TitleElement,
    SimpleElement
} from '../Components';

const playGame = (cards, players, tactic, options) => {
    window.location.href = `/game?cards=${
        JSON.stringify(cards)}&players=${
        JSON.stringify(players)}&tactic=${
        tactic}&options=${
        JSON.stringify(options)}`;
}

const Stat = ({ t, stats, global, loading }) => {
    const title = global
        ? t('statistic_title_global', { numberOfGames: stats.numberOfGames })
        : t('statistic_title', {
            numberOfPlayers: stats.numberOfPlayers,
            numberOfGames: stats.numberOfGames
        });

    return (
        loading
            ? <Loader />
            : <ColumnLeftContainer>
                <TitleZone title={title} position={global ? RIGHT : LEFT} />
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title={t('best')} />
                    <ActionsContainer>
                        {stats.best.game && <button onClick={() =>
                            playGame(
                                stats.best.cards,
                                stats.best.players,
                                stats.tactic,
                                stats.options,
                            )}>{t('button_see_detailled_game')}</button>}
                    </ActionsContainer>
                    <SimpleElement title={t('won')} value={stats.best.won ? t('yes') : t('no')} />
                    <SimpleElement title={t('remaning_cards')} value={stats.best.remaining} />
                    <SimpleElement title={t('turns')} value={stats.best.time} />
                </Zone>
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title={t('worst')} />
                    <ActionsContainer>
                        {stats.worst.game &&
                            <button onClick={() =>
                                playGame(
                                    stats.worst.cards,
                                    stats.worst.players,
                                    stats.tactic,
                                    stats.options,
                                )}>{t('button_see_detailled_game')}</button>
                        }
                    </ActionsContainer>
                    <SimpleElement title={t('won')} value={stats.worst.won ? t('yes') : t('no')} />
                    <SimpleElement title={t('remaning_cards')} value={stats.worst.remaining} />
                    <SimpleElement title={t('turns')} value={stats.worst.time} />
                </Zone>
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title={t('total')} />
                    <SimpleElement title={t('won')} value={stats.total.won} />
                    <SimpleElement title={t('statistic_lost_remaining', { range: '<= 5' })} value={stats.total.lost5} />
                    <SimpleElement title={t('statistic_lost_remaining', { range: '>5 à 10' })} value={stats.total.lost10} />
                    <SimpleElement title={t('statistic_lost_remaining', { range: '> 10' })} value={stats.total.lostMore} />
                </Zone>
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title={t('average')} />
                    <SimpleElement title={t('won')} value={stats.average.wonPercent} />
                    <SimpleElement title={t('remaning_cards')} value={stats.average.remaining} />
                    <SimpleElement title={t('statistic_number_winning_turn')} value={stats.average.timeWon} />
                    <SimpleElement title={t('statistic_number_loosing_turn')} value={stats.average.timeLost} />
                </Zone>
            </ColumnLeftContainer>
    )
}

export default translate()(Stat);
