import React from 'react'
import PropTypes from 'prop-types'

class BraintreeDropIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dropInInstance: null,
      isSubmitButtonDisabled: true
    }
  }

  componentDidMount = () => {
    if (!this.props.braintree || this.state.dropInInstance) return
    this.setup()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.authorizationToken &&
      this.state.dropInInstance &&
      prevProps.authorizationToken !== this.props.authorizationToken
    ) {
      this.tearDown().then(() => {
        this.setState({
          dropInInstance: null,
          isSubmitButtonDisabled: true
        }, () => {
          this.setup()
        })
      }).catch((err) => {
        if (this.props.onError) {
          this.props.onError(err)
        }
      })
    }
  }

  componentWillUnmount = () => {
    if (!this.state.dropInInstance) return

    this.tearDown().catch((err) => {
      if (this.props.onError) {
        this.props.onError(err)
      }
    })
  }

  setup = () => {
    this.props.braintree.create({
      authorization: this.props.authorizationToken,
      selector: '.braintree-dropin-react-form',
      locale: this.props.locale,
      paypal: this.props.paypal,
      paypalCredit: this.props.paypalCredit,
      paymentOptionPriority: this.props.paymentOptionPriority
    }, (err, dropinInstance) => {
      if (err) {
        if (this.props.onError) {
          this.props.onError(err)
        }
        return
      } else {
        if (this.props.onCreate) {
          this.props.onCreate(dropinInstance)
        }
      }

      if (dropinInstance.isPaymentMethodRequestable()) {
        this.setState({
          isSubmitButtonDisabled: false
        })
      }

      dropinInstance.on('paymentMethodRequestable', (event) => {
        this.setState({
          isSubmitButtonDisabled: false
        })
      })

      dropinInstance.on('noPaymentMethodRequestable', () => {
        this.setState({
          isSubmitButtonDisabled: true
        })
      })

      this.setState({
        dropInInstance: dropinInstance
      })
    })
  }

  tearDown = () => {
    if (this.props.onDestroyStart) {
      this.props.onDestroyStart()
    }
    return new Promise((resolve, reject) => {
      this.state.dropInInstance.teardown((err) => {
        if (this.props.onDestroyEnd) {
          this.props.onDestroyEnd(err)
        }
        if (err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.dropInInstance) {
      this.state.dropInInstance.requestPaymentMethod((err, payload) => {
        if (err) {
          if (this.props.onError) {
            this.props.onError(err)
          }
        } else {
          this.props.handlePaymentMethod(payload)
        }
      })
    }
  }

  render = () => {
    return (
      <div className='braintree-dropin-react'>
        <div className='braintree-dropin-react-form' />
        <div className='braintree-dropin-react-submit-btn-wrapper'>
          <button
            onClick={this.handleSubmit}
            disabled={this.state.isSubmitButtonDisabled}
          >{this.props.submitButtonText || 'Purchase'}</button>
        </div>
      </div>
    )
  }
}

BraintreeDropIn.propTypes = {
  braintree: PropTypes.object.isRequired,
  authorizationToken: PropTypes.string.isRequired,
  handlePaymentMethod: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onError: PropTypes.func,
  onDestroyStart: PropTypes.func,
  onDestroyEnd: PropTypes.func,
  locale: PropTypes.string,
  paypal: PropTypes.object,
  paypalCredit: PropTypes.object,
  paymentOptionPriority: PropTypes.array,
  submitButtonText: PropTypes.string
}

export default BraintreeDropIn
