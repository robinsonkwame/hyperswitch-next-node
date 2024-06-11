import React, { FormEvent, useEffect, useState } from "react"
import styles from '../styles/checkout.module.css'
import { useHyper, useWidgets, UnifiedCheckout } from "@juspay-tech/react-hyper-js";
import AddressComponent from "./information";

interface SignUpFormProps {
    paymentMethodType?: string;
    isPaymentCompleted: boolean;
    setIsPaymentCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ paymentMethodType = "credit card", isPaymentCompleted = false, setIsPaymentCompleted }) => {
    const hyper = useHyper();
    const widgets = useWidgets();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [customerDetails, setCustomerDetails] = useState({
        name: "",
        street: "",
        state: "",
        country: "",
        zipCode: "",
        email: "",
        phone: ""
    });
    const [customerResponse, setCustomerResponse] = useState(null);
    const [paymentId, setPaymentId] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setCustomerDetails(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Concatenate address details
        const fullAddress = `${customerDetails.name}, ${customerDetails.street}, ${customerDetails.state}, ${customerDetails.country}, ${customerDetails.zipCode}`;

        // Create customer with address and customer details
        const response = await hyper.createCustomer({
            name: customerDetails.name,
            street: customerDetails.street,
            state: customerDetails.state,
            country: customerDetails.country,
            zipCode: customerDetails.zipCode,
            email: customerDetails.email,
            phone: customerDetails.phone
        });

        if (response.error) {
            setMessage(response.error.message);
        } else {
            setMessage("Customer created successfully!");
            setCustomerResponse(response); // Store the response for future use
            // Initiate zero amount authorization to validate payment method and store for future use
            const zeroAuthResponse = await fetch("/create-customer-zero-auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...customerDetails,
                    payment_method_type: paymentMethodType
                })
            }).then(res => res.json());

            if (zeroAuthResponse.error) {
                setMessage(zeroAuthResponse.error);
            } else {
                setPaymentId(zeroAuthResponse.paymentId);
                setMessage("Zero amount authorization successful. Payment method stored.");
                setIsPaymentCompleted(true);
            }
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <AddressComponent 
                customerDetails={customerDetails} 
                handleInputChange={handleInputChange}
            />
            <UnifiedCheckout 
                id="unified-checkout" 
                options={{}} // Add necessary options
            />
            <button className={styles.button} disabled={!hyper || !widgets || isPaymentCompleted}>
                {isLoading ? <div className={styles.spinner} id="spinner"></div> : <>Sign Up with {paymentMethodType}</>}
            </button>
            {message && <div id="payment-message" className={styles.paymentMessage}>{message}</div>}
        </form>
    );
}

export default SignUpForm;