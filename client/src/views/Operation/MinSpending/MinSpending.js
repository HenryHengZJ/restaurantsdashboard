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
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import CurrencyInput from "react-currency-input";
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class MinSpending extends Component {

  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
  
    this.state = {
      _id: "",
      minspendingfee: 0,
      isProceedButtonVisible: false,
      isSaving: false,
    };
  }

  componentDidMount() {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            minspendingfee: typeof response.data[0].minimumspend !== 'undefined' ? response.data[0].minimumspend : 0,
          })
        } 
      })
      .catch((error) => {
      });
  }

  handleProceed = () => {
    this.props.history.push('/caterer/services/openinghours')
  }

  handleNext() {
    this.setState({
      isSaving: true,
    })
    const {minspendingfee,  _id} = this.state
    
    var data = {
      minimumspend: minspendingfee,
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
          this.setState({
            isProceedButtonVisible: true,
            isSaving: false,
          })
        }
      })
      .catch((error) => {
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          isSaving: false,
        })
      });
  }

  handlePriceChange(e, value) {
    this.setState({
      minspendingfee: Number(value).toFixed(2)
    });
  }

  render() {
    const center = this.state.center;
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="9">
            <Card >
              <CardHeader>
                <strong>Minimum Catering Spending</strong>
              </CardHeader>
              <CardBody>

                <FormGroup row className="my-0">
                  <Col xs="12">
                    <Label>How much is the minimum spending that is required for customers in order to place a catering order?</Label>
                  </Col>
                </FormGroup>

                <FormGroup style={{paddingTop: 20}} row>
                  <Col xs="4" md="3">
                    <h6>Minimum Spending:</h6>
                  </Col>
                  <Col style={{padding:0}} xs="8" md="9">
                    <InputGroup style={{padding: 0}} className="input-prepend">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>€</InputGroupText>
                      </InputGroupAddon>
                      <CurrencyInput
                        style={{
                          borderWidth: 1,
                          borderColor: "rgba(211,211,211,0.3)",
                          paddingLeft: 10,
                          color: "black",
                          width: 100
                        }}
                        value={this.state.minspendingfee}
                        onChange={(e, value) => this.handlePriceChange(e, value)}
                        placeholder="0.00"
                        required
                      />
                    </InputGroup>
                  </Col>
                </FormGroup>
           
                <div className="form-actions">
                  {this.state.isProceedButtonVisible ? 
                    <Button style={{marginTop: 20, marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button style={{marginTop: 20}} onClick={this.handleNext} className="float-right" type="submit" color="primary">{this.state.isSaving ? "Saving..." : "Save" }</Button>
                </div>

              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer hideProgressBar/>
      </div>
    );
  }
}

const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Saved</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error saving data. Please try again</b>
   
  </div>
)

export default MinSpending;
