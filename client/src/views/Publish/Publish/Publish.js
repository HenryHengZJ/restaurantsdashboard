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

  openTermsofUse = () => {
   // window.open('https://www.foodiebee.eu/termscondition', '_blank');
   this.props.history.push('/caterer/account/termscondition')
  }

  openPrivacyPolicy = () => {
   // window.open('https://www.foodiebee.eu/privacypolicy', '_blank');
    this.props.history.push('/caterer/account/privacypolicy')
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

                      <Button color="link" onClick={() => this.openTermsofUse()} style={{ fontSize: 14, marginLeft: 0, paddingLeft:0, paddingRight:5, marginBottom:2, fontWeight: '500',color: "#20a8d8" }} >
                        Terms & Conditions
                      </Button>
                    

                      <span style={{color:'black'}}> and </span>

                      <Button color="link" onClick={() => this.openPrivacyPolicy()} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginBottom:2, fontWeight: '500',color: "#20a8d8" }} >
                        Privacy Policy
                      </Button>
                    
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
