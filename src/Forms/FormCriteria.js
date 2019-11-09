import React from 'react';
import styled from '@emotion/styled';
import { translate } from 'react-polyglot';
import { InfoElement } from '../Components';
import { tactics } from '../model/player';

const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
};

const StyledDiv = styled.div(style);

const FormCriteria = (
    {
        t,
        tactic,
        minimumGainToForceVeto,
        useBetterStarter,
        useVeto10,
        useVeto1,
        setTactic,
        setCriteria,
    }
) => {

    const changeUseBetterStarter = () => {
        setCriteria(prevState => ({ ...prevState, useBetterStarter: !useBetterStarter }));
    }

    const changeUseVeto10 = () => {
        setCriteria(prevState => ({ ...prevState, useVeto10: !useVeto10 }));
    }

    const changeUseVeto1 = () => {
        setCriteria(prevState => ({ ...prevState, useVeto1: !useVeto1 }));
    }

    const changeMinimumGainToForceVeto = (event) => {
        setCriteria(prevState => ({ ...prevState, minimumGainToForceVeto: +event.target.value }));
    }

    const changeTactic = (event) => {
        setTactic(event.target.value);
    }

    return (
        <StyledDiv>
            <label>
                {t('form_tactic')}
                <select onChange={changeTactic} defaultValue={tactic}>
                    {Object.keys(tactics).map(t => (
                        <option key={t} value={t} >{tactics[t].label}</option>
                    ))}
                </select> <InfoElement value={t(tactic + '_description')} />
            </label>
            <label>
                <input type="checkbox" checked={useBetterStarter} onChange={changeUseBetterStarter} />
                {t('form_better_starter')} <InfoElement value={t('better_starter_description')} />
            </label>
            <label>
                <input type="checkbox" checked={useVeto10} onChange={changeUseVeto10} />
                {t('form_veto10')} <InfoElement value={t('veto10_description')} />
            </label>
            <label>
                <input type="checkbox" checked={useVeto1} onChange={changeUseVeto1} />
                {t('form_veto1')} <InfoElement value={t('veto1_description')} />
            </label>
            <label>
                {t('form_minimum_gain_to_force')}
                <input
                    type="number"
                    value={minimumGainToForceVeto}
                    onChange={changeMinimumGainToForceVeto}
                /> <InfoElement value={t('minimumGainToForceVeto_description', { gain: minimumGainToForceVeto })} />
            </label>
        </StyledDiv>)
}

export default translate()(FormCriteria);
