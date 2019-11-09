import React from 'react';
import styled from '@emotion/styled';
import logo from '../assets/thegame.jpeg';

const style = {
    height: '25vmin',
};

const StyledImg = styled.img(style);

const Logo = () => (
    <StyledImg src={logo} alt="logo" />
)

export default Logo;
