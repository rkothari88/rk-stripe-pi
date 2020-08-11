//Initialization
var stripe = Stripe('pk_test_51HEQTcAlhU4pmDMqItrtHhZngnBMptDRwYAQzaSVRWP0zHGa28FYSksZkM9VIA97v1Y3RXIFbg8o0pl4Wdn2UUQY005bjenevS');
var elements = stripe.elements();
var style = {
  base: {
    color: "#32325d",
  }
};		

// Create card input element and error handling

var card = elements.create("card", { style: style });
card.mount('#card-element');

card.on('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

// Process the call to Stripe

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
  ev.preventDefault();
  (async () => {
    const response = await fetch('/secret');
    const {client_secret: clientSecret} = await response.json();
	console.log(clientSecret);
    // Call stripe.confirmCardPayment() with the client secret.
	
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: 'Jenny Rosen'
      }
    }
  }).then(function(result) {
	  console.log(result);
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
		alert("Oh no! Try again!");
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
		  alert("Payment successful. Don't contact us if your shipment of nothing arrives never.")
		  window.location.href = '/index.html';
      }
    }
  });
	
	
  })();
  

});