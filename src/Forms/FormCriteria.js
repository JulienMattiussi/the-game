import React from 'react';
import styled from '@emotion/styled';
import { translate } from 'react-polyglot';
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
        setTactic,
        minimumGainToForceVeto,
        setMinimumGainToForceVeto,
        useBetterStarter,
        setUseBetterStarter,
        useVeto10,
        setUseVeto10,
        useVeto1,
        setUseVeto1,
        handleRefreshStats,
    }
) => {

    const refreshStats = handleRefreshStats ? handleRefreshStats : () => { };

    const changeUseBetterStarter = () => {
        setUseBetterStarter(!useBetterStarter,
            refreshStats());
    }

    const changeUseVeto10 = () => {
        setUseVeto10(!useVeto10,
            refreshStats());
    }

    const changeUseVeto1 = () => {
        setUseVeto1(!useVeto1,
            refreshStats());
    }
    const changeMinimumGainToForceVeto = (event) => {
        setMinimumGainToForceVeto(+event.target.value,
            refreshStats());
    }

    const changeTactic = (event) => {
        setTactic(event.target.value,
            refreshStats());
    }


    return (
        <StyledDiv>
            <label>
                {t('form_tactic')}
                <select onChange={changeTactic} defaultValue={tactic}>
                    {Object.keys(tactics).map(t => (
                        <option key={t} value={t} >{tactics[t].label}</option>
                    ))}
                </select>
            </label>
            <label>
                <input type="checkbox" checked={useBetterStarter} onChange={changeUseBetterStarter} />
                {t('form_better_starter')}
            </label>
            <label>
                <input type="checkbox" checked={useVeto10} onChange={changeUseVeto10} />
                {t('form_veto10')}
            </label>
            <label>
                <input type="checkbox" checked={useVeto1} onChange={changeUseVeto1} />
                {t('form_veto1')}
            </label>
            <label>
                {t('form_minimum_gain_to_force')}
                <input type="number" value={minimumGainToForceVeto} onChange={changeMinimumGainToForceVeto} />
            </label>
        </StyledDiv>)
}

export default translate()(FormCriteria);
