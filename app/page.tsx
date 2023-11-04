'use client';

import { FormEvent, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import InputField from '@/src/components/InputField/InputField';
import Alert from '@/src/components/Alert/Alert';
import { FormStateType, SearchLocalitiesData } from '@/src/types';
import { FormFields } from '@/src/constants/form';
import styles from './page.module.css';

const initialAlertStateValue = {
  show: false,
  variant: '',
  message: '',
};
const initialFormStateValue = {
  value: '',
  error: false,
  errorMsg: '',
};
const initialFormState = {
  [FormFields.Postcode]: initialFormStateValue,
  [FormFields.Suburb]: initialFormStateValue,
  [FormFields.State]: initialFormStateValue,
};

const query = gql`
  query SearchLocalities($state: String!, $suburb: String!) {
    search(state: $state, suburb: $suburb) {
      state
      postcode
      location
    }
  }
`;

export default function Home() {
  const [formState, setFormState] = useState(initialFormState);
  const [alertState, setAlertState] = useState(initialAlertStateValue);

  const [loadData, { loading }] = useLazyQuery(query, {
    fetchPolicy: 'network-only',
    onCompleted: ({ search: data }) => {
      const validation = handleAPIValidation(data);

      setFormState(initialFormState);
      setAlertState({
        show: true,
        variant: validation.type,
        message: validation.message,
      });
      setTimeout(() => {
        setAlertState(initialAlertStateValue);
      }, 3000);
    },
  });

  const handleFieldChange = (field: string, values: FormStateType) => {
    setFormState((prevValue) => ({
      ...prevValue,
      [field]: {
        ...prevValue[field],
        error: false,
        errorMsg: '',
        ...values,
      },
    }));
  };

  const handleLocalValidation = () => {
    let isValid = true;
    const value = { error: true, errorMsg: 'This field is required' };

    if (!formState[FormFields.Postcode].value) {
      handleFieldChange(FormFields.Postcode, value);
      isValid = false;
    }
    if (!formState[FormFields.Suburb].value) {
      handleFieldChange(FormFields.Suburb, value);
      isValid = false;
    }
    if (!formState[FormFields.State].value) {
      handleFieldChange(FormFields.State, value);
      isValid = false;
    }

    return isValid;
  };

  const handleAPIValidation = (data: SearchLocalitiesData[] | null) => {
    const validation = { type: '', message: '' };

    const postcode = +formState[FormFields.Postcode].value;
    const suburb = formState[FormFields.Suburb].value.toLowerCase();
    const state = formState[FormFields.State].value.toLowerCase();

    if (!data || !data.length) {
      validation.type = 'error';
      validation.message = 'No fields match.';

      return validation;
    }

    const isAllFieldsValid = data?.some((locality) => {
      if (
        locality.postcode === postcode &&
        locality.location.toLowerCase() === suburb &&
        locality.state.toLowerCase() === state
      ) {
        return true;
      }
    });

    if (isAllFieldsValid) {
      validation.type = 'success';
      validation.message = 'The postcode, state and suburb input are valid.';
    }

    return validation;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = handleLocalValidation();
    if (!isValid) return;

    loadData({
      variables: {
        state: formState[FormFields.State].value,
        suburb: formState[FormFields.Suburb].value,
      },
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h2>Lawpath Form</h2>
        <p>Validate your address</p>
      </div>
      {alertState.show && (
        <div className='mb-15 full-w'>
          <Alert variant={alertState.variant}>{alertState.message}</Alert>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputField
          name={FormFields.Postcode}
          type='number'
          label='Postcode'
          error={formState[FormFields.Postcode].error}
          errorMsg={formState[FormFields.Postcode].errorMsg}
          value={formState[FormFields.Postcode].value}
          onChange={(value) => handleFieldChange(FormFields.Postcode, { value })}
        />
        <InputField
          name={FormFields.State}
          label='State'
          error={formState[FormFields.State].error}
          errorMsg={formState[FormFields.State].errorMsg}
          value={formState[FormFields.State].value}
          onChange={(value) => handleFieldChange(FormFields.State, { value })}
        />
        <InputField
          name={FormFields.Suburb}
          label='Suburb'
          error={formState[FormFields.Suburb].error}
          errorMsg={formState[FormFields.Suburb].errorMsg}
          value={formState[FormFields.Suburb].value}
          onChange={(value) => handleFieldChange(FormFields.Suburb, { value })}
        />
        <button className='btn-primary' type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Validate'}
        </button>
      </form>
    </main>
  );
}
