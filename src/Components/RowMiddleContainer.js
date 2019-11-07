import React from 'react';
import styled from '@emotion/styled';

const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
};

const StyledDiv = styled.div(style);

const RowMiddleContainer = props => (
    <StyledDiv {...props} />
)

export default RowMiddleContainer;
