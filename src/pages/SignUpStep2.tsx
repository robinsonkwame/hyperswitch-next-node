import React, { FormEvent, useEffect, useState, useRef } from 'react';
import styles from '../styles/page.module.css';
import { loadHyper, Hyper } from "@juspay-tech/hyper-js";

interface SignUpStep2Props {
    onNext: (data: any) => void;
    addressData: any;
}

const PAYMENT_METHOD = {
    CARD: "card",
    CARD_REDIRECT: "card_redirect",
    PAY_LATER: "pay_later",
    WALLET: "wallet",
    BANK_REDIRECT: "bank_redirect",
    BANK_TRANSFER: "bank_transfer",
    CRYPTO: "crypto",
    BANK_DEBIT: "bank_debit",
    REWARD: "reward",
    REAL_TIME_PAYMENT: "real_time_payment",
    UPI: "upi",
    VOUCHER: "voucher",
    GIFT_CARD: "gift_card",
};

const PAYMENT_METHOD_TYPE = {
    ACH: "ach",
    AFFIRM: "affirm",
    AFTERPAY_CLEARPAY: "afterpay_clearpay",
    ALFAMART: "alfamart",
    ALI_PAY: "ali_pay",
    ALI_PAY_HK: "ali_pay_hk",
    ALMA: "alma",
    APPLE_PAY: "apple_pay",
    ATOME: "atome",
    BACS: "bacs",
    BANCONTACT_CARD: "bancontact_card",
    BECS: "becs",
    BENEFIT: "benefit",
    BIZUM: "bizum",
    BLIK: "blik",
    BOLETO: "boleto",
    BCA_BANK_TRANSFER: "bca_bank_transfer",
    BNI_VA: "bni_va",
    BRI_VA: "bri_va",
    CARD_REDIRECT: "card_redirect",
    CIMB_VA: "cimb_va",
    CLASSIC: "classic",
    CREDIT: "credit",
    CRYPTO_CURRENCY: "crypto_currency",
    CASHAPP: "cashapp",
    DANA: "dana",
    DANAMON_VA: "danamon_va",
    DEBIT: "debit",
    DUIT_NOW: "duit_now",
    EFECTY: "efecty",
    EPS: "eps",
    FPS: "fps",
    EVOUCHER: "evoucher",
    GIROPAY: "giropay",
    GIVEX: "givex",
    GOOGLE_PAY: "google_pay",
    GO_PAY: "go_pay",
    GCASH: "gcash",
    IDEAL: "ideal",
    INTERAC: "interac",
    INDOMARET: "indomaret",
    KLARNA: "klarna",
    KAKAO_PAY: "kakao_pay",
    LOCAL_BANK_REDIRECT: "local_bank_redirect",
    MANDIRI_VA: "mandiri_va",
    KNET: "knet",
    MB_WAY: "mb_way",
    MOBILE_PAY: "mobile_pay",
    MOMO: "momo",
    MOMO_ATM: "momo_atm",
    MULTIBANCO: "multibanco",
    ONLINE_BANKING_THAILAND: "online_banking_thailand",
    ONLINE_BANKING_CZECH_REPUBLIC: "online_banking_czech_republic",
    ONLINE_BANKING_FINLAND: "online_banking_finland",
    ONLINE_BANKING_FPX: "online_banking_fpx",
    ONLINE_BANKING_POLAND: "online_banking_poland",
    ONLINE_BANKING_SLOVAKIA: "online_banking_slovakia",
    OXXO: "oxxo",
    PAGO_EFECTIVO: "pago_efectivo",
    PERMATA_BANK_TRANSFER: "permata_bank_transfer",
    OPEN_BANKING_UK: "open_banking_uk",
    PAY_BRIGHT: "pay_bright",
    PAYPAL: "paypal",
    PIX: "pix",
    PAY_SAFE_CARD: "pay_safe_card",
    PRZELEWY24: "przelewy24",
    PROMPT_PAY: "prompt_pay",
    PSE: "pse",
    RED_COMPRA: "red_compra",
    RED_PAGOS: "red_pagos",
    SAMSUNG_PAY: "samsung_pay",
    SEPA: "sepa",
    SOFORT: "sofort",
    SWISH: "swish",
    TOUCH_N_GO: "touch_n_go",
    TRUSTLY: "trustly",
    TWINT: "twint",
    UPI_COLLECT: "upi_collect",
    UPI_INTENT: "upi_intent",
    VIPPS: "vipps",
    VIET_QR: "viet_qr",
    VENMO: "venmo",
    WALLEY: "walley",
    WE_CHAT_PAY: "we_chat_pay",
    SEVEN_ELEVEN: "seven_eleven",
    LAWSON: "lawson",
    MINI_STOP: "mini_stop",
    FAMILY_MART: "family_mart",
    SEICOMART: "seicomart",
    PAY_EASY: "pay_easy",
    LOCAL_BANK_TRANSFER: "local_bank_transfer",
    MIFINITY: "mifinity"
};

const PUBLISHABLE_CLIENT_KEY = "pk_snd_332ccdc116b7422689572618b96ee6f1"

export const SignUpStep2: React.FC<SignUpStep2Props> = ({ onNext, addressData }) => {
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [hyper, setHyper] = useState<Hyper | null>(null);
    const [paymentElement, setPaymentElement] = useState<any>(null);
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)
    const unifiedCheckoutRef = useRef(null);

    const options = {
        defaultValues: {
            billingDetails: {
                name: addressData?.name || "",
                email: addressData?.email || "",
                phone: addressData?.phone || "",
                address: {
                    line1: addressData?.street || "",
                    line2: "",
                    city: addressData?.city || "Detroit",
                    state: addressData?.state || "MI",
                    country: addressData?.country || 'United States',
                    postal_code: addressData?.zip || ""
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
                hyperInstance = null;
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
        const isAddressDataComplete = (data: any) => {
            return data && Object.values(data).every(value => value !== null && value !== undefined && value !== "");
        };

        const fetchClientSecret = async () => {
            if (!isAddressDataComplete(addressData)) {
                console.error("Address data is incomplete");
                return;
            }

            try {
                const response = await fetch("http://localhost:4242/create-customer-ach-zero-auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        payment_method: PAYMENT_METHOD.BANK_DEBIT,
                        payment_method_type: PAYMENT_METHOD_TYPE.ACH,
                        payemnt_method_data: "",
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
            <h2>Sign Up Step 2</h2>
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