import styles from '../styles/page.module.css'
import { loadHyper } from "@juspay-tech/hyper-js"
import { HyperElements } from "@juspay-tech/react-hyper-js";

import React, { useEffect, useState } from "react"
//import CheckoutForm from './checkout-form'
import SignUpForm from './signup-form'

export default function Home() {

  const [loadHyperValue, setLoadHyperValue] = useState()
  const [options, setOptions] = useState({})

  useEffect(() => {
    fetch("/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    }).then((res) => res.json())
      .then((data) => {
        setOptions({
          data: JSON.parse(data.hyper),
          clientSecret: data.clientSecret,
          appearance: {
            theme: "default"
          }
        })
      })
  }, [])



  // TODO: get publishable key from server
  useEffect(() => {
    setLoadHyperValue(loadHyper("pk_snd_332ccdc116b7422689572618b96ee6f1"));
  }, [])

  // const loadme = () => {
  //   const hyperPromise = loadHyper("pk_snd_332ccdc116b7422689572618b96ee6f1");
  //   console.log(hyperPromise); // Check what this logs
  //   hyperPromise.then(value => {
  //     console.log(value); // Check the resolved value
  //     console.log(Object.keys(value)); // Lists all the top-level properties and methods
  //     function listProperties(obj) {
  //       for (let prop in obj) {
  //           console.log(`${prop}: ${typeof obj[prop]}`);
  //       }
  //   }
  //   listProperties(value);      
  //     setLoadHyperValue(value);
  //   });
  // }
  console.log(options.data)

  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);


  return (
    // <div>
    //   Why hello there!

    //   <button onClick={async () => {loadme()}}>
    //     Print Load Hyper Value
    //   </button>

    // </div>
    <div className={styles.main}>
      <h1>
        Detroit Points Signup
      </h1>

      {
          Object.keys(options).length !== 0 ? 
            <HyperElements options={options} hyper={loadHyperValue}>
              <SignUpForm 
                isPaymentCompleted={isPaymentCompleted} 
                setIsPaymentCompleted={setIsPaymentCompleted} 
                paymentMethodType="credit"
              />

            </HyperElements> : 
            <></>
      }

      <pre>{JSON.stringify(options, null, 2)}</pre>

    </div>
  )
}