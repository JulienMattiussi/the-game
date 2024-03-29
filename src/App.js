import React from 'react';
import styled from '@emotion/styled';
import { Global } from '@emotion/core';
import { I18n } from 'react-polyglot';
import localeFile from './localeFile';
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

const locale = window.locale || 'fr';
const messages = localeFile;

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

const App = () =>
    <div>
        <Global
            styles={{
                'body': {
                    backgroundColor: colors.backGround,
                }
            }}
        />
        <I18n locale={locale} messages={messages}>

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
        </I18n>
    </div>

export default App;
