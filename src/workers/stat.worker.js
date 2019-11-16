/* eslint-disable no-restricted-globals */
import {
    playManyGames,
} from '../model/game';
import { tactics } from '../model/player';

onmessage = ({ data }) => {
    const start = new Date();
    const { nbPlayers, tactic, criteria, numberOfGames } = data;
    const stats = {};
    Object.keys(nbPlayers).map(
        number => {
            if (nbPlayers[number]) {
                stats[number] = {
                    ...playManyGames(
                        tactics[tactic].algo,
                        { ...criteria },
                        +number,
                        numberOfGames),
                    numberOfPlayers: +number,
                    tactic,
                    options: { ...criteria },
                };
            }
            return null;
        }
    );

    console.log("Stat computing finished : ", new Date() - start);
    postMessage(stats);
}
