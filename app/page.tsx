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

      if (validation) {
        const { show, type, message } = validation;
        if (type === 'success') {
          setFormState(initialFormState);
        }
        showAlert(show, type, message);
      }
    },
    onError: () => {
      showAlert(true, 'error', 'Something went wrong.');
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

  const showAlert = (show: boolean, variant: string, message: string) => {
    setAlertState({
      show,
      variant,
      message,
    });
    setTimeout(() => {
      setAlertState(initialAlertStateValue);
    }, 3000);
  };

  const handleLocalValidation = () => {
    let isValid = true;
    const value = { error: true, errorMsg: 'This field is required' };

    if (!formState[FormFields.Postcode].value.trim()) {
      handleFieldChange(FormFields.Postcode, value);
      isValid = false;
    }
    if (!formState[FormFields.Suburb].value.trim()) {
      handleFieldChange(FormFields.Suburb, value);
      isValid = false;
    }

    return isValid;
  };

  const handleAPIValidation = (data: SearchLocalitiesData[] | null) => {
    const validation = { show: false, type: '', message: '' };

    const postcode = +formState[FormFields.Postcode].value;
    const suburb = formState[FormFields.Suburb].value.trim();
    const state = formState[FormFields.State].value.trim();

    // Check if all fields matched or not
    if (postcode && suburb && state) {
      const isAllFieldsValid = data?.some((locality) => {
        if (
          locality.postcode === postcode &&
          locality.location.toLowerCase().includes(suburb.toLowerCase()) &&
          locality.state.toLowerCase() === state.toLowerCase()
        ) {
          return true;
        }
      });
      if (isAllFieldsValid) {
        validation.show = true;
        validation.type = 'success';
        validation.message = 'The postcode, state and suburb input are valid.';

        return validation;
      }
    }

    // Check combination of form field values
    if (state) {
      // Check for suburb & state
      const isSuburbAndStateValid = data?.some((locality) => {
        if (
          locality.location.toLowerCase().includes(suburb.toLowerCase()) &&
          locality.state.toLowerCase() === state.toLowerCase()
        ) {
          return true;
        }
      });
      if (!isSuburbAndStateValid) {
        handleFieldChange(FormFields.Suburb, {
          error: true,
          errorMsg: `The suburb ${suburb} does not exist in the state ${state}.`,
        });
        return null;
      }
    }

    const isSuburbAndPostcodeValid = data?.some((locality) => {
      if (locality.postcode === postcode && locality.location.toLowerCase().includes(suburb.toLowerCase())) {
        return true;
      }
    });
    if (!isSuburbAndPostcodeValid) {
      // Check for suburb & postcode
      handleFieldChange(FormFields.Postcode, {
        error: true,
        errorMsg: `The postcode ${postcode} does not match the suburb ${suburb}.`,
      });
      return null;
    } else {
      // Ask to enter state to complete form submission
      handleFieldChange(FormFields.State, {
        error: true,
        errorMsg: `The above fields are valid! Please input data into this field.`,
      });
      return null;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    handleFieldChange(FormFields.Postcode, {});
    handleFieldChange(FormFields.Suburb, {});
    handleFieldChange(FormFields.State, {});

    const isValid = handleLocalValidation();
    if (!isValid) return;

    loadData({
      variables: {
        state: formState[FormFields.State].value.trim(),
        suburb: formState[FormFields.Suburb].value.trim(),
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
          name={FormFields.Suburb}
          label='Suburb'
          error={formState[FormFields.Suburb].error}
          errorMsg={formState[FormFields.Suburb].errorMsg}
          value={formState[FormFields.Suburb].value}
          onChange={(value) => handleFieldChange(FormFields.Suburb, { value })}
        />
        <InputField
          name={FormFields.State}
          label='State'
          error={formState[FormFields.State].error}
          errorMsg={formState[FormFields.State].errorMsg}
          value={formState[FormFields.State].value}
          onChange={(value) => handleFieldChange(FormFields.State, { value })}
        />
        <button className='btn-primary' type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Validate'}
        </button>
      </form>
    </main>
  );
}
