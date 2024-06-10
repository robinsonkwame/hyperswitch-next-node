require('dotenv').config();
const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.static("public"));
app.use(express.json());

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
app.post("/create-customer-zero-auth", async (req, res) => {
    const customerDetails = req.body;
    const customerId = generateCustomerId(customerDetails);

    // Check if customer already exists (this part is pseudo-code, depends on your database)
    // let customer = await findCustomerInDatabase(customerId);
    // if (!customer) {
    //   customer = await createCustomerInDatabase(customerId, customerDetails);
    // }

  // Assuming customer creation is successful, initiate zero amount authorization
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
      setup_future_usage: "off_session"
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


app.listen(4242, () => console.log("Node server listening on port 4242!"));


/*
    If you have two or more "business_country" + "business_label" pairs configured in your Hyperswitch dashboard,
    please pass the fields business_country and business_label in this request body.
    For accessing more features, you can check out the request body schema for payments-create API here :
    https://api-reference.hyperswitch.io/docs/hyperswitch-api-reference/60bae82472db8-payments-create
*/