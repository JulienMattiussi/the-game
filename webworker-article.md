
Les WebWorkers sont un outil magique qui permet de faire exécuter du code par un navigateur, en arrière plan, sans figer ou ralentir l'exécution de la page.

Ils existent parmi nous depuis la nuit des temps - La première spécification date déjà de 2009 et la dernière a été publiée en septembre 2015 - Mais ils se cachent à nos yeux. Ce pouvoir fait peur. Et mal utilisé ou entre de mauvaises mains, il peut (probablement) mener le web à sa perte. (Ou pire, mener le développeur à la dépression).

Nous allons donc apprendre à les connaitre, et surtout, à s'en servir correctement avec le web moderne et un peu plus spécifiquement avec **React.js.**

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
const wizardHouse = 'gryffondor';
wizard.postMessage({ wizardHouse });
```

Le fichier `my-worker-file.js` va contenir le code du worker. Et il doit simplement faire de même, à savoir écouter et renvoyer des messages. Une fonction `onerror` peut aussi être utilisée, par exemple, pour renvoyer un message spécifique en cas d'erreur d'exécution du worker.
``` js
// my-worker-file.js
/* eslint-disable no-restricted-globals */
self.onmessage = ({data}) => {
    switch(data.wizardHouse) {
        case 'gryffondor':
            postMessage('Expeliarmus');
            return;
        case 'serpentard':
            postMessage('Avada Kedavra');
            return;
        default :
            postMessage('Patronus');
    }
}
self.onerror = (error) => {
    port.postMessage('Pffuuuit');
}
```

> TIPS:  
La référence à `self` n'est pas indispensable, mais l'instruction `no-restricted-globals`, elle, est nécessaire pour autoriser la compilation du script contenant des variables globales.

Avec cette simple mécanique, on peut faire communiquer un worker avec son script appelant. Envoyer des commandes, et obtenir des résultats.

Les messages transmis peuvent être ce que l'on souhaite, des objets, des types primitifs, ...

> TIPS:  
Les fonctions `onmessage` ne font que gérer des évènements.
 On pourrait très bien les remplacer par  
 `addEventListener('message', ({ data }) => { //mon code });`

### Les workers partagés

Pour qu'un worker puisse communiquer des résultats avec plusieurs pages ou composants, il faut juste utiliser un type particulier, le `SharedWorker`.

``` js
// mainFile.js
const myWorker = new SharedWorker('.my-worker-file.js');

wizard.port.onmessage = data => {
    console.log('Envoi du sortilège', data);
}

const wizardHouse = 'gryffondor';
wizard.port.postMessage({ wizardHouse });
```

Cette fois-ci, le worker va accepter une connexion, et communiquer à travers un `port`.

``` js
// my-worker-file.js
/* eslint-disable no-restricted-globals */
let currentHouse = 'poufsouffle';

self.onconnect = event => {
    let port = event.ports[0];
    port.onmessage = ({data}) => {
        if (data.wizardHouse) {
            currentHouse = data.wizardHouse;
        }
        switch(currentHouse) {
            case 'gryffondor':
                port.postMessage('Expeliarmus');
                return;
            case 'serpentard':
                port.postMessage('Avada Kedavra');
                return;
            default :
                port.postMessage('Mutismus');
        }
    }
    onerror = (error) => {
        port.postMessage('Pffuuuit');
    }
}
```

On peut les utiliser, par exemple, lorsque le worker doit conserver des données d'un appel à l'autre.

> TIPS:  
Il est conseillé de contrôler que le navigateur est compatible avec l'API des webWorkers en testant la présence de `window.Worker` ou `window.SharedWorker`.

## Mais comment faire avec Webpack ?

Maintenant, le problème avec la magie, c'est que, comme avec n'importe quelle discipline, il y a toujours un gouffre entre la théorie et la pratique.

Ici, le gouffre se nomme [WebPack](https://webpack.js.org/).

La plupart des projets web modernes utilisent `WebPack` et [Babel](https://babeljs.io/) pour transpiler et bundeliser le code avant de l'envoyer au navigateur.

Mais pour les workers, on doit donner l'URL du code à utiliser au moment de sa construction  
`const wizard = new Worker('./my-worker-file.js');`

Ici, `'./my-worker-file.js'` doit être l'URL du code du worker accessible depuis le navigateur.  
Et lorsqu'on utilise webpack, le fichier`'my-worker-file.js'` n'étant importé dans aucun des script transpilés, cette URL n'existe pas.

Et la magie s'éffondre.

### Une première solution rapide mais incomplète

Il faudrait donc importer notre worker dans la page qui l'exécute.

``` js
import Wizard from './my-worker-file'
```

Bien sur, ça ne suffit pas. Là le code est importé et sera directement exécuté. Et de tout façon, après le build de WebPack, tout sera mis en bundle `./static/js/main.578e6292.chunk.js`
et l'URL de `'my-worker-file.js'` n'existera toujours pas.

On peut alors coder un `WorkerBuilder`

Le code du worker doit être encapsulé dans une fonction

``` js
// my-worker-file.js
/* eslint-disable no-restricted-globals */
export default () => {
    self.onmessage = ({data}) => {
        switch(data.wizardHouse) {
            case 'gryffondor':
                postMessage('Expeliarmus');
                return;
            case 'serpentard':
                postMessage('Avada Kedavra');
                return;
            default :
                postMessage('Patronus');
        }
    }
}
```

puis on créé un WorkerBuilder chargé de générer notre worker

``` js
// worker-builder.js
export default class WorkerBuilder {
	constructor(worker) {
		const code = worker.toString();
		const blob = new Blob([`(${code})()`]);
		return new Worker(URL.createObjectURL(blob));
	}
}
```

Et enfin, on utilise ce `WorkerBuilder` dans la page web pour lancer le worker :

``` js
// mainFile.js
import workerCode from './my-worker-file';
import WorkerBuilder from './worker-builder';

const wizard = new WorkerBuilder(workerCode);

wizard.onmessage = data => {
    console.log('Choix d\'une baguette magique', data);
}
```

Pourtant, le gros problème avec cette méthode, c'est qu'on limite énormément la comptatibilité du code du worker.

Comme ce code est lu à la volée sans passer par le transpileur, il est aujourd'hui impossible d'y utiliser des syntaxes modernes comme le [spread opérator](https://putaindecode.io/articles/es6-es2015-parametres-rest-et-operateur-spread/) ou le [destructuring](https://putaindecode.io/articles/es6-es2015-le-destructuring/).
``` js
const { serpentardWizards, ...goodWizards } = allWizards;
```
Le code ci dessus va juste générer une erreur à l'exécution dans la majorité des navigateurs.

### Une vraie solution pérenne

La solution précédente fonctionne donc un petit peu, mais pas complètement.
En plus, comme le code du worker est empaqueté à la volée au moment de son appel c'est inutilement couteux pour le navigateur.

#### Utiliser Worker Loader

Heureusement, une meilleure solution existe afin que WebPack sache déployer les workers correctement, comme le reste du code.

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

De cette façon, le worker est transpilé par WebPack et servi correctement au navigateur.

### Attention avec Create React App ([CRA](https://github.com/facebook/create-react-app))

Les développeurs React, connaissent bien cet outil qui permet de monter un site en React pret à l'emploi en une seule commande.

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
    return config;
}
```

Et ne pas oublier de modifier les scripts dans le fichier `package.json` pour utiliser `react-app-rewired`.

``` json
// package.json
"scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-scripts eject"
    },
```

#### Utiliser Shared Worker Loader

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

**Pour Create React App (avec `react-app-rewired`)**

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

Attention, les workers permettent de faire beaucoup de chose mais ont certaines limitations.

### Est-ce qu'on peut tout faire avec un worker ?

On a tendance à penser que la magie permet de tout réaliser, mais ce n'est pas le cas en réalité.

Les workers sont totalement détachés de la fenêtre du navigateur.
Il est donc impossible dans un worker d'accéder :

- à l'object `window`
- au `DOM`
- aux API de stockage comme `localstorage`ou `IndexedDb`

Pour effectuer une tâche liée à l'un de ces éléments, il faut que le worker retourne seulement le résultat à afficher

``` js
// in wizard.worker.js
postMessage({ listOfForbiddenSpells });
```

Et c'est la page qui se chargera de l'affichage et de la sauvegarde en réceptionnant les messages du worker.

``` js
// in mainFile.js
wizard.onmessage = ({ listOfForbiddenSpells }) => {
    localstorage.setItem('doNotOpen', listOfForbiddenSpells);
};
```
### Peut-on surveiller l'activité d'un worker ?

Il est parfaitement possible d'appeler la console depuis un **Worker**

``` js
// in wizard.worker.js
console.warn('Vous ne devriez pas demander la liste des sorts interdits');
```

Mais attention, **la console ne fonctionnera pas depuis un SharedWorked**.
Dans ce cas, un appel à `console.log()` ne va pas générer d'erreur mais il ne sera jamais acheminé jusqu'a la console du navigateur.  
`port.console.log()` n'existe pas non plus, et génère cette fois une erreur d'exécution du worker.

### Peut-on interrompre l'activité d'un worker ?

Lorsqu'un sort est lancé, il est très difficile de l'arreter. Mais la possibilité existe néanmoins.

``` js
// in mainFile.js
wizard.terminate();
```

Cette instruction a pour but d'interrompre immédiatement toutes les tâches existantes du worker. **Aucun message d'erreur ne sera envoyé**, le thread sera tout bonnement coupé.

Mais dans la pratique, il ne faut pas s'attendre à ce que le worker s'interrompe sagement à l'instant ou l'instruction `terminate()` est appelée. Le principe de mise en oeuvre des Workers fait qu'il va falloir attendre que le thread du worker accepte le message et le traite, avant d'être interrompu.

Ce temps dépends du code du worker et de l'architecture qui l'exécute. Mais pour avoir un petit ordre de valeur, mes tests ne m'ont pas permis d'interrompre le traitement d'un worker si ce traitement durait **moins de 2 secondes**.

L'expérience est facile à reproduire. En lançant et interrompant immediatement un Worker, on constate que même lorsque la communication avec la page est interrompue, il continue pourtant son travail quelques secondes.

``` js
// in mainFile.js
import WizardWorker from './wizard.worker.js';
const wizard = new WizardWorker();
wizard.onmessage = ({ data }) => {
    console.log(`Toujours en marche (${data}`);
};
wizard.postMessage(`Lance un sort sombre de mangemort`);
wizard.terminate();
```

``` js
// wizard.worker.js
/* eslint-disable no-restricted-globals */
self.onmessage = ({data}) => {
    const start = new Date();
    while (true) {
        const result = Math.random();
        console.log("Personne ne peut arreter Volde..rt /", new Date() - start);
        postMessage(result);
    }
}
```

Pour finir, la fonction `terminate()` n'existe toujours pas sur un **SharedWorker**

En conclusion, si jamais l'interruption d'un worker est nécessaire, il faut surtout s'assurer d'ignorer proprement son résultat dans `mainFile.js` car le traitement propre du worker a toutes les chances de continuer encore quelques secondes après envoi du signal `terminate()`.

## Risques et solutions (si possible)

### Attention au hot-reload

Une chose importante à savoir pendant la phase de développement, c'est que comme les sources des workers sont compilés, chargés et exécutés séparément des sources des pages, ils sont insensibles au [hot-reload](https://stackoverflow.com/questions/41428954/what-is-the-difference-between-hot-reloading-and-live-reloading-in-react-native).

Donc, malheureusement, à chaque fois que l'on change le code d'un fichier `.worker.js` ou `.sharedworker.js`, il faut rebooter le server de développement pour voir l'impact à l'exécution. Un reset des données du cache du navigateur seul n'a aucun impact. 

Note qu'il est possible qu'une stack différente de celle proposée ici (`create-react-app`, `react-app-rewired`, `worker-loader`) fournisse une solution efficace à ce problème. Mais la magie reste encore entière pour moi pour l'instant.

> TIPS:  
Les workers contruits avec la méthode `URL.createObjectURL(blob)` étant générés à la volée, ils ne posent aussi soucis de cache

### Attention au states non persistants

En React, la gestion des `states` à travers des évènements `onmessage` peut provoquer des surprises.
L'exemple si dessous montre que les deux compteurs de sorts commencent à afficher des résultats différents lorsqu'on lance trop de workers de sorts simultanéments.

``` js
// in mainFile.js
import React, { useState } from 'react';
import WizardWorker from './c';
const ShowTotalSpellCast = props => {
    const [counterA, setCounterA] = useState(0);
    const [counterB, setCounterB] = useState(0);

    const wizard = new WizardWorker();
    wizard.onmessage = ({ data }) => {
        setCounterA(previous => previous + 1);
        setCounterB(counterB + 1);
    };

    const runSpell = () => {
        wizard.postMessage('serdaigle');
    };

    return (
        <div>
            <div>
                <button onClick={runSpell}>Lancer un sortilèges</button>
            </div>
            <div>
                <span>Nombre de sortilèges lancés A :</span>
                <span>{counterA}</span>
            </div>
            <div>
                <span>Nombre de sortilèges lancés B :</span>
                <span>{counterB}</span>
            </div>
        </div>
    );
}
```
Le compteur A est toujours juste. Et le compteur B est vite à la traine.

``` js
setCounterB(counterB + 1);
```

La valeur de `counterB` est incrémentée à partir de sa dernière valeur lue dans la portée de la fonction `onmessage`.
Et cette valeur est toujours celle que la variable `counterB` avait au moment ou le thread du worker à été démarré.
Deux workers qui travaillent en même temps vont alors avoir la même valeur initiale, donc la même valeur finale. Et la composant va ignorer le travail du premier qui a fini en l'écrasant par le résultat du second.

Pour garantir qu'une variable est bien toujours incrémentée en partant de sa dernière valeur, il faut utiliser le `previousState` intégré dans le hook de `React.useState()` et jamais la valeur lue dans la portée de l'évenement `onmessage`

``` js
setCounterA(previous => previous + 1);
```


### Attention aux workers démoniaques

Serait-il possible de créer un worker qui effectuerai ses calculs sans jamais s'arreter de l'ouverture d'un site jusqu'a la fermeture du navigateur. Un sorcier discret qui utiliserai la puissance de calcul de son visiteur, caché dans l'ombre, pour effectuer des tâches répréhensibles.

Deux méthodes peuvent être envisagées : 

- Une seule instance en boucle infinie

``` js
// dark-wizard-loop.worker.js
/* eslint-disable no-restricted-globals */
self.onmessage = ({data}) => {
    while (true) {
        // compute something
        port.postMessage(result);
    }
}
```

``` js
// in mainFile.js
import DarkWizardWorker from './dark-wizard-loop.worker.js';

const wizard = new DarkWizardWorker();
wizard.onmessage = ({ data }) => {
    // use data
};
postMessage.('Démarre une tâche et ne t\'arrete jamais');
```

- Des instances multiples qui se relancent constamment

``` js
// dark-wizard-repeat.worker.js
/* eslint-disable no-restricted-globals */
self.onmessage = ({data}) => {
    // compute something
    postMessage(result);
}
```

``` js
// in mainFile.js
import DarkWizardWorker from './dark-wizard-repeat.worker.worker.js';

const wizard = new DarkWizardWorker();
wizard.onmessage = ({ data }) => {
    // use data
    postMessage.('Recommence jusqu\'a la fin des temps');
};
postMessage.('Fais une premiere tâche');
```

On peut avec ce genre de méthodes planter relativement rapidement la navigateur.
Ce plantage correspond, visiblement, à la limite atteinte du cache mémoire qui sert à l'exécution des thread des workers. Pas de message explicite à espérer, juste quelque chose du type "Chrome à rencontré une erreur".

D'une certaine façon, c'est donc rassurant. Oui un worker mal codé ou mal intentionné peut essayer de faire travailler votre ordinateur à votre insu, et sans rien y installer, mais il sera automatiquement arreté dans ses agissement assez vite.

## Conclusion

Maintenant la magie n'a plus de secrets pour vous (ou nettement moins j'espère).

On aura retenu essentiellement que les workers sont un outil bien pratique quand on sait les mettre en oeuvre correctement. Ils ne sont pas pour autant la solution miracle à toutes les problématiques car ils ont leurs failles et leurs limites.

Voilà, comme souvent, la magie n'est ni bonne bonne, ni mauvaise. C'est juste un outil de plus a comprendre. N'hésitez pas a creuser le sujet sur les sites plus détaillés si vous voulez devenir un magicien hors pair.

## Références

- Les spécifications officielles des web workers sont sur [le site du W3C](https://www.w3.org/TR/workers/).

- Wikipédia donne un bon [descriptif des webworkers](https://en.wikipedia.org/wiki/Web_worker) sans rentrer dans les détails techniques.

- L'utilisation basique des web workers est très bien expliquée sur [developer.mozilla.org](https://developer.mozilla.org/fr/docs/Web/API/Web_Workers_API) qui décrit l'API dans ses moindre détails.

- La méthode d'utilisation des workers à la volée en React est bien décrite dans [cet article de fullstackreact](https://www.fullstackreact.com/articles/introduction-to-web-workers-with-react/) avec une [démo complète](https://codesandbox.io/s/w2v7zzn63w).
