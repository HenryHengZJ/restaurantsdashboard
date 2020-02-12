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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
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
import './style.css';
import axios from 'axios';
import apis from "../../../../apis";
import AddBank from "./AddBank";
import DisplayBankAccount from "./DisplayBankAccount";
import ContentLoader, { Facebook } from "react-content-loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class OnlinePayment extends Component {

  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleVerify = this.handleVerify.bind(this);

    this.state = {
      loading: true,
      catererEmail: "",
      catererPaymentAccountID: "",
      addBank: false,
      holdertype: "",
      country: "",
      currency: "EUR",
      catererpaymentdetails: null,
      paymentcarddetails: [],
      isNextButtonActive: false,
      verifyAccount: false,
      pendingVerification: false,
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

    this.getCatererAccount()
   
  }

  getCatererAccount = () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererPaymentAccountID: typeof response.data[0].catererPaymentAccountID !== 'undefined' ? response.data[0].catererPaymentAccountID : "",
            catererEmail: typeof response.data[0].catererEmail !== 'undefined' ? response.data[0].catererEmail : "",
          }, () => {
            this.getCatererPaymentAccount(this.state.catererPaymentAccountID)
          })
        } 
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          loading: false
        })
      });
  }

  getCatererPaymentAccount = (catererPaymentAccountID) => {

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer_paymentaccount + "?catererPaymentAccountID=" + catererPaymentAccountID;

    axios.get(url, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          this.setState({
            paymentcarddetails: response.data.external_accounts.data,
            catererpaymentdetails: response.data,
            verifyAccount: response.data.requirements.disabled_reason === null ? false : response.data.requirements.past_due.length === 0 ? false :  response.data.requirements.past_due.length === 1 && response.data.requirements.past_due[0] === 'external_account' ? false  : true,
            pendingVerification: response.data.requirements.pending_verification.length > 0 ? true : false,
            loading: false
          })
          if (response.data.business_type !== null && response.data.country !== null) {
            this.getInput('holdertype', response.data.business_type)
            this.getInput('country', response.data.country)
          }
        } 
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          loading: false
        })
      });
  }

  getInput = (type, value) => {
    if (type === 'holdertype') {
      for (let i = 0; i < this.HolderType.length; i++) { 
        if (value === this.HolderType[i].value) {
          this.setState({
            holdertype: this.HolderType[i].key
          })
        }
      }
    }
    else {
      for (let x = 0; x < this.EuropeCountry.length; x++) { 
        if (value === this.EuropeCountry[x].value) {
          this.setState({
            country: this.EuropeCountry[x].key
          })
        }
      }
    }
  }

  clearInput = () => {
    this.setState({
      holdertype: "",
      country: "",
      verifyAccount: false,
      isNextButtonActive: false,
      catererPaymentAccountID: "",
    })
  }

  toggleModal() {
    this.setState({
      pgprovidermodal: !this.state.pgprovidermodal,
    });
  }

  handleNext() {
    this.addNewCard()
  }

  handleVerify() {
    this.gotoAccountLink(this.state.catererPaymentAccountID)
  }

  handleHolderType(e) {
    this.setState({ 
      holdertype: e.target.value, 
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


  goBack() {
    this.setState({
      addBank: false
    }, () => {
      this.getCatererAccount()
    })
  }

  addBankClicked(e) {
    e.preventDefault()
    this.setState({
      addBank: true,
    })
  }

  checkAllInput = () => {
    const { country,   holdertype, } = this.state
    
    if ( holdertype !== "" && country !== "" ) {
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

  addNewCard = () => {

    this.setState({
      loading: true
    })

    const {catererEmail, holdertype, country } = this.state

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.POSTcreate_caterer_paymentaccount;

    var body = {
      email: catererEmail ,
      business_type: holdertype,
      country: country,
    }

    axios.post(url, body, {headers: headers})
    .then((response) => {
        if (response.status === 200) {
          const catererPaymentAccountID =  response.data.id
          this.updateUserData(catererPaymentAccountID)
        } 
    })
    .catch((error) => {
      if (error) {
          toast(<ErrorInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loading: false
          })
        }
    });
  }

  updateUserData = (catererPaymentAccountID) => {
    
    var data = {
      catererPaymentAccountID: catererPaymentAccountID,
    }

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.UPDATEcaterer;

    axios.put(url, data, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.gotoAccountLink(catererPaymentAccountID)
        }
      })
      .catch((error) => {
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          loading: false
        })  
      });
  }


  gotoAccountLink = (catererPaymentAccountID) => {

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.POSTcreate_accountlink;

    var body = {
      accountID: catererPaymentAccountID ,
    }

    axios.post(url, body, {headers: headers})
    .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererPaymentAccountID: catererPaymentAccountID
          }, () => {
            window.location.assign(response.data.url);
          })
        } 
    })
    .catch((error) => {
      if (error) {
          toast(<ErrorInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loading: false
          })
        }
    });

  }

  renderPGProviderModal() {
    return (
      <Modal isOpen={this.state.pgprovidermodal} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Payment Gateway Provider</ModalHeader>
        <ModalBody>
          <img style={{objectFit:'cover', width: 80, height: 45 }} src={require("../../../../assets/img/stripe.png")}  />
          <div style={{ marginTop: 20 }}>
            <span><a className="h6" href="https://stripe.com/ie/payments">Stripe</a> is a technology company that allows individuals and businesses to receive payments over the Internet. Stripe provides the technical, fraud prevention, and banking infrastructure required to operate on-line payment systems.</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <Table bordered responsive>
              <tbody>
                <tr>
                  <td >Setup fee:</td>
                  <td className="h6">€0</td>
                </tr>
                <tr>
                  <td >Monthly fee:</td>
                  <td className="h6">€0</td>
                </tr>
                <tr>
                  <td >Transaction fee:</td>
                  <td>
                    <span><strong>1.4% + €0.25</strong> (European cards) *excluding VAT</span>
                    <div>
                      <span><strong>2.9% + €0.25</strong> (Non-European cards) *excluding VAT</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td >Payout:</td>
                  <td>
                    <span><strong>Daily</strong> (7 day rolling basis)</span>
                  </td>
                </tr>
                <tr>
                  <td >Application:</td>
                  <td>
                    <span><strong>Online</strong> (Approval usually within hours)</span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.toggleModal} color="primary" >Got It</Button>
        </ModalFooter>
      </Modal>
    )
  }

  renderAddBank() {
    return <AddBank catererEmail={this.state.catererEmail} catererPaymentAccountID={this.state.catererPaymentAccountID} stripe={this.props.stripe} goBack={()=>this.goBack()}/>
  }

  renderDisplayBankAccount() {
    return <DisplayBankAccount pendingVerification={this.state.pendingVerification} catererpaymentdetails={this.state.catererpaymentdetails} paymentcarddetails={this.state.paymentcarddetails.reverse()} addBank={(e) =>this.addBankClicked(e)} updateBankAccount={() =>this.getCatererPaymentAccount(this.state.catererPaymentAccountID)}/>
  }

  
  renderLoadingItems() {
    var itemsarray = [];

    for (let i = 0; i < 2; i++) {
      itemsarray.push(
        <Col key={i} xs="12">
          <ContentLoader height="250">
            <rect x="0" y="0" rx="6" ry="6" width="100%" height="220" />
          </ContentLoader>
        </Col>
      );
    }

    return (
      <Card >
        <CardHeader>
          <strong>Online Payment</strong>
        </CardHeader>
        <CardBody>
          <Row
            style={{
              marginTop: 10
            }}
          >
            {itemsarray}
          </Row>
        </CardBody>
      </Card>
    );
  }

  renderOnlinePayment() {

    return (
      <Card >
        <CardHeader>
          <strong>Online Payment</strong>
        </CardHeader>
        <CardBody>

          <FormGroup>
            <Label style={{fontWeight: '600'}}>Holder Type</Label>
            {this.state.verifyAccount ? 
            <Input value={this.state.holdertype} disabled type="text" name="holdertype" ></Input>
            :
            <Input value={this.state.holdertype} onChange={(e) => this.handleHolderType(e)} style={{color: this.state.holdertype == "" ? 'grey': 'black'}} type="select" name="holdertype">
              <option value='' disabled>Select Holder Type</option>
              {this.HolderType.map(holdertype =>
                <option style={{color:'black'}} key={holdertype.key} value={holdertype.value}>{holdertype.key}</option>
              )}
            </Input>
            }
          </FormGroup>

          <FormGroup>
            <Label style={{fontWeight: '600'}}>Currency</Label>
            <Input value={this.state.currency} disabled type="text" name="currency" ></Input>
          </FormGroup>

          <FormGroup>
            <Label style={{fontWeight: '600'}}>Country</Label>
            {this.state.verifyAccount ? 
            <Input value={this.state.country} disabled type="text" name="country" ></Input>
            :
            <Input value={this.state.country} onChange={(e) => this.handleCountryChange(e)} style={{color: this.state.country == "" ? 'grey': 'black'}} type="select" name="country">
              <option value='' disabled>Select Country</option>
              {this.EuropeCountry.map(country =>
                <option style={{color:'black'}} key={country.key} value={country.value}>{country.key}</option>
              )}
            </Input>
            }
          </FormGroup>

          <div>
              <Label style={{marginTop: 10, marginBottom: 20}}>Payment Gateway Provider</Label>
              <Row>
                <Card style={{marginLeft: 15, borderColor: '#20a8d8'}}>
                  <CardBody>
                    <Col>
                      <img style={{ objectFit:'cover', width: 60, height: 30 }} src={require("../../../../assets/img/stripe.png")}  />
                    </Col>
                  </CardBody>
                </Card>
                <Button onClick={this.toggleModal} color="link">What is Stripe?</Button>
              </Row>
          </div>

          <div className="form-actions">
            {this.state.verifyAccount ? 
            <Button style={{marginTop: 20}} onClick={this.handleVerify} className="float-right" type="submit" color="success">Verify Account</Button>
              :
            <Button style={{marginTop: 20}} onClick={this.handleNext} disabled={!this.state.isNextButtonActive} className="float-right" type="submit" color="primary">Setup Account</Button>
            }

            {this.state.verifyAccount ? 
            <Button style={{marginTop: 20}} onClick={() => this.clearInput()} className="float-left" type="submit" color="primary">New account</Button>
              : null }
          </div>

          {this.renderPGProviderModal()}
          
        </CardBody>
      </Card>
    )
  }


  render() {

    return (

      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="9" sm="9" lg="9">
            {this.state.loading ? 
            this.renderLoadingItems() 
            : this.state.addBank ? this.renderAddBank() : this.state.catererPaymentAccountID !== "" && !this.state.verifyAccount ? this.renderDisplayBankAccount() : this.renderOnlinePayment()
            }
          </Col>
        </Row>
        
        <ToastContainer hideProgressBar/>

      </div>

    );
  }
}


const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Account created</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error adding account. Please try again</b>
   
  </div>
)


export default injectStripe(OnlinePayment);
