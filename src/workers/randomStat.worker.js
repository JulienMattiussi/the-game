/* eslint-disable no-restricted-globals */
import {
    playManyGames,
} from '../model/game';
import { randomParams } from '../model/statistic';
import { tactics, defaultPlayers } from '../model/player';

self.onmessage = ({ data }) => {
    if (data.terminate) {
        console.log("Terminated");
        return;
    }
    const { numberOfGames } = data;
    const nbPlayers = { 3: true, 4: true, 5: true };
    const { tactic, criteria } = randomParams();
    const start = new Date();
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

    console.log("Params : ", tactic, criteria);
    console.log("Stat computing finished : ", new Date() - start);
    postMessage(stats);
}
