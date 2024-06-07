import styles from '../styles/page.module.css'
import { loadHyper } from "@juspay-tech/hyper-js"
import { HyperElements } from "@juspay-tech/react-hyper-js";

import React, { useEffect, useState } from "react"
import CheckoutForm from './checkout-form'

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

  return (
    <div className={styles.main}>
      {Object.keys(options).length !== 0 ? <HyperElements options={options} hyper={loadHyperValue}>
        <CheckoutForm />
      </HyperElements> : <></>}
    </div>
  )
}