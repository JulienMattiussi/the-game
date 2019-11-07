import React from 'react';
import styled from '@emotion/styled';
import { colors, getBorderRadius } from '../theme';

const style = ({ position }) => ({
    fontWeight: 'bolder',
    width: '250px',
    textAlign: 'center',
    borderRadius: getBorderRadius(position),
    padding: 10,
    margin: '10px 0',
    backgroundColor: colors.darkGrey,
    color: colors.whiteTransparency,
});

const StyledSpan = styled.span(props => style(props));

const TitleZone = ({ title, position }) => (
    <StyledSpan position={position}>
        {title}
    </StyledSpan>
)

export default TitleZone;
