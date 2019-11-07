import React from 'react';
import styled from '@emotion/styled';

const style = {
    fontWeight: 'bolder',
    width: '100%',
    textAlign: 'center',
};

const StyledSpan = styled.span(style);

const TitleElement = ({ title }) => (
    <StyledSpan>
        {title}
    </StyledSpan>
)

export default TitleElement;
