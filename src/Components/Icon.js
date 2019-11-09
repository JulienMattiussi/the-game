import React from 'react';
import styled from '@emotion/styled';
import { colors, borderRadius } from '../theme';

const style = ({ clickable, alert }) => ({
    cursor: clickable ? 'pointer' : 'inherit',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    width: 14,
    height: 14,
    fontSize: 'small',
    borderRadius,
    padding: 2,
    margin: 0,
    '&:hover': {
        backgroundColor: alert ? colors.alert : colors.blueTransparency,
        color: alert ? colors.white : 'inherit',
    }
});

const StyledIcon = styled.span(props => style(props));

const Icon = ({ label, tooltip, handleClick, alert }) => (
    <StyledIcon alert={alert} clickable={!!handleClick} title={tooltip} onClick={handleClick}>
        {label}
    </StyledIcon>
)

export default Icon;
