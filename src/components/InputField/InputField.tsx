import { FC } from 'react';
import styles from './InputField.module.css';

type InputFieldProps = {
  name: string;
  label: string;
  type?: string;
  error?: boolean;
  errorMsg?: string;
  value: string;
  onChange: (val: string) => void;
};

const InputField: FC<InputFieldProps> = ({
  name,
  label,
  type = 'text',
  error = false,
  errorMsg = '',
  value,
  onChange,
}) => {
  return (
    <div className={styles.inputFieldContainer}>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {error && errorMsg && <span className={styles.errorMsg}>{errorMsg}</span>}
    </div>
  );
};

export default InputField;
