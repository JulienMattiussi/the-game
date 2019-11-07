import React from 'react';
import styled from '@emotion/styled';

const style = {
    textAlign: 'left',
};

const StyledSpan = styled.span(style);

const styleTitle = {
    fontWeight: 'bolder',
};

const StyledTitle = styled.span(styleTitle);

const SimpleElement = ({ title, value }) => (
    <StyledSpan>
        <StyledTitle>{title}{value != null ? ' : ' : ''}</StyledTitle> {value}
    </StyledSpan>
)

export default SimpleElement;
