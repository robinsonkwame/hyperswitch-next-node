require('dotenv').config();
const express = require("express");

// Hack
let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();

const SERVER_URL = process.env.HYPERSWITCH_SERVER_URL;

const CLIENT_URL = process.env.HYPERSWITCH_CLIENT_URL;

const app = express();
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
app.use(express.static("public"));
app.use(express.json());

app.get("/config", (req, res) => {
    res.send({
      publishableKey: process.env.HYPERSWITCH_PUBLISHABLE_KEY,
    });
  });
  
app.get("/urls", (req, res) => {
    res.send({
        serverUrl: SERVER_URL,
        clientUrl: CLIENT_URL,
    });
});

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

app.get("/create-payment-intent", async (req, res) => {
    try {
      var paymentIntent;
      const request = {
        currency: "USD",
        amount: 2999,
        order_details: [
          {
            product_name: "Apple iphone 15",
            quantity: 1,
            amount: 2999,
          },
        ],
        confirm: false,
        capture_method: "automatic",
        authentication_type: "three_ds",
        customer_id: "hyperswitch_sdk_demo_id",
        email: "hyperswitch_sdk_demo_id@gmail.com",
        description: "Hello this is description",
        // allowed_payment_method_types:["sofort"],
        shipping: {
          address: {
            state: "zsaasdas",
            city: "Banglore",
            country: "US",
            line1: "sdsdfsdf",
            line2: "hsgdbhd",
            line3: "alsksoe",
            zip: "571201",
            first_name: "joseph",
            last_name: "doe",
          },
          phone: {
            number: "123456789",
            country_code: "+1",
          },
        },
        connector_metadata: {
          noon: {
            order_category: "applepay",
          },
        },
        metadata: {
          udf1: "value1",
          new_customer: "true",
          login_date: "2019-09-10T10:11:12Z",
        },
        billing: {
          address: {
            line1: "1467",
            line2: "Harrison Street",
            line3: "Harrison Street",
            city: "San Fransico",
            state: "California",
            zip: "94122",
            country: "US",
            first_name: "joseph",
            last_name: "Doe",
          },
          phone: {
            number: "8056594427",
            country_code: "+91",
          },
        },
      };
      if (SERVER_URL) {
        const apiResponse = await fetch(
          `${process.env.HYPERSWITCH_SERVER_URL}/payments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "api-key": process.env.HYPERSWITCH_SECRET_KEY,
            },
            body: JSON.stringify(request),
          }
        );
        paymentIntent = await apiResponse.json();
  
        if (paymentIntent.error) {
          return res.status(400).send({
            error: paymentIntent.error,
          });
        }
      } else {
        paymentIntent = await hyper.paymentIntents.create(request);
      }
  
      // Send publishable key and PaymentIntent details to client
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      return res.status(400).send({
        error: {
          message: err.message,
        },
      });
    }
  });


app.listen(4242, () => console.log("Node server listening on port 4242!"));