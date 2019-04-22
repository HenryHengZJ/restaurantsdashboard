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
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class OrderLater extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleOrderLaterMin = this.handleOrderLaterMin.bind(this);
    this.handleOrderLaterDay = this.handleOrderLaterDay.bind(this);
    this.handleNext = this.handleNext.bind(this);

    this.state = {
      _id: "",
      collapse: false,
      orderlatermin: null,
      orderlaterday: null,
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
            collapse: typeof response.data[0].catererOrderLater !== 'undefined' ? response.data[0].catererOrderLater : false,
            orderlatermin: typeof response.data[0].inAdvanceMin !== 'undefined' ? response.data[0].inAdvanceMin : 60,
            orderlaterday: typeof response.data[0].inAdvanceDay !== 'undefined' ? response.data[0].inAdvanceDay : 4 
          })
        } 
      })
      .catch((error) => {
      });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleOrderLaterMin(e) {
    if(isNaN(e.target.value)){
      //Letters
    }
    else if (e.target.value.includes("+") || e.target.value.includes("-") || e.target.value.includes(".")) {
      //Letters
    }
    else {
      //Valid Number
      this.setState({ 
        orderlatermin: e.target.value,
      })
    }
  }

  handleOrderLaterDay(e) {
    if(isNaN(e.target.value)){
      //Letters
    }
    else if (e.target.value.includes("+") || e.target.value.includes("-") || e.target.value.includes(".")) {
      //Letters
    }
    else {
      this.setState({ 
        orderlaterday: e.target.value,
      })
    }
  }

  handleProceed = () => {
    this.props.history.push('/caterer/ordersmenu/receiveorder')
  }

  handleNext() {
    this.setState({
      isSaving: true,
    })

    const {collapse, orderlaterday, orderlatermin, _id} = this.state
    
    var data = {
      catererOrderLater: collapse,
      inAdvanceMin: orderlatermin,
      inAdvanceDay: orderlaterday
    }

    var headers = {
      'Content-Type': 'application/json',
      //'Authorization': jwtToken,
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
        //alert("error updating! " + error)
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          isSaving: false,
        })
      });
  }

  render() {

    const {orderlaterday, orderlatermin} = this.state
    
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Accept orders for later</strong>
              </CardHeader>
              <CardBody>

                <FormGroup row className="my-0">
                  <Col xs="10">
                    <Label htmlFor="OrderLater">Do you allow customer to "order for later" at any time, even when your restaurant is closed? Orders placed outside opening hours will queue up for acceptance as soon as your restaurant opens. </Label>
                  </Col>
                  <Col xs="2">
                    <AppSwitch onChange={this.toggle} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.collapse} label dataOn={'Yes'} dataOff={'No'}/>   
                  </Col>
                </FormGroup>

                <Collapse style={{paddingTop: 20}} isOpen={this.state.collapse}>
                  <Label className="h6" >Order placement has to be at least:</Label>
                  <Row>
                    <Col>
                      <Input style={{color: 'black'}} type="text" value={orderlatermin} onChange={(e) => this.handleOrderLaterMin(e)}/>
                    </Col>
                    <Col>
                      <Input className="text-center" style={{color: 'black'}} type="text" value="min" disabled />
                    </Col>
                    <Col>
                      <Label style={{paddingTop:10}}> in advance</Label>
                    </Col>
                  </Row>

                  <Label className="h6" style={{marginTop:20}}>Order placement cannot placed more than</Label>
                  <Row>
                    <Col>
                      <Input style={{color: 'black'}} type="text" value={orderlaterday} onChange={(e) => this.handleOrderLaterDay(e)}/>
                    </Col>
                    <Col>
                      <Input className="text-center" style={{color: 'black'}} type="text" value="days" disabled />
                    </Col>
                    <Col>
                      <Label style={{paddingTop:10}}> in advance</Label>
                    </Col>
                  </Row>
                </Collapse>

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

export default OrderLater;
