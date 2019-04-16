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

class ReceiveOrder extends Component {

  constructor(props) {
    super(props);

    this.togglePhoneOrder = this.togglePhoneOrder.bind(this);
    this.toggleEmailOrder = this.toggleEmailOrder.bind(this);

    this.state = {
      phoneOrder: true,
      emailOrder: true,
    };

  }

  togglePhoneOrder() {
    this.setState({
      phoneOrder: !this.state.phoneOrder
    }, () => {
      this.handleNext()
    })
  }

  toggleEmailOrder() {
    this.setState({
      emailOrder: !this.state.emailOrder
    }, () => {
      this.handleNext()
    })
  }

  handleNext = () => {
    const {phoneOrder, emailOrder} = this.state
    var sendOrder = {
      "phoneOrder": phoneOrder,
      "emailOrder": emailOrder
    }
    alert(JSON.stringify(sendOrder))
  }

  render() {

    const {phoneOrder, emailOrder} = this.state
    
    return (
      <div className="animated fadeIn">
        <Row >
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Receive order by phone</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-0">
                  <Col xs="6">
                    <Label style={{lineHeight: 2}} className="h6" htmlFor="ReceiveOrder">Receive orders by turning your restaurant phone into an order receiving machine.</Label>
                    <Label style={{lineHeight: 2, marginTop: 20, marginBottom: 50}} className="h6" htmlFor="ReceiveOrder">You will get an automatic alert call once order is placed.</Label>
                    <AppSwitch size="lg" onChange={this.togglePhoneOrder} className={'float-left'} variant={'3d'} color={'success'} checked={phoneOrder} label dataOn={'On'} dataOff={'Off'}/>   
                  </Col>
                  <Col xs="6">
                    <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={require("../../../assets/img/receiveorderphone.jpg")}  />
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Receive order by email</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-0">
                  <Col xs="6">
                    <Label style={{lineHeight: 2}} className="h6" htmlFor="ReceiveOrder">Receive orders via your email address.</Label>
                    <Label style={{lineHeight: 2, marginTop: 20, marginBottom: 50}} className="h6" htmlFor="ReceiveOrder">We will send you an email of the orders once customer has placed their orders online.</Label>
                    <AppSwitch size="lg" onChange={this.toggleEmailOrder} className={'float-left'} variant={'3d'} color={'success'} checked={emailOrder} label dataOn={'On'} dataOff={'Off'}/>   
                  </Col>
                  <Col xs="6">
                    <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={require("../../../assets/img/receiveorderemail.jpg")}  />
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReceiveOrder;
