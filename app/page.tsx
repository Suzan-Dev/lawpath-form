'use client';

import { FormEvent, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import InputField from '@/src/components/InputField/InputField';
import Alert from '@/src/components/Alert/Alert';
import { FormStateType } from '@/src/types';
import { FormFields } from '@/src/constants/form';
import styles from './page.module.css';

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
  query {
    users {
      id
      name
      email
    }
  }
`;

export default function Home() {
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const [loadData, { loading, data }] = useLazyQuery(query, {
    onCompleted: () => {
      setFormState(initialFormState);
      setIsSubmitSuccess(true);
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

  const handleValidation = () => {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = handleValidation();
    if (!isValid) return;

    // TODO: hit API
    console.log(formState);
    loadData();
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.header}>Lawpath Form</h2>
      {isSubmitSuccess && (
        <div className='mb-15'>
          <Alert variant='success'>The postcode, state and suburb input are valid</Alert>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputField
          name={FormFields.Postcode}
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
