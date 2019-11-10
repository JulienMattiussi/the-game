import xlsx from 'node-xlsx';
import fileDownload from 'js-file-download';
import { getStat, getAllStatKeys } from './save';
import { computeAverage } from './statistic';



export const exportStats = () => {
    const statKeys = getAllStatKeys().sort();
    const stats = statKeys.reduce((sheet, key) => {
        const statKey = key[0];
        const rawStat = getStat(statKey);
        const stat = computeAverage(rawStat, rawStat.numberOfGames);
        return [...sheet, [
            stat.numberOfPlayers,
            stat.tactic,
            new Date(stat.date),
            stat.options.useBetterStarter ? "Oui" : "Non",
            stat.options.useVeto10 ? "Oui" : "Non",
            stat.options.useVeto1 ? "Oui" : "Non",
            stat.options.minimumGainToForceVeto,
            stat.options.playCombos ? "Oui" : "Non",

            stat.total.won,
            stat.total.lost5,
            stat.total.lost10,
            stat.total.lostMore,
            stat.total.vetos10Invoked,
            stat.total.vetos1Invoked,
            stat.total.vetos10Ignored,
            stat.total.vetos1Ignored,

            stat.average.wonPercent,
            stat.average.remaining,
            stat.average.timeWon,
            stat.average.timeLost,
            stat.average.vetos10Invoked,
            stat.average.vetos1Invoked,
            stat.average.vetos10Ignored,
            stat.average.vetos1Ignored,

        ]];
    }, [[
        { v: "Nombre de joueurs", s: { fill: { bgColor: { rgb: "FFFFAA00" } }, font: { bold: true } } },
        "Tactique",
        "Date de calcul",
        "Démarrage optimisé",
        "Veto de 10",
        "Veto de 1",
        "Minimum pour ignorer un veto",
        "Combos de -10",

        "Total gagné",
        "Total perdu <= 5",
        "Total perdu entre 5 et 10",
        "Total perdu > 10",
        "Total vetos 10 invoqués",
        "Total vetos 1 invoqués",
        "Total vetos 10 ignorés",
        "Total vetos 1 ignorés",

        "Moyenne gagné (%)",
        "Moyenne cartes restantes",
        "Moyenne tours gagné",
        "Moyenne tours perdu",
        "Moyenne vetos 10 invoqués",
        "Moyenne vetos 1 invoqués",
        "Moyenne vetos 10 ignorés",
        "Moyenne vetos 1 ignorés",
    ]]);

    const options = {
        '!rows': [
            { hpt: 20 },
        ],
        '!cols': [
            { wch: 17 },
            { wch: 20 },
            { wch: 12 },
            { wch: 18 },
            { wch: 9 },
            { wch: 9 },
            { wch: 25 },
            { wch: 12 },

            { wch: 10 },
            { wch: 15 },
            { wch: 20 },
            { wch: 14 },
            { wch: 22 },
            { wch: 22 },
            { wch: 22 },
            { wch: 22 },

            { wch: 18 },
            { wch: 21 },
            { wch: 20 },
            { wch: 20 },
            { wch: 23 },
            { wch: 23 },
            { wch: 23 },
            { wch: 23 },

        ]
    };

    var buffer = xlsx.build([{ name: "TheGame", data: stats }], options);
    fileDownload(buffer, 'TheGame - Statistiques.xlsx');
}
