## Utilisation de base

### new Worker()


### new SharedWorker()

## Comment faire avec webpack et/ou CRA

### Solution rapide et sale

new Blog
URl_from_Object()

mais pas possiblité de déconstruct  [...]
et build du code à la volée

### Solution pérenne

worker-loader
shared-worker-loader

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
