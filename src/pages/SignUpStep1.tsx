import React from 'react';
import styles from '../styles/page.module.css';

interface SignUpStep1Props {
    onNext: (data: any) => void;
    addressData: any; // Specify the type more precisely if possible
}

export const SignUpStep1: React.FC<SignUpStep1Props> = ({ onNext, addressData }) => {
    return (
        <div>
            <h2>Sign Up Step 1</h2>
            <pre>{JSON.stringify(addressData, null, 2)}</pre>
            <button className={styles.button} onClick={onNext}>Next</button>
        </div>
    );
}