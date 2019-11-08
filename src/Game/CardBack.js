import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core'
import { translate } from 'react-polyglot';
import { colors } from '../theme';
import Card from './Card';

const pluralise = value => value > 1 ? 's' : '';

const styleBack = css({
    color: colors.cardBackText,
    backgroundColor: colors.cardBack,
    justifyContent: 'center',
    fontWeight: 'bolder',
    textAlign: 'center',
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

const CardBack = ({ t, value, clickable, selected, handleClick }) => {
    return (
        <StyledBack clickable={clickable} selected={selected} handleClick={handleClick}>
            {value != null &&
                <Fragment>
                    <StyledNumber value={value} />
                    {t('remaning_cards', { s: pluralise(value) })}
                </Fragment>
            }
        </StyledBack>)
}

export default translate()(CardBack);
