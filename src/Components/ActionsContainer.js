import React from 'react';
import styled from '@emotion/styled';

const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    minHeight: 21,
    width: 'calc(100% - 30px)',
};

const StyledDiv = styled.div(style);

const ActionsContainer = props => (
    <StyledDiv {...props} />
)

export default ActionsContainer;
