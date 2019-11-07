import React from 'react';
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

const Stat = ({ stats, global, loading }) => {
    const title = global ?
        `Cumul pour ${stats.numberOfGames} parties` :
        `Pour ${stats.numberOfPlayers} joueurs (${stats.numberOfGames} parties)`;

    return (
        loading
            ? <Loader />
            : <ColumnLeftContainer>
                <TitleZone title={title} position={global ? RIGHT : LEFT} />
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title="LA MEILLEURE" />
                    <ActionsContainer>
                        {stats.best.game && <button onClick={() =>
                            playGame(
                                stats.best.cards,
                                stats.best.players,
                                stats.tactic,
                                stats.options,
                            )}>Rejouer cette partie</button>}
                    </ActionsContainer>
                    <SimpleElement title="Gagné" value={stats.best.won ? "Oui" : "Non"} />
                    <SimpleElement title="Cartes restantes" value={stats.best.remaining} />
                    <SimpleElement title="Tours" value={stats.best.time} />
                </Zone>
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title="LA PIRE" />
                    <ActionsContainer>
                        {stats.worst.game &&
                            <button onClick={() =>
                                playGame(
                                    stats.worst.cards,
                                    stats.worst.players,
                                    stats.tactic,
                                    stats.options,
                                )}>Rejouer cette partie</button>
                        }
                    </ActionsContainer>
                    <SimpleElement title="Gagné" value={stats.worst.won ? "Oui" : "Non"} />
                    <SimpleElement title="Cartes restantes" value={stats.worst.remaining} />
                    <SimpleElement title="Tours" value={stats.worst.time} />
                </Zone>
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title="TOTAL" />
                    <SimpleElement title="Gagné" value={stats.total.won} />
                    <SimpleElement title="Perdu &lt;= 5 restantes" value={stats.total.lost5} />
                    <SimpleElement title="Perdu &gt;5 à 10 restantes" value={stats.total.lost10} />
                    <SimpleElement title="Perdu &gt; 10 restantes" value={stats.total.lostMore} />
                </Zone>
                <Zone position={global ? RIGHT : LEFT}>
                    <TitleElement title="MOYENNE" />
                    <SimpleElement title="Gagné" value={stats.average.wonPercent} />
                    <SimpleElement title="Cartes restantes" value={stats.average.remaining} />
                    <SimpleElement title="Nombre Tours Gagnants" value={stats.average.timeWon} />
                    <SimpleElement title="Nombre Tours Perdants" value={stats.average.timeLost} />
                </Zone>
            </ColumnLeftContainer>
    )
}

export default Stat;
