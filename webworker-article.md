
Les WebWorkers sont un outil magique

## La base pour utiliser un worker

### Les worker simples

Sur le principe, la création d'un worker est d'une simplicité enfantine. Il suffit d'appeler un constructeur, puis de lui attacher un évènement.

``` js
// mainFile.js
const wizard = new Worker('./my-worker-file.js');

wizard.onmessage = data => {
    console.log('Envoi du sortilège', data);
}
```

Pour déclencher le worker, on lui envoie ensuite un message :

``` js
// mainFile.js
const wizardHouse = 'grifondor';
wizard.postMessage({ wizardHouse });
```

Le fichier `my-worker-file.js` va contenir le code du worker. Et il doit simplement faire de même, soit écouter et renvoyer des messages.

``` js
// my-worker-file.js
self.onmessage = ({data}) => {
    switch(data.wizardHouse) {
        case 'grifondor':
            postMessage('Expeliarmus');
            return;
        case 'serpentar':
            postMessage('Avada Kedavra');
            return;
        default :
            postMessage('Patronus');
    }
}
```

Avec cette simple mécanique, on peut faire communiquer un worker avec son script appelant. Envoyer des commandes, et obtenir des résultats.

Les messages transmis peuvent être ce que l'on souhaite, des objets, des types primitifs, ...

> TIPS:  
Les fonctions `onmessage` ne font que gérer des évènements.
 On pourrait très bien les remplacer par  
 `addEventListener('message', ({ data }) => { //mon code });`

### Les workers partagés

Pour qu'un worker puisse communiquer des résultats avec plusieurs pages / éléments, il faut juste utiliser un type particulier, le `SharedWorker`.

``` js
// mainFile.js
const myWorker = new SharedWorker('.my-worker-file.js');

wizard.port.onmessage = data => {
    console.log('Envoi du sortilège', data);
}

const wizardHouse = 'grifondor';
wizard.port.postMessage({ wizardHouse });
```

Cette fois-ci, le worker va accepter une connexion, et communiquer à travers un `port`.

``` js
// my-worker-file.js
let currentHouse = 'poufsouffle';

self.onconnect = event => {
    let port = event.ports[0];
    port.onmessage = ({data}) => {
        if (data.wizardHouse) {
            currentHouse = data.wizardHouse;
        }
        switch(currentHouse) {
            case 'grifondor':
                port.postMessage('Expeliarmus');
                return;
            case 'serpentar':
                port.postMessage('Avada Kedavra');
                return;
            default :
                port.postMessage('Crac badaboum');
        }
    }
}
```

On peut les utiliser, par exemple, lorsque le worker doit conserver des données d'un appel à l'autre.

## Comment faire avec webpack et/ou CRA

### Solution rapide et sale

new Blog
URl_from_Object()

mais pas possiblité de déconstruct  [...]
et build du code à la volée

### Solution pérenne

## worker-loader

``` js
// config-overrides.js
module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
    });
    //config.output['globalObject'] = 'this';
    return config;
}
```


## shared-worker-loader

``` js
// config-overrides.js
module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
    });
    config.module.rules.push({
        test: /\.sharedworker\.js$/,
        use: { loader: 'shared-worker-loader' }
    });
    //config.output['globalObject'] = 'this';
    return config;
}
```

react-reweind

## Limitations

import ok mais

Pas de window
Pas d'accès aux données, ni de DOM


Il faut attendre que le worker rende la main

## Risques et solutions (si possible)


### Attention au hot reload

### Attention au states non persistants

setState (previous => new+Previous;)


### Saturation du browser
