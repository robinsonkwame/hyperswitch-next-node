require('dotenv').config();
const express = require("express");

// Hack
let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();

const app = express();
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
app.use(express.static("public"));
app.use(express.json());

app.post("/create-payment", async (req, res) => {
    console.log('starting in create payment ...')
    if (!fetch) {
        return res.status(500).send({ error: 'Fetch not initialized' });
    }
    console.log('fetch is loaded ...')
    /*
        If you have two or more "business_country" + "business_label" pairs configured in your Hyperswitch dashboard,
        please pass the fields business_country and business_label in this request body.
        For accessing more features, you can check out the request body schema for payments-create API here :
        https://api-reference.hyperswitch.io/docs/hyperswitch-api-reference/60bae82472db8-payments-create
    */

    console.log('\t key is  ...', process.env.HYPERSWITCH_SECRET_KEY)
    fetch("https://sandbox.hyperswitch.io/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'api-key': process.env.HYPERSWITCH_SECRET_KEY },
        body: JSON.stringify({
            currency: "USD",
            amount: 100,
        }),
    })
        .then(resp => resp.json())
        .then(data => {
            res.send({
                clientSecret: data.client_secret
            })
        })
})

app.listen(4242, () => console.log("Node server listening on port 4242!"));