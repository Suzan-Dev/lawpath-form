import { FC } from 'react';
import styles from './InputField.module.css';

type InputFieldProps = {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
};

const InputField: FC<InputFieldProps> = ({ name, label, type = 'text', value, onChange }) => {
  return (
    <div className={styles.inputFieldContainer}>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export default InputField;
