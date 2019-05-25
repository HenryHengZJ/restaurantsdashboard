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

class Publish extends Component {

  constructor(props) {
    super(props);

    this.state = {
     
    };

  }

  publish = () => {
    alert('Publish')
  }

  render() {
  
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Publish Store</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-0">
                  <Col xs="12">
                    <Label style={{lineHeight: 2}} className="h6">Are you ready to publish your store to FoodieBee platform?</Label>
                    <Label style={{lineHeight: 2, marginTop: 20}} >Once published, your store will be visible to our main site: www.foodiebee.com. By publishing your store to live, you agree to the</Label>
                    <div>
                      <a className="h6" href="">Terms of Use</a>
                      <span style={{color:'black'}}> and </span>
                      <a className="h6" href="">Privacy Policy</a>
                    </div>

                    <Button
                      style={{ marginTop:50, fontSize: 17, fontWeight: "600", marginBottom:20, }}
                      onClick={() => this.publish()}
                      color="success"
                      className="float-center"
                      disabled
                    >
                      <i className="fa fa-rocket fa-1x" aria-hidden="true" />
                      &nbsp; Publish
                    </Button>
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


export default Publish;
