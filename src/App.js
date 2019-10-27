import React from 'react';
import logo from './assets/thegame.jpeg';
import './App.css';
import Stats from './Stats/Stats';


function App() {
    /* const game = initGame();
    console.log(game);
    const endGame = playFullGame(game, simpleTactic);
    console.log(endGame);
    console.log('Won : ', endGame.won ? true : !endGame.lost);
    console.log('Remaining cards : ', getRemainingCards(endGame));
    console.log('Turns : ', endGame.time); */

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    The game
                </p>
            </header>
            <Stats />
        </div>
    );
}

export default App;
