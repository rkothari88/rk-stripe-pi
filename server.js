const express = require('express');
const expressHandlebars = require('express-handlebars');
const stripe = require('stripe')('sk_test_51HEQTcAlhU4pmDMqwM4jCa7MK2zEwVfSgzshdZRfILNgy3lBECfzIN8XKkgIzMrBlPLYph2f8NlFzZc7SH2eroIx00fa6GIBR7');

var app = express();


/*
const paymentIntent = stripe.paymentIntents.create({
  amount: 1099,
  currency: 'usd',
  // Verify your integration in this guide by including this parameter
  metadata: {integration_check: 'accept_a_payment'},
});
*/

/*
app.engine('.hbs', expressHandlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
*/
app.get('/secret', async (req, res) => {
  const intent = await stripe.paymentIntents.create({
  amount: 1099,
  currency: 'usd',
	  metadata: {integration_check: 'accept_a_payment'}
});
	res.json({client_secret: intent.client_secret });
});


app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000)