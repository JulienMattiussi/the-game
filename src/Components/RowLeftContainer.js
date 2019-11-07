import React from 'react';
import styled from '@emotion/styled';

const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'flex-start',
};

const StyledDiv = styled.div(style);

const RowLeftContainer = props => (
    <StyledDiv {...props} />
)

export default RowLeftContainer;
