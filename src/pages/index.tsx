import React, { useState } from "react";
import AddressForm from './AddressForm';
import { SignUpStep1 } from './SignUpStep1';
import { SignUpStep2 } from './SignUpStep2';

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
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <AddressForm onNext={handleAddressSubmit} />
                    </div>
                    <div className="w-1/2">
                        {addressData ? (
                            <SignUpStep2 onNext={handleSignUpComplete} addressData={addressData} />
                        ) : (
                            <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse p-8 space-y-4">
                                <div className="h-6 bg-gray-300 rounded"></div>
                                <div className="h-6 bg-gray-300 rounded"></div>
                                <div className="h-6 bg-gray-300 rounded"></div>
                                <div className="h-6 bg-gray-300 rounded"></div>
                                <div className="h-6 bg-gray-300 rounded"></div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-lg text-center text-green-600">
                    You have successfully signed up!
                </p>
            )}
        </div>
    );
}
