import React, { FormEvent, useEffect, useState, useRef } from 'react';
import styles from '../styles/page.module.css';
import { loadHyper, Hyper } from "@juspay-tech/hyper-js";

interface SignUpStep1Props {
    onNext: (data: any) => void;
    addressData: any;
}

const PUBLISHABLE_CLIENT_KEY = "pk_snd_332ccdc116b7422689572618b96ee6f1"

export const SignUpStep1: React.FC<SignUpStep1Props> = ({ onNext, addressData }) => {
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [hyper, setHyper] = useState<Hyper | null>(null);
    const [paymentElement, setPaymentElement] = useState<any>(null);
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)
    const unifiedCheckoutRef = useRef(null);

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
                    country: addressData.country || 'United States',
                    postal_code: addressData.zip || ""
                }
            }
        }
    }

    useEffect(() => {
        let hyperInstance: Hyper | null = null;
        const initializeHyper = async () => {
            hyperInstance = await loadHyper(PUBLISHABLE_CLIENT_KEY);
            setHyper(hyperInstance);
        };
        initializeHyper();

        return () => {
            if (hyperInstance) {
                hyperInstance.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (!hyper || !clientSecret) {
            return;
        }

        const element = hyper.elements({
            clientSecret,
            appearance: {
                theme: 'default',
            },
        });

        const paymentElement = element.create('payment');
        paymentElement.mount('#payment-element');
        setPaymentElement(paymentElement);

        return () => {
            paymentElement.destroy();
        };
    }, [hyper, clientSecret]);

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

    const handlePaymentSuccess = (result: any) => {
        console.log("Payment successful:", result);
        if (result.paymentIntent?.payment_method) {
            setPaymentMethodId(result.paymentIntent.payment_method);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!hyper) {
            console.error("Hyper not initialized");
            return;
        }

        const { error, paymentIntent } = await hyper.confirmPayment({
            elements: paymentElement,
            confirmParams: {
                return_url: "http://localhost:3000/payment-success",
            },
            redirect: "if_required",
        });

        if (error) {
            console.error("Payment failed:", error.message);
        } else if (paymentIntent) {
            console.log("Payment succeeded:", paymentIntent);
            setPaymentMethodId(paymentIntent.payment_method);
            setIsPaymentCompleted(true);
        }
    };

    return (
        <div>
            <h2>Sign Up Step 1</h2>
            <pre>Address: {JSON.stringify(addressData, null, 2)}</pre>
            <pre>Client secret: {clientSecret}</pre>

            {clientSecret && (
                <form onSubmit={handleSubmit}>
                    <div id="payment-element"></div>

                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" 
                        disabled={!paymentElement || isPaymentCompleted}
                    >
                        Add Card
                    </button>
                </form>
            )}

            {paymentMethodId && <p>Payment Method ID: {paymentMethodId}</p>}

            <button className={styles.button} onClick={onNext}>Next</button>
        </div>
    );
}