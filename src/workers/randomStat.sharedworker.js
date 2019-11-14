/* eslint-disable no-restricted-globals */
import {
    playManyGames,
} from '../model/game';
import { randomParams } from '../model/statistic';
import { tactics, defaultPlayers } from '../model/player';

let run = false;

self.onconnect = e => {
    let port = e.ports[0];
    //console.log('port', port);
    port.onmessage = ({ data }) => {
        //port.postMessage({ state: 'start1' });
        const { numberOfGames, terminate } = data;
        /*if (numberOfGames) {
            port.postMessage({ state: 'start2' });
            run = true;
        }*/
        /*if (terminate) {
            port.postMessage({ state: 'stop1' });
            run = false;
            return;
        }*/
        //port.postMessage({ end: true });
        //while (run) {
        //console.log('run');
        //port.postMessage({ state: 'run' });
        /*if (!run || data.terminate) {


            port.postMessage({ state: 'stop2' });
            run = false;
            return;
        }*/
        const nbPlayers = { 3: true, 4: true, 5: true };
        const { tactic, criteria } = randomParams();
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
        port.postMessage(stats);
        //}
    }
}
