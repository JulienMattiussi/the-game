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
        criteria,
        setTactic,
        setCriteria,
    }
) => {

    const changeUseBetterStarter = () => {
        setCriteria(prevState => ({ ...prevState, useBetterStarter: !criteria.useBetterStarter }));
    }

    const changeUseVeto10 = () => {
        setCriteria(prevState => ({
            ...prevState,
            minimumGainToForceVeto: !prevState.useVeto1 && prevState.useVeto10
                ? 100
                : prevState.minimumGainToForceVeto,
            minimumDifferenceToForceVeto: !prevState.useVeto1 && prevState.useVeto10
                ? 0
                : prevState.minimumDifferenceToForceVeto,
            useVeto10: !criteria.useVeto10
        }));
    }

    const changeUseVeto1 = () => {
        setCriteria(prevState => ({
            ...prevState,
            minimumGainToForceVeto: prevState.useVeto1 && !prevState.useVeto10
                ? 100
                : prevState.minimumGainToForceVeto,
            minimumDifferenceToForceVeto: prevState.useVeto1 && !prevState.useVeto10
                ? 0
                : prevState.minimumDifferenceToForceVeto,
            useVeto1: !criteria.useVeto1,
        }));
    }

    const changePlayCombos = () => {
        setCriteria(prevState => ({ ...prevState, playCombos: !criteria.playCombos }));
    }

    const changeMinimumGainToForceVeto = (event) => {
        event.persist();
        if (event.target && event.target.value)
            setCriteria(prevState => ({ ...prevState, minimumGainToForceVeto: +event.target.value }));
    }

    const changeMinimumDifferenceToForceVeto = (event) => {
        event.persist();
        if (event.target && event.target.value)
            setCriteria(prevState => ({ ...prevState, minimumDifferenceToForceVeto: +event.target.value }));
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
                <input type="checkbox" checked={criteria.useBetterStarter} onChange={changeUseBetterStarter} />
                {t('form_better_starter')} <InfoElement value={t('better_starter_description')} />
            </label>
            <label>
                <input type="checkbox" checked={criteria.useVeto10} onChange={changeUseVeto10} />
                {t('form_veto10')} <InfoElement value={t('veto10_description')} />
            </label>
            <label>
                <input type="checkbox" checked={criteria.useVeto1} onChange={changeUseVeto1} />
                {t('form_veto1')} <InfoElement value={t('veto1_description')} />
            </label>
            <label>
                <input type="checkbox" checked={criteria.playCombos} onChange={changePlayCombos} />
                {t('form_play_combos')} <InfoElement value={t('play_combos_description')} />
            </label>
            <label>
                {t('form_minimum_gain_to_force')}
                <input
                    type="number"
                    min={1}
                    max={100}
                    value={criteria.minimumGainToForceVeto}
                    onChange={changeMinimumGainToForceVeto}
                    disabled={!criteria.useVeto1 && !criteria.useVeto10}
                /> <InfoElement value={t('minimumGainToForceVeto_description', { gain: criteria.minimumGainToForceVeto })} />
            </label>
            <label>
                {t('form_minimum_difference_to_force')}
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={criteria.minimumDifferenceToForceVeto}
                    onChange={changeMinimumDifferenceToForceVeto}
                    disabled={!criteria.useVeto1 && !criteria.useVeto10}
                /> <InfoElement value={t('minimumDifferenceToForceVeto_description', { gain: criteria.minimumDifferenceToForceVeto })} />
            </label>
        </StyledDiv>)
}

export default translate()(FormCriteria);
