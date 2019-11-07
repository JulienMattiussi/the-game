import React from 'react';
import styled from '@emotion/styled';

const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'flex-start',
};

const StyledDiv = styled.div(style);

const ColumnLeftContainer = props => (
    <StyledDiv {...props} />
)

export default ColumnLeftContainer;
