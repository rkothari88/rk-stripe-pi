const express = require('express');
const expressHandlebars = require('express-handlebars');
const stripe = require('stripe')({STRIPE_TEST_API_KEY});
const bodyParser = require('body-parser');

var app = express();

app.get('/secret', async (req, res) => {
  const intent = await stripe.paymentIntents.create({
  amount: 1099,
  currency: 'usd',
	  metadata: {integration_check: 'accept_a_payment'}
});
	res.json({client_secret: intent.client_secret });
});

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  let event;

  try {
    event = JSON.parse(request.body);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
	  console.log('Send nothing to ' + paymentIntent.shipping.name);
      //console.log('PaymentIntent was successful!');
      break;
    default:
      // Unexpected event type
      return response.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({received: true});
});

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000)