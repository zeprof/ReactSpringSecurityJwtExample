import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import FormInputs from "../FormInputs.jsx";
import {COMMON_INPUTS, ROLE_CONFIG} from "./constants.js";


const RegisterPage = ({role}) => {
    const { t } = useTranslation();

    const DisciplineLabels = {
        ComputerScience: t('register.discipline.computerScience'),
        Nursing: t('register.discipline.nursing'),
        ElectricalEngineering: t('register.discipline.electricalEngineering'),
        MechanicalEngineering: t('register.discipline.mechanicalEngineering'),
        BusinessAdministration: t('register.discipline.businessAdministration')
    };

    const currentConfig = ROLE_CONFIG[role];

    const rawInputs = [...COMMON_INPUTS, ...(currentConfig?.extraInputs || [])].map(input => {
        if (input.type === 'select' && input.optionKeys) {
            return {
                ...input,
                options: input.optionKeys.map(key => ({
                    value: key,
                    label: DisciplineLabels[key] ?? key
                }))
            };
        }
        return input;
    });

    const passwordInputs = rawInputs.filter(input =>
        input.name === 'password' || input.name === 'passwordConfirmation'
    );
    const otherInputs = rawInputs.filter(input =>
        input.name !== 'password' && input.name !== 'passwordConfirmation'
    );

    const ACTIVE_INPUTS = [...otherInputs, ...passwordInputs];

    const getInitialValues = () => {
        const initial = {};
        ACTIVE_INPUTS.forEach(input => {
            initial[input.name] = '';
        });
        return initial;
    };

    const [values, setValues] = useState(getInitialValues());

    const [error, setError] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [simulationResponse, setSimulationResponse] = useState(null);

    const onChange = (e) => {
        const fieldName = e.target.name;
        setValues({...values, [fieldName]: e.target.value});
    }

    const isValid = () => {
        const hasEmptyFields = ACTIVE_INPUTS.some(input =>{
            const value = values[input.name];
            return !value || value.toString().trim() === '';
        });

        if (hasEmptyFields){
            setError('register.errors.allFieldsRequired');
            return false;
        }
        if(values.lastName.length < 1 || values.firstName.length < 1){
            setError('register.errors.nameMinLength');
            return false;
        }
        if (!validateEmail()){
            setError('register.errors.invalidEmail');
            return false;
        }
        if (values.password.length < 8){
            setError('register.errors.passwordMinLength');
            return false;
        }
        if (!motPasseCompatible()){
            setError('register.errors.passwordMismatch');
            return false;
        }
        return true;
    };
    const validateEmail = () => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(values.email);
    }
    const motPasseCompatible = () => {
        return values.password === values.passwordConfirmation;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isValid()) return;
        setError('');
        try{
            setDisableButton(true);
            const data = {...values}
            delete data.passwordConfirmation;
            const response = await currentConfig.onSubmit(data);
            setValues(getInitialValues());
            setSimulationResponse(JSON.stringify(response.data));
        }catch(e){
            setDisableButton(false);
            setError('register.errors.genericError');
        }finally {
            setDisableButton(false);
        }
    }

    const getFieldColClass = (inputName) => {
        if (
            inputName === 'firstName' ||
            inputName === 'lastName' ||
            inputName === 'password' ||
            inputName === 'passwordConfirmation'
        ) {
            return 'col-span-1';
        }
        return 'col-span-2';
    };

    return (
        <div>
            <div className="text-center">
                <h1 className="title">{t('register.title')}</h1>
                <p className="subtitle pb-6">{t('register.subtitle')}</p>
            </div>
            <form onSubmit={handleRegister}
                  className="forms-style">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACTIVE_INPUTS.map((input) => (
                        <div key={input.id || input.name} className={getFieldColClass(input.name)}>
                            <FormInputs
                                placeholder={t(input.placeholder)}
                                type={input.type}
                                value={values[input.name] ?? ''}
                                onChange={onChange}
                                options={input.options}
                                name={input.name}
                                label={t(input.label)}
                            />
                        </div>
                    ))}
                </div>

                {error && <p className="error">{t(error)}</p>}
                {simulationResponse && <p className="simulationResponse">{simulationResponse}</p>}
                <div className="space-x-1">
                    <input type="checkbox" id="terms" name="terms" required />
                    <label htmlFor="terms">
                        Acceptez les
                    </label>
                    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        termes et conditions
                    </a>
                </div>

                <button type="submit"
                        className={`${disableButton ? 'btn-disabled' : 'btn-active'} btn`}
                        disabled={disableButton}>
                    {disableButton ? t('register.submitting') : t('register.submitButton') + `${t(`roles.${role}.title`)}`}
                </button>
            </form>
        </div>

    );
};

export default RegisterPage;