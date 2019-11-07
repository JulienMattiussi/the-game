import React from 'react';
import styled from '@emotion/styled';
import { colors, borderRadius } from '../theme';

const styleCard = ({ clickable, selected }) => {
    const selectedStyle = {
        backgroundColor: colors.cardFrontSelected,
        color: colors.cardTextSelected,
        cursor: 'pointer',
    }

    const clickableStyle = {
        '&:hover': {
            backgroundColor: colors.cardFrontClickable,
            color: colors.cardTextClickable,
            cursor: 'pointer',
        }
    }

    const basicStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: 80,
        height: 140,
        border: 'solid black 1px',
        borderRadius,
        backgroundColor: colors.cardFront,
        cursor: 'inherit',
    };

    return selected
        ? ({ ...basicStyle, ...selectedStyle })
        : clickable
            ? ({ ...basicStyle, ...clickableStyle })
            : basicStyle;
};

const StyledCard = styled.div(props => styleCard(props));

const Card = ({ className, value, clickable, selected, children, handleClick }) => {
    return (
        <StyledCard className={className} clickable={clickable} selected={selected} onClick={handleClick}>
            {children}
        </StyledCard>)
}

export default Card;
