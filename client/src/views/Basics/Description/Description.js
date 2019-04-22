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
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Description extends Component {

  constructor(props) {
    super(props);

    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  
    this.state = {
      description: "",
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
            description: typeof response.data[0].catererDescrip !== 'undefined' ? response.data[0].catererDescrip : ""
          })
        } 
      })
      .catch((error) => {
      });
  }

  handleDescriptionChange(e) {
    this.setState({ 
      description: e.target.value,
    })
  }

  handleProceed = () => {
    this.props.history.push('/caterer/basics/location')
  }

  handleNext = () => {
    this.setState({
      isSaving: true,
    })

    const {description} = this.state

    var data = {
      catererDescrip: description,
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
                  {this.state.isProceedButtonVisible ? 
                    <Button style={{marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button onClick={() => this.handleNext()} className="float-right" type="submit" color="primary">{this.state.isSaving ? "Saving..." : "Save" }</Button>
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

export default Description;
