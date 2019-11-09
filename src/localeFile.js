const locale = {
    link_statistics: "Retour aux statistiques",
    link_strategies: "Voir les stratégies",

    button_strategies: "Recalculer les meilleures stratégies",
    button_stactistics: "Lancer les statistiques",
    button_play_next: "Jouer le prochain tour",
    button_play_to_end: "Jouer tous les tours des IA",
    button_restart: "Recommencer",
    button_see_detailled_game: "Revoir cette partie",
    button_play_game_4: "Faire une partie à 4",

    form_tactic: "Tactique",
    form_better_starter: "Optimiser le démarrage",
    form_veto10: "Annoncer les veto quand une reduction de 10 est possible",
    form_veto1: "Annoncer les veto quand la carte suivante est disponible",
    form_minimum_gain_to_force: "Valeur minimum de gain pour outrepasser un veto",

    form_nb_games: "Nombre de parties",
    form_nb_players: "%{key} joueurs",

    goesUpPile: "PILE MONTANTE",
    goesDownPile: "PILE DESCENDANTE",

    history_title: "HISTORIQUE (%{turns} tours)",

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

    strategy_title: "Strategie pour %{nbPlayers} joueurs",
    strategy_nb_games_title: "Calculée sur",
    strategy_nb_games_value: "%{numberOfGames} parties",
    strategy_date_title: "Déterminé il y a",
    strategy_veto10: "Annoncer les vétos de -10",
    strategy_veto1: "Annoncer les vétos de +1",
    strategy_minimum_gain_to_force: "Valeur de gain minimum",

    mininumCards_description: "Joue toujours le nombre minimum de cartes autorisé.",
    threeBestCards_description: `Joue jusqu'a 3 cartes maximum
tant qu'il lui reste des -10 ou des +1.`,
    allBestCards_description: `Joue toutes les cartes possibles
tant qu'il lui reste des -10 ou des +1.`,
    allBestCardsUntilEmpty_description: `Joue toutes les cartes possibles
tant qu'il lui reste des -10 ou des +1
et tant qu'il reste des cartes sur la pioche.

Puis ne joue plus qu'une carte à la fois.`,

    better_starter_description: "Le joueur qui commence est celui qui possède la carte avec le plus faible gain.",
    veto10_description: `Un joueur va demander aux autres d'éviter de jouer
sur une pile s'il possède la carte de -10 qui va dessus.`,
    veto1_description: `Un joueur va demander aux autres d'éviter de jouer
sur une pile s'il possède la carte de +1 qui va dessus.

Remarque : Si un joueur possède la carte -10 pour cette
pile, il ignorera ce Véto.`,
    minimumGainToForceVeto_description: `Le joueur va ignorer le Véto demandé sur une pile par
un autre joueur si celà l'oblige à jouer une carte ayant 
un gain supérieur à %{gain}.`,

}

export default locale;
