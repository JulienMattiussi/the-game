import React from 'react';
import styled from '@emotion/styled';

const style = {
    fontWeight: 'bold',
};

const StyledStrong = styled.strong(style);

const StrongElement = ({ value }) => (
    <StyledStrong>
        {value}
    </StyledStrong>
)

export default StrongElement;
