import React from 'react';
import styled from '@emotion/styled';
import { colors, borderRadius } from '../theme';
import './Card.css';

const style = ({ clickable, selected }) => {
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

const StyledCard = styled.div(props => style(props));

const Card = ({ value, clickable, selected, onClick }) => {
    return (
        <StyledCard clickable={clickable} selected={selected} onClick={onClick}>
            <div className="CardTop">
                <span>
                    {value}
                </span>
                <span>
                    {value}
                </span>
            </div>
            <span className={`CardMiddle${
                value === 1 ?
                    ' StartOne' :
                    value === 100 ?
                        ' Start100' :
                        ''
                } `}>
                {value}
            </span>
            <div className="CardBottom">
                <span>
                    {value}
                </span>
                <span>
                    {value}
                </span>
            </div>
        </StyledCard>)
}

export default Card;
