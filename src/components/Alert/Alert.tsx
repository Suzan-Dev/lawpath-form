import { FC, PropsWithChildren } from 'react';
import styles from './Alert.module.css';

type AlertProps = {
  children: string;
  variant: 'success' | 'error';
};

const Alert: FC<PropsWithChildren<AlertProps>> = ({ children, variant }) => {
  return (
    <div className={`${styles.alertContainer} ${variant}`}>
      <p>{children}</p>
    </div>
  );
};

export default Alert;
