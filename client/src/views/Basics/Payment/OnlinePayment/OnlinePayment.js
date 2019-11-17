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
import SetupBank from "./SetupBank";
import AddBank from "./AddBank";
import DisplayBankAccount from "./DisplayBankAccount";
import ContentLoader, { Facebook } from "react-content-loader";

class OnlinePayment extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleCardHolderName = this.handleCardHolderName.bind(this);

    this.state = {
      loading: true,
      catererEmail: "",
      catererPaymentAccoundID: "",
      addBank: false,
      setupBank: false,
      collapse: true,
      isMasterCardChecked: true,
      isVisaCardChecked: true,
      isAmericanExpressChecked: true,
      cardElement: null,
      cardholdername: "",
      isCardHolderNameEmpty: "",
      catererpaymentdetails: null,
      paymentcarddetails: []
    };
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
            catererPaymentAccoundID: typeof response.data[0].catererPaymentAccoundID !== 'undefined' ? response.data[0].catererPaymentAccoundID : "",
            catererEmail: typeof response.data[0].catererEmail !== 'undefined' ? response.data[0].catererEmail : "",
          }, () => {
            this.getCatererPaymentAccount(this.state.catererPaymentAccoundID)
          })
        } 
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
      });
  }

  getCatererPaymentAccount = (catererPaymentAccoundID) => {

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer_paymentaccount + "?catererPaymentAccoundID=" + catererPaymentAccoundID;

    axios.get(url, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            paymentcarddetails: response.data.external_accounts.data,
            catererpaymentdetails: response.data,
            loading: false
          })
        } 
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
      });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleModal() {
    this.setState({
      pgprovidermodal: !this.state.pgprovidermodal,
    });
  }

  handleNext() {
    this.setState({
      setupBank: true
    })
  }

  goBack() {
    this.setState({
      setupBank: false,
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

  handleCheckbox(e) {
    const name = e.target.name;
    const checked = e.target.checked;
    this.setState({
      [name]: !this.state[name]
    })
  }

  handleCardHolderName(e) {
    this.setState({
      cardholdername: e.target.value,
      isCardHolderNameEmpty: false
    });
  }

  handleSubmit = async ev => {
    const { isCardHolderNameEmpty, cardholdername } = this.state;

    ev.preventDefault();
    if (this.props.stripe) {
      /*this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'})
      .then((err, payload) => 
        {
          if (err) {
            alert(JSON.stringify(err))
          }
          else {
            alert('[token]', payload)
          }
      });

      this.props.stripe.createToken(
        'bank_account',
        {
          country: 'DE',
          currency: 'EUR',
          account_holder_name: 'ss',
          account_holder_type: 'individual',
          account_number: 'DE89370400440532013000',
        })
        .then((err, payload) => 
          {
            if (err) {
              alert(JSON.stringify(err))
            }
            else {
              alert('[token]', payload)
            }
        });*/

      if (cardholdername === "") {
        this.setState({
          isCardHolderNameEmpty: true
        });
      } else {
        const {
          paymentMethod,
          error
        } = await this.props.stripe.createPaymentMethod("card", this.state.cardElement, {
          billing_details: { name: cardholdername }
        });
        if (error) {
          // Show error in payment form
          alert(JSON.stringify(error));
        } else {
          // Send paymentMethod.id to your server (see Step 2)
        
          const response = await fetch(apis.POSTconfirm_payment, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payment_method_id: paymentMethod.id, catererPaymentAccoundID: "acct_1EfY1KLxUavDIOFF", customerPaymentAccoundID: "cus_FA9wbWP1GOicRC" })
          });

          const json = await response.json();

          // Handle server response (see Step 3)
          this.handleServerResponse(json);
        }
      }
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  handleServerResponse = async (response) => {
    if (response.error) {
      // Show error from server on payment form
    } else if (response.requires_action) {
      // Use Stripe.js to handle the required card action
      const { error: errorAction, paymentIntent } =
        await this.props.stripe.handleCardAction(response.payment_intent_client_secret);
  
      if (errorAction) {
        // Show error from Stripe.js in payment form
      } else {
        // The card action has been handled
        // The PaymentIntent can be confirmed again on the server
        const serverResponse = await fetch(apis.POSTconfirm_payment, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_intent_id: paymentIntent.id })
        });
        this.handleServerResponse(await serverResponse.json());
      }
    } else {
      // Show success message
      alert('successfully paid')
    }
  }

  handleReady = (element) => {
    this.setState({cardElement: element}) ;
  };

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

  renderCard(cardName, cardChecked, srcimg) {
    return(
      <Card style={{marginLeft: 15, borderColor: cardChecked ? '#20a8d8': null}}>
        <CardBody>
          <Col>
            <Input style={{ width: 15, height: 15 }} onChange={this.handleCheckbox} name={cardName} className="form-check-input" type="checkbox" value={cardChecked} checked={cardChecked} />
            <img style={{ marginLeft: 10, objectFit:'cover', width: 60, height: 30 }} src={srcimg}  />
          </Col>
        </CardBody>
      </Card>
    )
  }

  renderCheckOut() {
    const createOptions = (fontSize, padding) => {
      return {
        style: {
          base: {
            fontSize,
            color: "#424770",
            letterSpacing: "0.025em",
            fontFamily: "Source Code Pro, monospace",
            "::placeholder": {
              color: "#aab7c4"
            },
            padding: 20
          },
          invalid: {
            color: "#9e2146"
          }
        }
      };
    };

    return (

      <Row
        style={{ marginTop: 20, marginBottom:20, flex: 1, display: "flex" }}
        className="justify-content-center"
      >
        <Col xs="12" md="12">
          <form onSubmit={this.handleSubmit}>
            <Row
              style={{ marginTop: 20, flex: 1, display: "flex" }}
              className="justify-content-center"
            >
              <Col xs="12">
                <Label style={{ fontWeight: 400, letterSpacing: 0.025 }}>
                  Card Holder Name
                </Label>
                <input
                  className="StripeElement"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    width: "100%",
                    outline: 0,
                    border: 0,
                    marginBottom: 20,
                    marginTop: 10,
                    color: "rgba(0,0,0,0.8)"
                  }}
                  value={this.state.cardholdername}
                  onChange={e => this.handleCardHolderName(e)}
                  type="text"
                  placeholder="Card Holder Name"
                />
                {this.state.isCardHolderNameEmpty ? (
                  <Label style={{ color: "red", fontSize: 13, marginBottom: 20 }}>
                    Please enter card holder name
                  </Label>
                ) : null}
              </Col>

              <Col xs="12">
                <Label style={{ fontWeight: 400, letterSpacing: 0.025 }}>
                  Card Details
                </Label>
                <CardElement
                  onReady={this.handleReady}
                  {...createOptions(15)}
                />
              </Col>

              <Col xs="12">
                <Button block color="success">
                  Pay
                </Button>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>  
    );
  }

  renderSetupBank() {
    return <SetupBank catererEmail={this.state.catererEmail} catererPaymentAccoundID={this.state.catererPaymentAccoundID} stripe={this.props.stripe} goBack={()=>this.goBack()}/>
  }

  renderAddBank() {
    return <AddBank catererEmail={this.state.catererEmail} catererPaymentAccoundID={this.state.catererPaymentAccoundID} stripe={this.props.stripe} goBack={()=>this.goBack()}/>
  }

  renderDisplayBankAccount() {
    return <DisplayBankAccount catererpaymentdetails={this.state.catererpaymentdetails} paymentcarddetails={this.state.paymentcarddetails.reverse()} addBank={(e) =>this.addBankClicked(e)} updateBankAccount={() =>this.getCatererPaymentAccount(this.state.catererPaymentAccoundID)}/>
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

          <FormGroup row className="my-0">
            <Col xs="10">
              <Label htmlFor="OnlinePayment">Do you accept online / credit card payments?</Label>
            </Col>
            <Col xs="2">
              <AppSwitch onChange={this.toggle} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={true} label dataOn={'Yes'} dataOff={'No'}/>   
            </Col>
          </FormGroup>

          <Collapse style={{paddingTop: 20}} isOpen={this.state.collapse}>
            <Row>
              {this.renderCard('isVisaCardChecked', this.state.isVisaCardChecked, require("../../../../assets/img/visa.png"))}
              {this.renderCard('isMasterCardChecked', this.state.isMasterCardChecked, require("../../../../assets/img/mastercard.png"))}
              {this.renderCard('isAmericanExpressChecked', this.state.isAmericanExpressChecked, require("../../../../assets/img/americanexpress.png"))}
            </Row>
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
          </Collapse>

          <div className="form-actions">
            <Button style={{marginTop: 20}} onClick={this.handleNext} className="float-right" type="submit" color="primary">Setup Account</Button>
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
            :
            this.state.setupBank ? this.renderSetupBank() : this.state.addBank ? this.renderAddBank() : this.state.paymentcarddetails.length > 0 ? this.renderDisplayBankAccount() : this.renderOnlinePayment()
            }
          </Col>
        </Row>
      </div>

    );
  }
}

export default injectStripe(OnlinePayment);
