import React from 'react';
import styles from '../styles/page.module.css';

interface SignUpStep2Props {
    onNext: (data: any) => void;
    addressData: any; // Specify the type more precisely if possible
}

export const SignUpStep2: React.FC<SignUpStep2Props> = ({ onNext, addressData }) => {
    return (
        <div>
            <h2>Sign Up Step 2</h2>
            <pre>{JSON.stringify(addressData, null, 2)}</pre>            
            <button className={styles.button} onClick={onNext}>Next</button>
        </div>
    );
}