const locale = {
    link_statistics: "Retour aux statistiques",
    link_strategies: "Voir les stratégies",

    button_strategies: "Recalculer les meilleures stratégies",
    button_export_stats: "Exporter les statistiques",
    button_stactistics: "Lancer les statistiques",
    button_play_next: "Jouer le prochain tour",
    button_play_to_end: "Jouer tous les tours des IA",
    button_restart: "Recommencer",
    button_see_detailled_game: "Revoir cette partie",
    button_play_game: "Faire une partie",
    button_play_game_3: "à 3",
    button_play_game_4: "à 4",
    button_play_game_5: "à 5",

    form_tactic: "Tactique",
    form_better_starter: "Optimiser le démarrage",
    form_veto10: "Annoncer les veto quand une réduction de 10 est possible",
    form_veto1: "Annoncer les veto quand la carte suivante est disponible",
    form_minimum_gain_to_force: "Valeur minimum de gain pour outrepasser un veto",
    form_play_combos: "Jouer les combos de -10",

    form_nb_games: "Nombre de parties",
    form_nb_players: "%{key} joueurs",

    goesUpPile: "PILE MONTANTE",
    goesDownPile: "PILE DESCENDANTE",

    history_title: "HISTORIQUE (%{turnsNumber} tours)",

    confirm_delete: "Confirmez la suppression",
    reinit_stat: 'Réinitialiser cette statistique',

    play: 'joue',
    in: 'en',
    on: 'sur',
    ask_for: 'demande un',
    veto: 'VETO',

    lock: "Verrou",

    unknown: "LA ?",
    best: "LA MEILLEURE",
    worst: "LA PIRE",
    unknown_value: "LA ? - %{computedTx}%",
    best_value: "LA MEILLEURE - %{computedTx}%",
    worst_value: "LA PIRE - %{computedTx}%",

    average: "MOYENNE",
    total: "TOTAL",

    yes: "Oui",
    no: "Non",
    never: "jamais",

    won: "GAGNE !!!",
    lost: "PERDU ...",

    remaning_cards: "Carte%{s} restante%{s}",
    turns: "Tours",
    player: "Joueur %{number}",

    statistic_title_global: "Cumul pour %{numberOfGames} parties",
    statistic_title: "Pour %{numberOfPlayers} joueurs (%{numberOfGames} parties)",
    statistic_won: "Gagné",
    statistic_lost_remaining: "Perdu %{range} restantes",
    statistic_number_winning_turn: "Nombre Tours Gagnants",
    statistic_number_loosing_turn: "Nombre Tours Perdants",
    statistic_date_title: "Calculé il y a",
    statistic_veto10: "Veto de 10 invoqués",
    statistic_veto1: "Veto de 1 invoqués",
    statistic_veto10_ignored: "Veto de 10 ignorés",
    statistic_veto1_ignored: "Veto de 1 ignorés",

    strategy_title: "Strategie pour %{nbPlayers} joueurs",
    strategy_nb_games_title: "Calculée sur",
    strategy_nb_games_value: "%{numberOfGames} parties",
    strategy_date_title: "Déterminé il y a",
    strategy_veto10: "Annoncer les vétos de -10",
    strategy_veto1: "Annoncer les vétos de +1",
    strategy_minimum_gain_to_force: "Valeur de gain minimum",
    strategy_play_combos: "Combos de -10",

    mininumCards_description: "Joue toujours le nombre minimum de cartes autorisé.",
    threeBestCards_description: `Joue jusqu'a 3 cartes maximum
tant qu'il lui reste des -10 ou des +1.`,
    allBestCards_description: `Joue toutes les cartes possibles
tant qu'il lui reste des -10 ou des +1.`,
    allBestCardsUntilEmpty_description: `Joue toutes les cartes possibles
tant qu'il lui reste des -10 ou des +1
et tant qu'il reste des cartes sur la pioche.

Puis ne joue plus qu'une carte à la fois.`,
    play_combos_description: ` Si le joueur à dans sa main un combo de -10
(par exemple 12 et 22)
Il va les jouer pour réduire les gains
Poser 22 sur 18, puis 12 sur 22, ce qui donne un gain de -6`,

    better_starter_description: "Le joueur qui commence est celui qui possède la carte avec le plus faible gain.",
    veto10_description: `Un joueur va demander aux autres d'éviter de jouer
sur une pile s'il possède la carte de -10 qui va dessus.`,
    veto1_description: `Un joueur va demander aux autres d'éviter de jouer
sur une pile s'il possède la carte de +1 qui va dessus.

Remarque : Si un joueur possède la carte -10 pour cette
pile, il ignorera ce Véto.`,
    minimumGainToForceVeto_description: `Le joueur va ignorer le Véto demandé sur une pile par
un autre joueur si celà l'oblige à jouer une carte ayant
un gain supérieur à %{gain}.

Remarque : Dans tous les cas, le joueur ignore le Veto
s'il possède la carte -10 pour cette pile.
Cette option n'a d'effet qu'en activant les veto de carte suivante.`,

}

export default locale;
