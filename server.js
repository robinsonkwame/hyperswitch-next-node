require('dotenv').config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());


const generateCustomerId = (customerDetails) => {
    const { name, street, state, country, zipCode, email, phone } = customerDetails;
    const hash = crypto.createHash('sha256');
    hash.update(`${name}${street}${state}${country}${zipCode}${email}${phone}`);
    return hash.digest('hex');
  };

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

// Endpoint to create customer and initiate zero auth
/*
app.post("/create-customer-zero-auth", async (req, res) => {
    const { payment_method_type, ...customerDetails } = req.body;
    const customerId = generateCustomerId(customerDetails);

  const fetch = (await import("node-fetch")).default;
  fetch("https://sandbox.hyperswitch.io/payments", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'api-key': process.env.HYPERSWITCH_SECRET_KEY 
    },
    body: JSON.stringify({
      amount: 0,
      currency: "USD",
      customer_id: customerId,
      setup_future_usage: "off_session",
      payment_method_type: payment_method_type
    }),
  })
  .then(resp => resp.json())
  .then(data => {
      res.send({
          message: "Zero amount authorization initiated",
          paymentId: data.payment_id
      });
  })
  .catch(error => {
      res.status(500).send({ error: "Failed to initiate zero amount authorization" });
  });
});
*/


// Endpoint to create customer and initiate zero auth
app.post("/create-customer-zero-auth", async (req, res) => {
  const { payment_method_type, ...customerDetails } = req.body;
  const customerId = generateCustomerId(customerDetails);

  const fetch = (await import("node-fetch")).default;

  // Construct billing data from customerDetails
  const billing = {
    address: {
      line1: customerDetails.street,
      line2: "",
      line3: "",
      city: customerDetails.city,
      state: customerDetails.state,
      zip: customerDetails.zip,
      country: "US", // NOTE: Typed to 2 letter countries
      first_name: customerDetails.name.split(' ')[0], // Assuming the first word is the first name
      last_name: customerDetails.name.split(' ').slice(1).join(' ') // Rest is last name
    },
    phone: {
      number: customerDetails.phone.replace(/[^0-9]/g, ''), // Removing non-numeric characters
      country_code: "+1"
    }
  };

  const body = JSON.stringify({
    amount: 0,
    currency: "USD",
    confirm: false,
    customer_id: customerId,
    setup_future_usage: "off_session",
    payment_method_type: payment_method_type,
    billing: billing
})

  fetch("https://sandbox.hyperswitch.io/payments", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          'api-key': process.env.HYPERSWITCH_SECRET_KEY
      },
      body: body,
  })
  .then(resp => {
      if (resp.status === 400) {
        console.log("Here in status 400");
        return resp.json().then(json => {
          console.log("Hyperswitch Server returned: ", json);
          throw new Error("400 Bad Request");
        });
      }
      return resp.json();
  })
  .then(data => {
      if (data.error) {
          console.log("data error", data);
          if (!res.headersSent) {
              res.status(400).send(data);
          }
      } else {
          if (!res.headersSent) {
              res.send({
                  message: "Zero amount authorization initiated",
                  clientSecret: data.client_secret,
                  paymentId: data.payment_id
              });
          }
      }
  })
  .catch(error => {
      if (!res.headersSent) {
          res.status(500).send({ error: "Failed to initiate zero amount authorization" });
      }
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));


/*
    If you have two or more "business_country" + "business_label" pairs configured in your Hyperswitch dashboard,
    please pass the fields business_country and business_label in this request body.
    For accessing more features, you can check out the request body schema for payments-create API here :
    https://api-reference.hyperswitch.io/docs/hyperswitch-api-reference/60bae82472db8-payments-create
*/