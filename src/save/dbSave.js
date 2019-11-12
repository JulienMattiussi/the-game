import { BEST, WORST } from '../model/strategy';
import {
    STAT_PREFIX, STRATEGY_PREFIX, appendStatToSave, getKeyForStat
} from './saveTools';

const storage = localStorage;
const request = window.indexedDB.open("TheGameDB");
let db;
request.onerror = function (event) {
    console.log("Error", event);
};
request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Success", event);
};
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("statistics", { keyPath: "key" });
    db.createObjectStore("strategies", { keyPath: "key" });
}

export const saveStat = (stat, reset = false) => {
    const key = getKeyForStat(stat);
    const statToSave = reset ? stat : appendStatToSave(key, stat);
    var transaction = db.transaction(["statistics"], "readwrite");
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };
    var objectStore = transaction.objectStore("statistics");
    var request = objectStore.add({ key, ...statToSave });
    request.onsuccess = function (event) {
        console.log("Saved!");
    };
}

export const getStat = key => {
    const request = window.indexedDB.open("TheGameDB");
    request.onerror = function (event) {
        console.log("Error", event);
    };
    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("Success", event);

        var transaction = db.transaction(["statistics"]);
        var objectStore = transaction.objectStore("statistics");
        var request = objectStore.get(key);
        request.onerror = function (event) {
            console.log("Get failed!", event);
        };
        request.onsuccess = function (event) {
            console.log("Get Successed!", event.target.result);
        };
    };
    const stat = 'undefined';
    return stat && stat !== 'undefined' ? JSON.parse(stat) : null;
}

export const getAllStatKeys = () =>
    Object.entries(storage).filter(key => key[0].startsWith(STAT_PREFIX));

export const getStrategy = (nbPlayers, choice) => {
    const strat = storage.getItem(`${STRATEGY_PREFIX}${nbPlayers}-${choice}`);
    return strat && strat !== 'undefined' ? JSON.parse(strat) : null;
}

export const saveStrategy = (strategy, nbPlayers, choice) => {
    var transaction = db.transaction(["strategies"], "readwrite");
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };
    var objectStore = transaction.objectStore("strategies");
    var request = objectStore.add({ key: `${STRATEGY_PREFIX}${nbPlayers}-${choice}`, ...strategy });
    request.onsuccess = function (event) {
        console.log("Saved!");
    };
}

const clearStrategy = (nbPlayers) => {
    var objectStore = db.transaction(["strategies"], "readwrite")
        .objectStore("strategies");
    var requestBest = objectStore.delete(`${STRATEGY_PREFIX}${nbPlayers}-${BEST}`);
    var requestWorst = objectStore.delete(`${STRATEGY_PREFIX}${nbPlayers}-${WORST}`);
    requestBest.onsuccess = function (event) {
        console.log("Deleted!");
    };
    requestWorst.onsuccess = function (event) {
        console.log("Deleted!");
    };
}

const clearStatByKey = key => {
    var request = db.transaction(["statistics"], "readwrite")
        .objectStore("statistics")
        .delete(key);
    request.onsuccess = function (event) {
        console.log("Deleted!");
    };
}

export const clearStat = stat => {
    clearStatByKey(getKeyForStat(stat));
}

export const clearAllStats = (nbPlayers) => {
    if (!nbPlayers) {
        storage.clear();
        return;
    }
    const statKeys = getAllStatKeys();
    statKeys.map(key => {
        const statKey = key[0];
        const stat = getStat(statKey);
        if (stat && stat.numberOfPlayers === nbPlayers) {
            storage.removeItem(statKey);
        }
        return true;
    });
    clearStrategy(nbPlayers);
}
