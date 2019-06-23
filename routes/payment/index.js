var express = require('express');
var router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.get('/get_customer_paymentaccount', (req, res) => { 

	stripe.customers.retrieve(req.query.customerPaymentAccoundID, function(err, customer) {
		if (err) return res.status(500).send({ error: err });
		res.status(200).json(customer);
	});
	
});

//////////////////////////////////////CATERER///////////////////////////////////////////////////

router.post('/create_caterer_paymentaccount', (req, res) => { 

  console.log(req.body)

  var body = req.body
  body.type = 'custom';
  body.tos_acceptance =  {
    date: Math.floor(Date.now() / 1000),
    ip: req.connection.remoteAddress // Assumes you're not using a proxy
  };

  console.log(body)

    stripe.accounts.create(body, function(err, acct) {
      // asynchronously called
      if (err) return res.status(500).send({ error: err });
      return res.send(acct);
    });
	
});



router.get('/get_caterer_paymentaccount', (req, res) => { 

	stripe.accounts.retrieve(req.query.catererPaymentAccoundID, function(err, connectedacc) {
		if (err) return res.status(500).send({ error: err });
		res.status(200).json(connectedacc);
	});
	
});


router.get('/get_caterer_person', (req, res) => { 

	stripe.accounts.listPersons(
    req.query.catererPaymentAccoundID,
    function(err, persons) {
      if (err) return res.status(500).send({ error: err });
      res.status(200).json(persons);
    }
  );
	
});

router.get('/get_caterer_balance', (req, res) => { 

  stripe.balance.retrieve({
    stripe_account: req.query.catererPaymentAccoundID
  }, function(err, connectedacc) {
		if (err) return res.status(500).send({ error: err });
		res.status(200).json(connectedacc);
	});
	
});


router.post('/create_caterer_external_bankaccount', (req, res) => { 

    stripe.accounts.createExternalAccount(req.body.catererPaymentAccoundID,{external_account: req.body.bankacctoken}, function(err, connectedacc) {
      
      if (err) {
        console.log(err)
        return res.status(500).send({ error: err });
      }
      else {
        res.status(200).json(connectedacc);
      }

    });
	
});

router.put('/update_caterer_external_bankaccount', (req, res) => { 

  stripe.accounts.updateExternalAccount( req.body.catererPaymentAccoundID, req.body.bankID,
    { default_for_currency: true },
    function(err, bank_account) {
      if (err) return res.status(500).send({ error: err });
      res.status(201).json(bank_account);
  });

});

router.delete('/delete_caterer_external_bankaccount', (req, res) => { 

  console.log(req.query.catererPaymentAccoundID)

  console.log(req.query.bankID)

  stripe.accounts.deleteExternalAccount(req.query.catererPaymentAccoundID, req.query.bankID, function(err, confirmation) {
    if (err) {
      console.log(err)
      return res.status(500).send({ error: err });
    }
    else {
      res.status(200).json(confirmation);
    }
  });

});


router.put('/update_caterer_paymentaccount', (req, res) => { 

    var updatebody = req.body.updatebody

    console.log(updatebody)

    stripe.accounts.update(
        req.body.catererPaymentAccoundID,
        updatebody,
        function(err, connectedacc) {
            if (err) {
              console.log(err)
              return res.status(500).send({ error: err });
            }
            else {
              res.status(201).json(connectedacc);
            }
        });
    
});

router.put('/update_caterer_person', (req, res) => { 

  var persondetails = req.body.persondetails

  console.log(persondetails)

  stripe.accounts.createPerson(
    req.body.catererPaymentAccoundID,
    persondetails,
    function(err, person) {
      if (err) {
        console.log(err)
        return res.status(500).send({ error: err });
      }
      else {
        res.status(201).json(person);
      }
    }
  );
  
});

router.post('/caterer_confirm_payment', (request, res) => { 
	stripe.paymentIntents.confirm(request.body.paymentIntentID, function(err, intent) {
		if (err) return res.status(500).send({ error: err });
		res.status(200).json(intent);
	});
});

router.post('/confirm_payment', async (request, response) => {
    try {
      let intent;
      if (request.body.payment_method_id) {
        console.log(request.body.payment_method_id)
        // Create the PaymentIntent
        intent = await stripe.paymentIntents.create({
          payment_method: request.body.payment_method_id,
          payment_method_types: ['card'],
          currency: 'eur',
          application_fee_amount: 123,
          customer: request.body.customerPaymentAccoundID,
          statement_descriptor: 'New Order',
          amount: 1099,
          confirmation_method: 'manual',
          confirm: true,
          transfer_data: {
            destination: request.body.catererPaymentAccoundID,
          },
        });
      } else if (request.body.payment_intent_id) {
        console.log(request.body.payment_intent_id)
        intent = await stripe.paymentIntents.confirm(
          request.body.payment_intent_id
        );
      }
      // Send the response to the client
      response.send(generate_payment_response(intent));
    } catch (e) {
      // Display error on client
      return response.send({ error: e.message });
    }
  });
  
  const generate_payment_response = (intent) => {
    if (
      intent.status === 'requires_action' &&
      intent.next_action.type === 'use_stripe_sdk'
    ) {
      // Tell the client to handle the action
      return {
        requires_action: true,
        payment_intent_client_secret: intent.client_secret
      };
    } else if (intent.status === 'succeeded') {
      // The payment didn’t need any additional actions and completed!
      // Handle post-payment fulfillment
      return {
        success: true
      };
    } else {
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status'
      }
    }
  };
  



module.exports = router;
