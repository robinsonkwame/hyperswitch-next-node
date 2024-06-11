import React, { useEffect, useState } from "react";
import styles from '../styles/page.module.css';
import { SignUpStep1 } from './SignUpStep1';
import { SignUpStep2 } from './SignUpStep2';
import AddressForm from './AddressForm';
import { loadHyper } from "@juspay-tech/hyper-js";
import { HyperElements } from "@juspay-tech/react-hyper-js";
import SignUpForm from './signup-form';

const PUBLISHABLE_CLIENT_KEY = "pk_snd_332ccdc116b7422689572618b96ee6f1"
const CREATE_ZERO_AUTH_ENDPOINT = "/create-customer-zero-auth"
const HEADER = { "Content-Type": "application/json" }

export default function Home() {
    const [hyper, setHyper] = useState(null);
    const [options, setOptions] = useState(null);

    const _setOptions = (data) => setOptions({
      clientSecret: data.clientSecret,
      appearance: {
          theme: "default"
      }
    });
    const [step, setStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [addressData, setAddressData] = useState(null);

    const handleNextStep = (data) => {
        if (step === 0) {
            setAddressData(data);
            setStep(1);
        } else if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setIsCompleted(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Detroit Points Signup</h1>
            {!isCompleted ? (
                step === 0 ? (
                  <AddressForm onNext={handleNextStep} />
                ) : step === 1 ? (
                    <SignUpStep1 onNext={handleNextStep} addressData={addressData} />
                ) : (
                    <SignUpStep2 onNext={handleNextStep} addressData={addressData} />
                )
            ) : (
                <p className="text-lg text-center text-green-600">
                    You have successfully signed up!
                </p>
            )}
        </div>
    );
}

/*
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadHyperInstance = async () => {
            const hyperInstance = await loadHyper(PUBLISHABLE_CLIENT_KEY);
            setHyper(hyperInstance);
        };
        loadHyperInstance();
    }, []);

    const handleCustomerDetailsSubmit = async (customerDetails) => {
        setIsLoading(true);
        // Assuming create-customer-zero-auth endpoint handles customer creation and returns necessary data
        fetch("/create-customer-zero-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerDetails)
        }).then(res => res.json())
          .then(data => {
              if (data.error) {
                  setMessage(data.error);
                  setIsLoading(false);
              } else {
                  setMessage("Customer registered. Please proceed with payment.");
                  setIsPaymentCompleted(true);
                  setIsLoading(false);
              }
          });


                      {hyper && options ? (
                <HyperElements options={options} hyper={hyper}>
                    <SignUpForm 
                        paymentMethodType="credit"
                        isPaymentCompleted={isPaymentCompleted}
                        setIsPaymentCompleted={setIsPaymentCompleted}
                    />
                </HyperElements>
            ) : (
                <p>Loading...</p>
            )}
*/