import React from 'react';
import styled from '@emotion/styled';
import { colors, borderRadius } from '../theme';

const style = {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius,
    padding: 10,
    margin: '10px 0',
    backgroundColor: colors.whiteTransparency,
};

const StyledDiv = styled.div(props => style(props));

const Loader = () => (
    <StyledDiv>
        LOADING
    </StyledDiv>
)

export default Loader;
