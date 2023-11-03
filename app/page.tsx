'use client';

import { FormEvent, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import styles from './page.module.css';
import InputField from '@/src/components/InputField/InputField';

const FormFields = {
  Postcode: 'postcode',
  Suburb: 'suburb',
  State: 'state',
};

const initialFormState = {
  [FormFields.Postcode]: '',
  [FormFields.Suburb]: '',
  [FormFields.State]: '',
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
  const [loadData, { loading, data }] = useLazyQuery(query);

  const [formState, setFormState] = useState(initialFormState);

  const handleFieldChange = (field: string, value: string) => {
    setFormState((prevValue) => ({
      ...prevValue,
      [field]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: hit API
    console.log(formState);
    loadData();

    // If API returns success
    setFormState(initialFormState);
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.header}>Lawpath Form</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputField
          name={FormFields.Postcode}
          label='Postcode'
          value={formState[FormFields.Postcode]}
          onChange={(val) => handleFieldChange(FormFields.Postcode, val)}
        />
        <InputField
          name={FormFields.Suburb}
          label='Suburb'
          value={formState[FormFields.Suburb]}
          onChange={(val) => handleFieldChange(FormFields.Suburb, val)}
        />
        <InputField
          name={FormFields.State}
          label='State'
          value={formState[FormFields.State]}
          onChange={(val) => handleFieldChange(FormFields.State, val)}
        />
        <button className='btn-primary' type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </main>
  );
}
