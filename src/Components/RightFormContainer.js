import React from 'react';
import styled from '@emotion/styled';
import { colors, borderRadius } from '../theme';

const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    backgroundColor: colors.whiteTransparency,
    borderRadius: `0 0 0 ${borderRadius}px`,
    maxWidth: '30%',
    select: {
        marginLeft: 5,
    },
    'input[type = "number"]': {
        marginLeft: 5,
        width: 80,
    }
};

const StyledDiv = styled.div(style);

const RightFormContainer = props => (
    <StyledDiv {...props} />
)

export default RightFormContainer;
