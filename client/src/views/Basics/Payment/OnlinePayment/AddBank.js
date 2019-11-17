import React, { Component } from 'react';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  UncontrolledDropdown, 
  Modal,
  ModalBody
} from 'reactstrap'; 
import axios from 'axios';
import apis from "../../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {listCounties} from '../../../../utils'
import PropTypes from 'prop-types';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import {
    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PostalCodeElement,
    PaymentRequestButtonElement,
    IbanElement,
    IdealBankElement,
    StripeProvider,
    injectStripe,
    Elements
  } from "react-stripe-elements";
import Lottie from 'react-lottie';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class AddBank extends Component {

  constructor(props) {
    super(props);

    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleIBANChange = this.handleIBANChange.bind(this)

    this.state = {
      loadingModal: false,
      agreementChecked: false,
      catererPaymentAccoundID: "",
      catererEmail: "",
      holdername:"",
      holdertype: "",
      iban: "",
      country: "",
      currency: "EUR",
      isNextButtonActive: false,
      isProceedButtonVisible: false,
      isSaving: false,
    };

    this.HolderType  = [
        {
            "key": "Individual",
            "value": "individual"
        },
        {
            "key": "Company",
            "value": "company"
        },
    ]

    this.EuropeCountry  = [
        {
            "key": "Austria",
            "value": "AT"
        },
        {
            "key": "Belgium",
            "value": "BE"
        },
        {
            "key": "Denmark",
            "value": "DK"
        },
        {
            "key": "Finland",
            "value": "FI"
        },
        {
            "key": "France",
            "value": "FR"
        },
        {
            "key": "Germany",
            "value": "DE"
        },
        {
            "key": "Ireland",
            "value": "IE"
        },
        {
            "key": "Italy",
            "value": "IT"
        },
        {
            "key": "Luxembourg",
            "value": "LU"
        },
        {
            "key": "Netherlands",
            "value": "NL"
        },
        {
            "key": "Norway",
            "value": "NO"
        },
        {
            "key": "Portugal",
            "value": "PT"
        },
        {
            "key": "Spain",
            "value": "ES"
        },
        {
            "key": "Sweden",
            "value": "SE"
        },
        {
            "key": "Switzerland",
            "value": "CH"
        },
        {
            "key": "United Kingdom",
            "value": "UK"
        },
      ];
  }

  componentDidMount() {

    var currentDate = moment().subtract(13, 'years').toDate();

    this.setState({
      maxDate: currentDate
    })
   
   if (this.props.catererPaymentAccoundID && this.props.catererPaymentAccoundID !== "") {
     this.setState({
        catererPaymentAccoundID: this.props.catererPaymentAccoundID,
     })
   }
   if (this.props.catererEmail && this.props.catererEmail !== "") {
      this.setState({
        catererEmail: this.props.catererEmail
      })
   }
  }

  handleIBANChange(e) {
    this.setState({ 
      iban: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleHolderType(e) {
    this.setState({ 
      holdertype: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  ///////////////////////////////////////////////Name Change////////////////////////////////////////////////////////////

  handleHolderNameChange(e) {
    this.setState({ 
      holdername: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  /////////////////////////////////////////////////Address Change//////////////////////////////////////////////////

  
  handleCountryChange(e) {
    this.setState({ 
      country: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  //////////////////////////////////////////////Checkbox Change////////////////////////////////////////////////////////////

  handleCheckBoxChange = (e) => {
    this.setState({
      agreementChecked: !this.state.agreementChecked
    }, () => {
      this.checkAllInput()
    })
  }

  openStripeServicesAgreement = () => {
    window.open('https://stripe.com/ssa', '_blank');
  }

  openConnectedAccountAgreement = () => {
    window.open('https://stripe.com/connect-account/legal', '_blank');
  }

  checkAllInput = () => {
    const { holdername, country, agreementChecked, iban,  holdertype, } = this.state
    
    if (agreementChecked && holdertype !== "" && country !== "" && iban !== "" && holdername !== "" ) {
        this.setState({ 
          isNextButtonActive: true, 
        });
    }
    else {
        this.setState({ 
          isNextButtonActive: false, 
        });  
    }
  }

  handleProceed = () => {
    this.props.history.push('/caterer/reports/order')
  }

  generateBankToken = () => {

    this.setState({
      loadingModal: true
    })

    const {country, iban, currency, holdername, holdertype, } = this.state

    if (this.props.stripe) {
        this.props.stripe.createToken(
            'bank_account',
            {
              country: country,
              currency: currency,
              account_holder_name: holdername,
              account_holder_type: holdertype,
              account_number: iban
            })
            .then((err, payload) => 
              {
                if (err) {
                  if (err.error) {
                    toast(<ErrorInfo/>, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    });
                    this.setState({
                      loadingModal: false
                    })
                  }
                  else if (err.token) {
                    this.updateBankAccount(err.token.id)
                  }
                }
                else {
                  this.updateBankAccount(payload.id)
                }
            });
    }
    else {
      toast(<ErrorInfo/>, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      this.setState({
        loadingModal: false
      })
    }
  }

  updateBankAccount = (token) => {

    var headers = {
        'Content-Type': 'application/json',
    }

    var url = apis.POSTcreate_caterer_external_bankaccount;

    var body = {
       catererPaymentAccoundID: this.state.catererPaymentAccoundID, bankacctoken: token 
    }

    axios.post(url, body, {headers: headers})
    .then((response) => {
        if (response.status === 200) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false
          }, () => {
            this.props.goBack()
          })
        } 
    })
    .catch((error) => {
        if (error) {
          toast(<ErrorInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false
          })  
        }
    });
  }

  renderLoadingModal() {

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: require('../../../../assets/animation/payment_loading.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <Modal    
        aria-labelledby="contained-modal-title-vcenter"
        centered
        isOpen={this.state.loadingModal} >
        <ModalBody>
          <div>
            <Lottie 
              options={defaultOptions}
              height={200}
              width={200}/>

            <p style={{textAlign: 'center', paddingLeft:20, paddingRight:20, fontSize: 16, fontWeight: '600'}}>
              Please don't close the browser or refresh the page while we are connecting to your payment account. This proccess may take a while.
            </p>
          </div>
        </ModalBody>
      </Modal>
    )
  }


  render() {
    const { isNextButtonActive, isProceedButtonVisible, isSaving} = this.state

    return (
      <div>
        <Card >
          <CardHeader>
            <strong>Add Bank Account</strong>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label >Holder Type</Label>
              <Input value={this.state.holdertype} onChange={(e) => this.handleHolderType(e)} style={{color: this.state.holdertype == "" ? 'grey': 'black'}} type="select" name="holdertype">
              <option value='' disabled>Select Holder Type</option>
              {this.HolderType.map(holdertype =>
                <option style={{color:'black'}} key={holdertype.key} value={holdertype.value}>{holdertype.key}</option>
              )}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label >Holder Name</Label>
              <Input style={{color: 'black'}} value={this.state.holdername} onChange={(e) => this.handleHolderNameChange(e)} type="text" id="holdername" placeholder="Enter account holder name" />
            </FormGroup>
           
            <FormGroup>
              <Label >Currency</Label>
              <Input value={this.state.currency} disabled type="text" name="currency" ></Input>
            </FormGroup>

            <FormGroup>
              <Label >Country</Label>
              <Input value={this.state.country} onChange={(e) => this.handleCountryChange(e)} style={{color: this.state.country == "" ? 'grey': 'black'}} type="select" name="country">
              <option value='' disabled>Select Country</option>
              {this.EuropeCountry.map(country =>
                <option style={{color:'black'}} key={country.key} value={country.value}>{country.key}</option>
              )}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label >IBAN</Label>
              <Input style={{color: 'black'}} value={this.state.iban} onChange={(e) => this.handleIBANChange(e)} type="text" id="IBAN" placeholder="Enter your IBAN number"/>
              <FormFeedback>Please enter your IBAN number</FormFeedback>
            </FormGroup>

            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <Checkbox
                checked={this.state.agreementChecked}
                onChange={e => this.handleCheckBoxChange(e)}
                style={{ padding: 0, marginRight: 10 }}
              />
              <span style={{ fontSize: 14 }} >
                I accept the
              </span>
              <Button color="link" onClick={() => this.openStripeServicesAgreement()} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                Stripe Services 
              </Button>
              <span style={{ fontSize: 14 }} >
                and
              </span>
              <Button color="link" onClick={() => this.openConnectedAccountAgreement()} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                Connected Account 
              </Button>
              <span style={{ fontSize: 14 }} >
                agreements
              </span>
              
            </div>
           
            <div className="form-actions">
              <Button onClick={() => this.props.goBack()} className="float-left" type="submit" outline color="primary">Back</Button>

              {isProceedButtonVisible ? 
              <Button style={{marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
              : null}
              <Button disabled={isNextButtonActive? false : true} onClick={() => this.generateBankToken()} className="float-right" type="submit" color="primary">{isSaving ? "Saving..." : "Save" }</Button>
            </div>
          </CardBody>
        </Card>
        
        {this.renderLoadingModal()}

        <ToastContainer hideProgressBar/>
      </div>
    );
  }
}

const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Addded</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error adding account. Please try again</b>
   
  </div>
)


AddBank.propTypes = propTypes;
AddBank.defaultProps = defaultProps;

export default AddBank;
