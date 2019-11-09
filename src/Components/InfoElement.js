import React from 'react';
import styled from '@emotion/styled';
import { colors, borderRadius } from '../theme';

const styleInfo = () => ({
    position: 'fixed',
    left: 200,
    backgroundColor: colors.white,
    borderRadius,
    padding: 10,
    whiteSpace: 'pre-wrap',
})

const StyledInfo = styled.span(styleInfo);

const styleSpan = {
    '&:hover': {
        cursor: 'pointer',
        'span': {
            display: 'block',
        }
    },
    'span': {
        display: 'none',
    },
}

const StyledSpan = styled.span(styleSpan);

const InfoElement = ({ value }) =>
    <StyledSpan>
        ⓘ
        <StyledInfo >
            {value}
        </StyledInfo>
    </StyledSpan>

export default InfoElement;
