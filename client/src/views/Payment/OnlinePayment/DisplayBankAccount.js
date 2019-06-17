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
  Table,
  Modal,
  ModalBody
} from 'reactstrap'; 
import './style.css'
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
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

class DisplayBankAccount extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loadingModal: false,
      catererpersons: [],
      isOwnerOpen: false,
      isAccountOpenerOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.catererpaymentdetails.business_type === 'company') {
      this.getCatererPerson() 
    }
  }

  getCatererPerson = () => {

    var catererPaymentAccoundID = this.props.catererpaymentdetails.id

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer_person + "?catererPaymentAccoundID=" + catererPaymentAccoundID;

    axios.get(url, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererpersons: response.data.data,
          })
        } 
      })
      .catch((error) => {
      });
  }

  defaultClick = (index) => {

    this.setState({
      loadingModal: true
    })
    
    var catererPaymentAccoundID = this.props.catererpaymentdetails.id

    var bankID = this.props.paymentcarddetails[index].id

    var headers = {
      'Content-Type': 'application/json',
    }

    var body = {
      catererPaymentAccoundID: catererPaymentAccoundID,
      bankID: bankID
    }

    var url = apis.PUTupdate_caterer_external_bankaccount

    axios.put(url, body, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.props.updateBankAccount()
          this.setState({
            loadingModal: false
          })
        } 
      })
      .catch((error) => {
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          loadingModal: false
        })
      });
  }

  deleteBankAccount = (index) => {

    var catererPaymentAccoundID = this.props.catererpaymentdetails.id

    var bankID = this.props.paymentcarddetails[index].id

    var headers = {
      'Content-Type': 'application/json',
    }

    var body = {
      catererPaymentAccoundID: catererPaymentAccoundID,
      bankID: bankID
    }

    var url = apis.DELETE_caterer_external_bankaccount + "?catererPaymentAccoundID=" + catererPaymentAccoundID + "&bankID=" + bankID

    axios.delete(url, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.props.updateBankAccount()
        } 
      })
      .catch((error) => {
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
  }

  renderIndividualAccountInfo() {
    var catererpaymentdetails = this.props.catererpaymentdetails
    return (
      <div >
        <strong>Identity</strong>
        <Card style={{ marginTop: 20 , padding:20}}>
          <CardBody style={{ margin: 0, padding: 0 }}>
            <Table borderless responsive>
              <tbody>
                <tr>
                  <td>First Name:</td>
                  <td className="h6">{catererpaymentdetails.individual.first_name}</td>
                </tr>
                <tr>
                  <td>Last Name:</td>
                  <td className="h6">{catererpaymentdetails.individual.last_name}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td className="h6">{catererpaymentdetails.email}</td>
                </tr>
                <tr>
                  <td>Date of Birth:</td>
                  <td className="h6">{catererpaymentdetails.individual.dob.day}/{catererpaymentdetails.individual.dob.month}/{catererpaymentdetails.individual.dob.year}</td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td className="h6">
                    {catererpaymentdetails.individual.address.line1 + ", "} 
                    {catererpaymentdetails.individual.address.line2 ? catererpaymentdetails.individual.address.line2 + ", ": ""} 
                    {catererpaymentdetails.individual.address.city+ ", "}
                    {catererpaymentdetails.individual.address.state+ ", "}
                    {catererpaymentdetails.individual.address.country}
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    )
  }

  renderCompanyAccountInfo() {
    var catererpaymentdetails = this.props.catererpaymentdetails
    return (
      <div>
        <strong>Business Entity</strong>
        <Card style={{ marginTop: 20 , padding:20}}>
          <CardBody style={{ margin: 0, padding: 0 }}>
            <Table borderless responsive>
              <tbody>
                <tr>
                  <td>Company Name:</td>
                  <td className="h6">{catererpaymentdetails.company.name}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td className="h6">{catererpaymentdetails.email}</td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td className="h6">
                    {catererpaymentdetails.company.address.line1 + ", "} 
                    {catererpaymentdetails.company.address.line2 ? catererpaymentdetails.company.address.line2 + ", ": ""} 
                    {catererpaymentdetails.company.address.city+ ", "}
                    {catererpaymentdetails.company.address.state+ ", "}
                    {catererpaymentdetails.company.address.country}
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
        {this.renderManagementInfo()}
      </div>
    )
  }

  renderManagementInfo() {
    var catererpersons = this.state.catererpersons
    var itemsarray = [];
    for (let i = 0; i < catererpersons.length; i++) {
      var account_opener_val = catererpersons[i].relationship.account_opener
      var director_val = catererpersons[i].relationship.director
      var owner_val = catererpersons[i].relationship.owner
      var role = ""

      if (account_opener_val && owner_val && !director_val) {
        role = "Account Opener & Owner"
      }
      else if (account_opener_val && !owner_val && !director_val) {
        role = "Account Opener"
      }
      else if (!account_opener_val && owner_val && !director_val) {
        role = "Owner"
      }
      else if (!account_opener_val && !owner_val && director_val) {
        role = "Director"
      }

      itemsarray.push(
          role === "Account Opener & Owner" ? 
          this.renderAccountOpenerAccountInfo(role, catererpersons[i]) :
          role === "Account Opener" ? 
          this.renderAccountOpenerAccountInfo(role, catererpersons[i]) :
          role === "Owner" ? 
          this.renderOwnerAccountInfo(role, catererpersons[i]) :
          role === "Director" ? 
          this.renderDirectorAccountInfo(role, catererpersons[i]) :
          null
      );
    }
   
    return (
      <div style={{marginTop: 50}}>
        <strong>Management & Ownership</strong>
        {itemsarray}
      </div>
    )
  }

  renderOwnerAccountInfo(role, catererperson) {
    return (
      <div >
        <Card style={{ marginTop: 20 , padding:20}}>
          <CardBody style={{ margin: 0, padding: 0 }}>
           
            <p style={{marginLeft:7, fontWeight: '600'}}>
              {catererperson.first_name} {catererperson.last_name} -
              <span style={{opacity: 0.8, marginLeft:7, fontWeight: '600'}}>
                {role}
              </span>
            </p>

            {
              !this.state.isOwnerOpen ?
              <Button color="link" onClick={() => this.setState({isOwnerOpen: true})} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                See More
              </Button>
              : null
            }
            <Collapse isOpen={this.state.isOwnerOpen}>
              <Table borderless responsive>
                <tbody>
                  <tr>
                    <td>Email:</td>
                    <td className="h6">{catererperson.email}</td>
                  </tr>
                  <tr>
                    <td>Date of Birth:</td>
                    <td className="h6">{catererperson.dob.day}/{catererperson.dob.month}/{catererperson.dob.year}</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td className="h6">
                      {catererperson.address.line1 + ", "} 
                      {catererperson.address.line2 ? catererperson.address.line2 + ", ": ""} 
                      {catererperson.address.city+ ", "}
                      {catererperson.address.state+ ", "}
                      {catererperson.address.country}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Collapse>
            {
              this.state.isOwnerOpen ?
              <Button color="link" onClick={() => this.setState({isOwnerOpen: false})} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                Hide
              </Button>
              : null
            }
          </CardBody>
        </Card>
      </div>
    )
  }


  renderAccountOpenerAccountInfo(role, catererperson) {
    return (
      <div >
        <Card style={{ marginTop: 20 , padding:20}}>
          <CardBody style={{ margin: 0, padding: 0 }}>
           
            <p style={{marginLeft:7, fontWeight: '600'}}>
              {catererperson.first_name} {catererperson.last_name} -
              <span style={{opacity: 0.8, marginLeft:7, fontWeight: '600'}}>
                {role}
              </span>
            </p>

            {
              !this.state.isAccountOpenerOpen ?
              <Button color="link" onClick={() => this.setState({isAccountOpenerOpen: true})} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                See More
              </Button>
              : null
            }
            <Collapse isOpen={this.state.isAccountOpenerOpen}>
              <Table borderless responsive>
                <tbody>
                  <tr>
                    <td>Email:</td>
                    <td className="h6">{catererperson.email}</td>
                  </tr>
                  <tr>
                    <td>Date of Birth:</td>
                    <td className="h6">{catererperson.dob.day}/{catererperson.dob.month}/{catererperson.dob.year}</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td className="h6">
                      {catererperson.address.line1 + ", "} 
                      {catererperson.address.line2 ? catererperson.address.line2 + ", ": ""} 
                      {catererperson.address.city+ ", "}
                      {catererperson.address.state+ ", "}
                      {catererperson.address.country}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Collapse>
            {
              this.state.isAccountOpenerOpen ?
              <Button color="link" onClick={() => this.setState({isAccountOpenerOpen: false})} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                Hide
              </Button>
              : null
            }
          </CardBody>
        </Card>
      </div>
    )
  }


  renderDirectorAccountInfo(role, catererperson) {
    return (
      <div >
        <Card style={{ marginTop: 20 , padding:20}}>
          <CardBody style={{ margin: 0, padding: 0 }}>
           
            <p style={{marginLeft:7, fontWeight: '600'}}>
              {catererperson.first_name} {catererperson.last_name} -
              <span style={{opacity: 0.8, marginLeft:7, fontWeight: '600'}}>
                {role}
              </span>
            </p>
       
          </CardBody>
        </Card>
      </div>
    )
  }


  renderPaymentCard() {
    var itemsarray = [];

    var paymentcarddetails = this.props.paymentcarddetails;

    for (let i = 0; i < paymentcarddetails.length; i++) {
      itemsarray.push(
        <Col xs="12" md="9" >
          <Card className="card-1" style={{ marginBottom: 40, padding:20}}>
            <CardBody style={{ margin: 0, padding: 0 }}>

              <img
                style={{ objectFit: "cover", width: 80, height: 45 }}
                src={require("../../../assets/img/visa.png")}
              /> 

              <div style={{ marginTop: 20 }}>
                <Table borderless responsive>
                  <tbody>
                    <tr>
                      <td>Account Holder Name:</td>
                      <td className="h6">{paymentcarddetails[i].account_holder_name}</td>
                    </tr>
                    <tr>
                      <td>Card Number</td>
                      <td className="h6">
                        &#9679;&#9679;&#9679;&#9679;{" "}
                        {paymentcarddetails[i].last4}
                      </td>
                    </tr>
                    <tr>
                      <td>Bank Name:</td>
                      <td className="h6">
                        {paymentcarddetails[i].bank_name}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <Row>
                <Col xs="6">
                  <Button
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      fontWeight: "600"
                    }}
                    outline = {paymentcarddetails[i].default_for_currency ? false : true}
                    color="success"
                    block
                    onClick={() => this.defaultClick(i)}
                  >
                    {paymentcarddetails[i].default_for_currency ? "Default" : "Make Default"}
                  </Button>
                </Col>
                <Col xs="6">
                  <Button
                    onClick={() => this.deleteBankAccount(i)}
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      fontWeight: "600"
                    }}
                    outline
                    color="danger"
                    block
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      );
    }

    return (
      <Row>
        <Col xs="12" style={{marginBottom: 20}}>
          <strong>Bank Accounts</strong>
        </Col>
        {itemsarray}
        <Col xs="12">
          <Button onClick={(e) => this.props.addBank(e)} className="float-right" style={{ paddingTop: 10, paddingBottom: 10 }} color="primary">
            Add Bank Account
          </Button>
        </Col>
      </Row>
    );
  }

  renderLoadingModal() {

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: require('../../../assets/animation/payment_loading.json'),
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
              Updating your bank accounts...
            </p>
          </div>
        </ModalBody>
      </Modal>
    )
  }


  render() {

    return (
      <div>
        <Card >
          <CardHeader>
            <strong>Your Bank Account</strong>
          </CardHeader>
          <CardBody>
            <Row style={{ flex: 1, display: "flex" }}>
              <Col xs="12">
                <Card style={{ boxShadow: "none", borderWidth: 0 }}>
                  <CardBody>
                    <Form>                
                      {this.props.catererpaymentdetails.business_type === 'company' ? this.renderCompanyAccountInfo() : this.props.catererpaymentdetails.business_type === 'individual' ? this.renderIndividualAccountInfo() : null}
                      <div style={{marginTop: 50}}>
                        {this.renderPaymentCard()}
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
             
            </Row>
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
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully updated</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error updating bank accounts.</b>
   
  </div>
)



DisplayBankAccount.propTypes = propTypes;
DisplayBankAccount.defaultProps = defaultProps;

export default DisplayBankAccount;
