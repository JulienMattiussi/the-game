import React from 'react';
import styled from '@emotion/styled';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { colors } from './theme';
import { Logo } from './Components';
import Statistics from './Statistics/Statistics';
import Strategies from './Strategies/Strategies';
import Game from './Game/Game';

const styleHeader = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    minHeight: '8vh',
    fontSize: 'calc(10px + 2vmin)',
    color: colors.white,
};

const StyledHeader = styled.header(styleHeader);

const Header = () =>
    <StyledHeader>
        <Logo />
        <p>The game Analyser</p>
    </StyledHeader>

const styleGlobal = {
    backgroundColor: colors.backGround,
}

const StyledGlobal = styled.div(styleGlobal);

const App = () =>
    <StyledGlobal>
        <Router>
            <Switch>
                <Route exact path="/">
                    <Header />
                    <Statistics />
                </Route>
                <Route path="/game">
                    <Game />
                </Route>
                <Route path="/strategies">
                    <Header />
                    <Strategies />
                </Route>
            </Switch>
        </Router>
    </StyledGlobal>

export default App;
