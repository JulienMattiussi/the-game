import React from 'react';
import styled from '@emotion/styled';
import { tactics } from '../model/player';

const style = ({ position }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
});

const StyledDiv = styled.div(props => style(props));

const FormCriteria = (
    {
        tactic,
        setTactic,
        minimumGainToForceVeto,
        setMinimumGainToForceVeto,
        useBetterStarter,
        setUseBetterStarter,
        useVeto10,
        setUseVeto10,
        useVeto1,
        setUseVeto1,
    }
) => {

    const changeUseBetterStarter = () => {
        setUseBetterStarter(!useBetterStarter);
    }

    const changeUseVeto10 = () => {
        setUseVeto10(!useVeto10);
    }

    const changeUseVeto1 = () => {
        setUseVeto1(!useVeto1);
    }
    const changeMinimumGainToForceVeto = (event) => {
        setMinimumGainToForceVeto(+event.target.value);
    }

    const changeTactic = (event) => {
        setTactic(event.target.value);
    }


    return (
        <StyledDiv>
            <label>
                Tactique
                    <select onChange={changeTactic} defaultValue={tactic}>
                    {Object.keys(tactics).map(t => (
                        <option key={t} value={t} >{tactics[t].label}</option>
                    ))}
                </select>
            </label>
            <label>
                <input type="checkbox" checked={useBetterStarter} onChange={changeUseBetterStarter} />
                Optimiser le démarrage
                </label>
            <label>
                <input type="checkbox" checked={useVeto10} onChange={changeUseVeto10} />
                Annoncer les veto quand une reduction de 10 est possible
                </label>
            <label>
                <input type="checkbox" checked={useVeto1} onChange={changeUseVeto1} />
                Annoncer les veto quand la carte suivante est disponible
                </label>
            <label>
                Valeur minimum de gain pour outrepasser un veto
                    <input type="number" value={minimumGainToForceVeto} onChange={changeMinimumGainToForceVeto} />
            </label>
        </StyledDiv>)
}

export default FormCriteria;
