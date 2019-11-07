import React from 'react';
import styled from '@emotion/styled';

const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 20,
};

const StyledDiv = styled.div(style);

const FormBottomContainer = props => (
    <StyledDiv {...props} />
)

export default FormBottomContainer;
