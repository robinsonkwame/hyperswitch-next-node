import React, { useState } from "react";
import AddressForm from './AddressForm';
import { SignUpStep1 } from './SignUpStep1';

export default function Home() {
    const [addressData, setAddressData] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleAddressSubmit = (data) => {
        setAddressData(data);
    };

    const handleSignUpComplete = () => {
        setIsCompleted(true);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Detroit Points Signup</h1>
            {!isCompleted ? (
                !addressData ? (
                    <AddressForm onNext={handleAddressSubmit} />
                ) : (
                    <SignUpStep1 onNext={handleSignUpComplete} addressData={addressData} />
                )
            ) : (
                <p className="text-lg text-center text-green-600">
                    You have successfully signed up!
                </p>
            )}
        </div>
    );
}
