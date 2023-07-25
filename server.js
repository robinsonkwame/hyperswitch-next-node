const express = require("express");
const app = express();
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
app.use(express.static("public"));
app.use(express.json());

app.post("/create-payment", async (req, res) => {

    fetch("https://sandbox.hyperswitch.io/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'api-key': "API_KEY" },
        body: JSON.stringify({
            currency: "USD",
            amount: 100,
            customer_id: "juspay",
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