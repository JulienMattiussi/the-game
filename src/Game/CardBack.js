import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core'
import { colors } from '../theme';
import Card from './Card';

const pluralise = value => value > 1 ? 's' : '';

const styleBack = css({
    color: colors.cardBackText,
    backgroundColor: colors.cardBack,
    justifyContent: 'center',
    fontWeight: 'bolder',
});

const StyledBack = styled(Card)(styleBack);

const styleNumber = {
    margin: '0 auto',
    fontSize: '30px',
};

const StyledSpan = styled.span(styleNumber);

const StyledNumber = ({ value }) =>
    <StyledSpan>
        {value}
    </StyledSpan>

const CardBack = ({ value, clickable, selected, handleClick }) => {
    return (
        <StyledBack clickable={clickable} selected={selected} handleClick={handleClick}>
            {value != null &&
                <Fragment>
                    <StyledNumber value={value} />
                    Carte{pluralise(value)} restante{pluralise(value)}
                </Fragment>
            }
        </StyledBack>)
}

export default CardBack;
