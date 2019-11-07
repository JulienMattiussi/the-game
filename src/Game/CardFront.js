import React from 'react';
import styled from '@emotion/styled';
import { colors } from '../theme';
import Card from './Card';

const TOP = 'top';
const BOTTOM = 'bottom';

const styleEdge = ({ position }) => {
    const transform = 'rotateZ(180deg)';

    const basicStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 2,
        width: 'calc(100% - 4px)',
    }

    if (position === BOTTOM) {
        return { ...basicStyle, transform }
    }
    return basicStyle
};

const StyledEdge = styled.div(props => styleEdge(props));

const StyledFilledEdge = ({ value, position }) =>
    <StyledEdge position={position}>
        <span>{value}</span>
        <span>{value}</span>
    </StyledEdge>

const styleMiddle = ({ startOne, start100 }) => {
    const transform = 'rotateZ(45deg)';

    const startOneColor = colors.cardTextStartOne;
    const start100Color = colors.cardTextStart100;

    const basicStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 'auto',
        fontWeight: 'bolder',
        fontSize: '50px',
    }

    if (startOne || start100) {
        return { ...basicStyle, transform, color: startOne ? startOneColor : start100Color }
    }

    return basicStyle;
}

const StyledMiddle = styled.div(props => styleMiddle(props));

const CardFront = ({ value, clickable, selected, handleClick }) => {
    return (
        <Card clickable={clickable} selected={selected} handleClick={handleClick}>
            <StyledFilledEdge value={value} position={TOP} />
            <StyledMiddle startOne={value === 1} start100={value === 100}>
                {value}
            </StyledMiddle>
            <StyledFilledEdge value={value} position={BOTTOM} />
        </Card>)
}

export default CardFront;
