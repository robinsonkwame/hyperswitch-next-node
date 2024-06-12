import React, { FormEvent, useEffect, useState } from 'react';
import styles from '../styles/page.module.css';
import { useHyper, useWidgets, UnifiedCheckout } from "@juspay-tech/react-hyper-js";
import { HyperElements } from "@juspay-tech/react-hyper-js";
import { loadHyper } from "@juspay-tech/hyper-js"

interface SignUpStep1Props {
    onNext: (data: any) => void;
    addressData: any;
}

const PUBLISHABLE_CLIENT_KEY = "pk_snd_332ccdc116b7422689572618b96ee6f1"

export const SignUpStep1: React.FC<SignUpStep1Props> = ({ onNext, addressData }) => {
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [loadHyperValue, setLoadHyperValue] = useState()

    useEffect(() => {
        setLoadHyperValue(loadHyper(PUBLISHABLE_CLIENT_KEY));
      }, [])
    


    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await fetch("http://localhost:4242/create-customer-zero-auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        payment_method_type: "credit",// critical to keep them the same
                        ...addressData
                    })
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
                const paymentId = data.paymentId;
                setClientSecret(data.clientSecret);

                console.log("Data:", data); // Log the data
                console.log("Payment ID:", paymentId); // Log the paymentId

            } catch (error) {
                console.error("Error fetching client secret:", error);
                // Handle the error case, e.g., show an error message to the user
            }
        };

        fetchClientSecret();
    }, [addressData]);

    useEffect(() => {
        console.log("Client secret:", clientSecret); // This will log the updated client secret
    }, [clientSecret]); // Dependency array includes clientSecret to run this effect when clientSecret changes

    /*
    NEEDED TO ask hyper to use the unfied form
                const hyper = await loadHyper(PUBLISHABLE_CLIENT_KEY, {
                    baseUrl: "https://sandbox.hyperswitch.io"
                });                

                const resp = await hyper.retrievePaymentIntent(paymentId);
        
                console.log("Payment Intent:", resp); // Log the paymentId
    
    */

                /*
                    <UnifiedCheckout
                        id="unified-checkout"
                        onSuccess={handlePaymentSuccess}
                        options={{
                            clientSecret,
                            returnUrl: "http://localhost:3000",
                        }}
                    />
            )}                
                */

    const handlePaymentSuccess = (result: any) => {
        if (result.paymentIntent?.payment_method) {
            setPaymentMethodId(result.paymentIntent.payment_method);
        }
    };

    return (
        <div>
            <h2>Sign Up Step 1</h2>
            <pre>Address: {JSON.stringify(addressData, null, 2)}</pre>
            <pre>Client secret: {clientSecret}</pre>

            {clientSecret && (
                <HyperElements 
                    options={{
                        clientSecret: clientSecret,
                        appearance: {
                            theme: "default"
                        }
                    }}
                    hyper={loadHyperValue}
                >
                    <UnifiedCheckout
                        id="unified-checkout"
                        onSuccess={handlePaymentSuccess}
                        options={{
                            clientSecret,
                            returnUrl: "http://localhost:3000",
                        }}
                    />
                </HyperElements>
            )}


            {paymentMethodId && <p>Payment Method ID: {paymentMethodId}</p>}

            <button className={styles.button} onClick={onNext}>Next</button>
        </div>
    );
}