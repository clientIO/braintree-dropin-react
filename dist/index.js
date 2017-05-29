'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BraintreeDropIn = function (_React$Component) {
  _inherits(BraintreeDropIn, _React$Component);

  function BraintreeDropIn(props) {
    _classCallCheck(this, BraintreeDropIn);

    var _this = _possibleConstructorReturn(this, (BraintreeDropIn.__proto__ || Object.getPrototypeOf(BraintreeDropIn)).call(this, props));

    _this.componentDidMount = function () {
      if (!_this.props.braintree || _this.state.dropInInstance) return;
      _this.setup();
    };

    _this.componentDidUpdate = function (prevProps, prevState) {
      if (_this.props.authorizationToken && _this.state.dropInInstance && prevProps.authorizationToken !== _this.props.authorizationToken) {
        _this.tearDown().then(function () {
          _this.setState({
            dropInInstance: null,
            isSubmitButtonDisabled: true
          }, function () {
            _this.setup();
          });
        }).catch(function (err) {
          if (_this.props.onError) {
            _this.props.onError(err);
          }
        });
      }
    };

    _this.componentWillUnmount = function () {
      if (!_this.state.dropInInstance) return;

      _this.tearDown().catch(function (err) {
        if (_this.props.onError) {
          _this.props.onError(err);
        }
      });
    };

    _this.setup = function () {
      _this.props.braintree.create({
        authorization: _this.props.authorizationToken,
        selector: '.braintree-dropin-react-form',
        locale: _this.props.locale,
        paypal: _this.props.paypal,
        paypalCredit: _this.props.paypalCredit,
        paymentOptionPriority: _this.props.paymentOptionPriority
      }, function (err, dropinInstance) {
        if (err) {
          if (_this.props.onError) {
            _this.props.onError(err);
          }
          return;
        } else {
          if (_this.props.onCreate) {
            _this.props.onCreate(dropinInstance);
          }
        }

        if (dropinInstance.isPaymentMethodRequestable()) {
          _this.setState({
            isSubmitButtonDisabled: false
          });
        }

        dropinInstance.on('paymentMethodRequestable', function (event) {
          _this.setState({
            isSubmitButtonDisabled: false
          });
        });

        dropinInstance.on('noPaymentMethodRequestable', function () {
          _this.setState({
            isSubmitButtonDisabled: true
          });
        });

        _this.setState({
          dropInInstance: dropinInstance
        });
      });
    };

    _this.tearDown = function () {
      if (_this.props.onDestroyStart) {
        _this.props.onDestroyStart();
      }
      return new Promise(function (resolve, reject) {
        _this.state.dropInInstance.teardown(function (err) {
          if (_this.props.onDestroyEnd) {
            _this.props.onDestroyEnd(err);
          }
          if (err) {
            return reject(err);
          } else {
            return resolve();
          }
        });
      });
    };

    _this.handleSubmit = function (event) {
      event.preventDefault();
      if (_this.state.dropInInstance) {
        _this.state.dropInInstance.requestPaymentMethod(function (err, payload) {
          if (err) {
            if (_this.props.onError) {
              _this.props.onError(err);
            }
          } else {
            _this.props.handlePaymentMethod(payload);
          }
        });
      }
    };

    _this.render = function () {
      return _react2.default.createElement(
        'div',
        { className: 'braintree-dropin-react' },
        _react2.default.createElement('div', { className: 'braintree-dropin-react-form' }),
        _react2.default.createElement(
          'div',
          { className: 'braintree-dropin-react-submit-btn-wrapper' },
          _react2.default.createElement(
            'button',
            {
              onClick: _this.handleSubmit,
              disabled: _this.state.isSubmitButtonDisabled
            },
            _this.props.submitButtonText || 'Purchase'
          )
        )
      );
    };

    _this.state = {
      dropInInstance: null,
      isSubmitButtonDisabled: true
    };
    return _this;
  }

  return BraintreeDropIn;
}(_react2.default.Component);

BraintreeDropIn.propTypes = {
  braintree: _propTypes2.default.object.isRequired,
  authorizationToken: _propTypes2.default.string.isRequired,
  handlePaymentMethod: _propTypes2.default.func.isRequired,
  onCreate: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  onDestroyStart: _propTypes2.default.func,
  onDestroyEnd: _propTypes2.default.func,
  locale: _propTypes2.default.string,
  paypal: _propTypes2.default.object,
  paypalCredit: _propTypes2.default.object,
  paymentOptionPriority: _propTypes2.default.array,
  submitButtonText: _propTypes2.default.string
};

exports.default = BraintreeDropIn;
