import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import logo from './assets/thegame.jpeg';
import './App.css';
import Stats from './Stats/Stats';
import Strategies from './Strategies/Strategies';
import Game from './Game/Game';


function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/">
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <p>
                                The game
                            </p>
                        </header>
                        <Stats />
                    </Route>
                    <Route path="/game">
                        <Game />
                    </Route>
                    <Route path="/strategies">
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <p>
                                The game
                            </p>
                        </header>
                        <Strategies />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
