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

class Description extends Component {

  constructor(props) {
    super(props);

    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.state = {
      description: "",
    };
  }

  handleDescriptionChange(e) {
    this.setState({ 
      description: e.target.value,
    })
  }

  handleNext() {
    const {description} = this.state
    alert(description)
  }

  render() {
    const {isDescriptionEmpty} = this.state

    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Description of your business</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Description</Label>
                  <Input type="textarea" rows="5" style={{color: 'black'}} value={this.state.description} onChange={(e) => this.handleDescriptionChange(e)} placeholder="Description (eg: history, theme, main selling dishes)" />
                </FormGroup>
                <div className="form-actions">
                  <Button onClick={this.handleNext} className="float-right" type="submit" color="primary">Next</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Description;
