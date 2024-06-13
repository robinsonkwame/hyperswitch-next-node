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
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)
    const hyper = useHyper();
    const widgets = useWidgets()
    const options = {
        defaultValues: {
            billingDetails: {
                name: addressData.name || "",
                email: addressData.email || "",
                phone: addressData.phone || "",
                address: {
                    line1: addressData.street || "",
                    line2: "",
                    city: addressData.city || "Detroit",
                    state: addressData.state || "MI",
                    country: addressData.country || "United States",
                    postal_code: addressData.zip || ""
                }
            }
        }}


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
    }, [clientSecret]);

    const handlePaymentSuccess = (result: any) => {
        if (result.paymentIntent?.payment_method) {
            setPaymentMethodId(result.paymentIntent.payment_method);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!hyper || !widgets) {
            return;
        }

        /*
        const response = await hyper.confirmPayment({
            widgets,
            confirmParams: {
                return_url: "http://localhost:3000",
            },
            redirect: "if_required",
        });

        console.log(response)

        if (response) {
            if (response.status === "succeeded") {
                console.log("Payment Successful");
            } else if (response.error) {
                console.log(response.error.message);
            } else {
                console.log("An unexpected error occurred.");
            }
        } else {
            console.log("An unexpected error occurred.");
        }
        */

        setIsPaymentCompleted(true);
    };

    return (
        <div>
            <h2>Sign Up Step 1</h2>
            <pre>Address: {JSON.stringify(addressData, null, 2)}</pre>
            <pre>Client secret: {clientSecret}</pre>

            {clientSecret && (
                <form onSubmit={handleSubmit}>
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
                            options={options}
                        />
                    </HyperElements>

                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" disabled={isPaymentCompleted}>
                        Add Card
                    </button>
                </form>
            )}


            {paymentMethodId && <p>Payment Method ID: {paymentMethodId}</p>}

            <button className={styles.button} onClick={onNext}>Next</button>
        </div>
    );
}