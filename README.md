# braintree-dropin-react

React component to integrate Braintree Drop-In UI (V3).
https://developers.braintreepayments.com/guides/drop-in/javascript/v3

### Features
* Wraps the Braintree Drop-In UI V3
* If ```authorizationToken``` is changed the Drop-In UI will be re-initialized. This is useful if you want to support multiple merchants.

### Props

* braintree - Required, this is braintree-web-drop-in
* authorizationToken - Required, authorization for Drop-In [see in DOC](https://developers.braintreepayments.com/guides/drop-in/javascript/v3#configuration)
* handlePaymentMethod - Required, to retrieve the payment method object
* onCreate - triggered when Drop-In UI is visible
* onError - triggered when error occured
* onDestroyStart - triggered before teardown
* onDestroyEnd - triggered after success teardown
* locale - [see in DOC](https://developers.braintreepayments.com/guides/drop-in/javascript/v3#availability)
* paypal - [see in DOC](https://developers.braintreepayments.com/guides/drop-in/javascript/v3#accepting-paypal)
* paypalCredit - [see in DOC](https://developers.braintreepayments.com/guides/drop-in/javascript/v3#accepting-paypal-credit)
* paymentOptionPriority - [see in DOC](https://developers.braintreepayments.com/guides/drop-in/javascript/v3#payment-option-priority)
* submitButtonText - Text of the submit button

### Installation

```sh
$ npm install braintree-dropin-react
```

### Example
see /example/clientApp.js

to run
```sh
$ yarn install
$ npm run example
```

### Custom CSS
payment form - [see in DOC](https://developers.braintreepayments.com/guides/drop-in/javascript/v3#custom-css)

component - write your own custom css
```sh
div.braintree-dropin-react
  div.braintree-dropin-react-form
  div.braintree-dropin-react-submit-btn-wrapper
    button
```
