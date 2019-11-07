import React from 'react';
import styled from '@emotion/styled';
import { colors, getBorderRadius, LEFT, RIGHT } from '../theme';

const style = ({ position }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '250px',
    textAlign: 'center',
    borderRadius: getBorderRadius(position),
    padding: 10,
    margin: '10px 0',
    backgroundColor: position === RIGHT
        ? colors.blueTransparency
        : colors.whiteTransparency,
});

const StyledDiv = styled.div(props => style(props));

const Zone = ({ children, position }) => (
    <StyledDiv position={position}>
        {children}
    </StyledDiv>
)


export { LEFT, RIGHT };

export default Zone;
