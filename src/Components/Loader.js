import React from 'react';
import styled from '@emotion/styled';
import { colors, borderRadius } from '../theme';

const style = {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius,
    padding: '0 10px',
    margin: 0,
    backgroundColor: colors.whiteTransparency,
};

const StyledDiv = styled.div(style);

const Loader = () => (
    <StyledDiv>
        LOADING
    </StyledDiv>
)

export default Loader;
