require('dotenv').config();
const express = require("express");

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.post("/create-payment", async (req, res) => {
  const fetch = (await import("node-fetch")).default;

  fetch("https://sandbox.hyperswitch.io/payments", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'api-key': process.env.HYPERSWITCH_SECRET_KEY 
      },
      body: JSON.stringify({
          currency: "USD",
          amount: 100,
      }),
  })
      .then(resp => resp.json())
      .then(data => {
          res.send({
              clientSecret: data.client_secret,
              hyper: JSON.stringify(
                data
              )
          })
      })
})

app.listen(4242, () => console.log("Node server listening on port 4242!"));

/*
    If you have two or more "business_country" + "business_label" pairs configured in your Hyperswitch dashboard,
    please pass the fields business_country and business_label in this request body.
    For accessing more features, you can check out the request body schema for payments-create API here :
    https://api-reference.hyperswitch.io/docs/hyperswitch-api-reference/60bae82472db8-payments-create
*/