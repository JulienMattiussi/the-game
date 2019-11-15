
Les WebWorkers sont un outil magique qui permet de faire exécuter du code par un navigateur, en arrière plan, sans figer ou ralentir l'exécution de la page.

Ils existent parmi nous depuis la nuit des temps - La première spécification ne date déjà de 2009 et la dernière a été publiée en septembre 2015 - Mais ils se cachent à nos yeux. Ce pouvoir fait peur. Et mal utilisé ou entre de mauvaises mains, il peut (probablement) mener le web à sa perte. (Ou pire, mener le développeur à la dépression)

Nous allons donc apprendre à les connaitre, et surtout, à s'en servir correctement avec le web moderne.

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
                port.postMessage('Mutismus');
        }
    }
}
```

On peut les utiliser, par exemple, lorsque le worker doit conserver des données d'un appel à l'autre.

> TIPS:  
Il est conseillé de contrôler que le navigateur est compatible avec l'API des webWorkers en testant la présence de `window.Worker` ou `window.SharedWorker`

## Mais comment faire avec Webpack ?

Maintenant, le problème avec la magie, c'est que, comme avec n'importe quelle discipline, il y a toujours un gouffre entre la théorie et la pratique.

Ici, le gouffre se nomme [WebPack](https://webpack.js.org/).

La plupart des projets web modernes utilisent WebPack et [Babel](https://babeljs.io/) pour transpiler et bundeliser le code avant de l'envoyer au navigateur.



### Une première solution rapide et sale

new Blog
URl_from_Object()

mais pas possiblité de déconstruct  [...]
et build du code à la volée

### Une solution pérenne

La solution précédente fonctionne un peu, mais pas complètement.
En plus, elle a l'inconvénient de builder le code du worker à la volée au moment de son appel ce qui est inutilement couteux pour le navigateur.

### Utiliser Worker Loader

Heureusement, une meilleure solution existe, afin que WebPack sache déployer les workers correctement, comme le reste du code.

Il faut juste installer un petit utilitaire qui vient compléter Webpack :
[ worker-loader](https://github.com/webpack-contrib/worker-loader)

Avec un minimum de configuration :

``` js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  }
}
```

Il faut ensuite bien nommer tous les fichier de worker en `myfile.worker.js`. Puis il y a juste à remplacer l'appel au constructeur standard :

``` js
const wizard = Worker('./wizard.worker.js')
```
 par ceci :

``` js
import WizardWorker from './wizard.worker.js';

const wizard = new WizardWorker();
```

De cette façon, le worker est transpilé par WebPack et servi correctement au navigateur

### Attention avec Create React App ([CRA](https://github.com/facebook/create-react-app))

Les développeurs React, dont je suis, connaissent bien cet outil qui permet de monter un site en React pret à l'emploi en une seule commande.

Mais dans ce cas, tout est packagé, et il est impossible de modifier le fichier `webpack.config.js`.

Pour utiliser `worker-loader`, il faut alors 
- Soit éjecter `create-react-app`

``` bash
npm run eject
```

Ce que [déconseille grandement la communauté](https://medium.com/curated-by-versett/dont-eject-your-create-react-app-b123c5247741), et les concepteurs même de CRA

- Soit installer [`react-app-rewired`](https://github.com/timarney/react-app-rewired)

Cet outil (magique également) sert à surcharger la configuration de base imposée dans `CRA`.

Il faut créer un fichier `config-overrides.js` à la racine du projet, qui va contenir notre configuration pour WebPack :

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

Et ne pas oublier de modifier les scripts dans le fichier `package.json` pour utiliser `react-app-rewired`.

``` json
//package.json
"scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-scripts eject"
    },
```

## Utiliser Shared Worker Loader

Tout celà fonctionne très bien pour les **Worker**, mais quid des **SharedWorker** ?

Là encore, un utilitaire existe : [shared-worker-loader](https://github.com/mrtnbroder/shared-worker-loader#readme)

Il est basé sur `worker-loader` est s'installe, se configure et s'utilise de la même façon. On peut donc l'ajouter à notre projet.

**Pour WebPack standard**

``` js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.sharedworker\.js$/,
        use: { loader: 'shared-worker-loader' }
      }
    ]
  }
}
```

**Pour Create React App (avec `react-rewired`)**

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

Il faudra nommer tous les fichier de worker partagés en `myfile.sharedworker.js`. Puis remplacer l'appel au constructeur standard :

``` js
const wizard = SharedWorker('./wizard.sharedworker.js')
```
 par ceci :

``` js
import WizardWorker from './wizard.sharedworker.js';

const wizard = new WizardWorker();
```

## Limitations

import ok mais

Pas de window
Pas d'accès aux données, ni de DOM


Il faut attendre que le worker rende la main
monWorker.terminate();

## Risques et solutions (si possible)


### Attention au hot-reload

Un truc important à savoir pendant la phase de développement, c'est que comme les workers sont chargés et exécutés dans le navigateur, ils sont insensible au hot-reload.

Donc, malheureusement, à chaque fois que l'ont change le code d'un fichier `.worker.js` ou `.sharedworker.js`, il faut faire un reset des données du cache du navigateur pour voir les changements tourner.

- Soit en vidant le cache par la commande du navigateur
- Soit en 

### Attention au states non persistants

setState (previous => new+Previous;)


### Saturation du browser

## Références

https://www.w3.org/TR/workers/
https://en.wikipedia.org/wiki/Web_worker
https://developer.mozilla.org/fr/docs/Web/API/Web_Workers_API
