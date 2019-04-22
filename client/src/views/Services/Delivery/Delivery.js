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
import GoogleMapReact from 'google-map-react';
import CurrencyInput from "react-currency-input";
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const AnyReactComponent = ({ text }) => (
  <div style={{
    color: 'white', 
    background: 'transparent',
    padding: '15px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    <img style={ { objectFit:'cover', width: 40, height: 40 }} src={require('../../../assets/img/mapmarker.png')}/>
  </div>
);


class Delivery extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
  
    this.state = {
      _id: "",
      delivery: true,
      latitude: null,
      longitude: null,
      radius: null,
      center: null,
      deliveryfee: 0,
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

          var latitude;
          var longitude;
          var center;
      
          if (response.data[0].location.coordinates.length > 0) {
            latitude = response.data[0].location.coordinates[0];
            longitude = response.data[0].location.coordinates[1];
            center =  {
              lat: response.data[0].location.coordinates[0],
              lng: response.data[0].location.coordinates[1]
            };
          }
          else {
            latitude = 53.350140;
            longitude = -6.266155;
            center =  {
              lat: 53.350140,
              lng: -6.266155
            };
          }

          this.setState({
            delivery: typeof response.data[0].catererDelivery !== 'undefined' ? response.data[0].catererDelivery : true,
            latitude: latitude,
            longitude: longitude,
            center: center,
            radius: typeof response.data[0].deliveryradius !== 'undefined' ? response.data[0].deliveryradius : 1000,
            deliveryfee: typeof response.data[0].deliveryfee !== 'undefined' ? response.data[0].deliveryfee : 0,
          })
        } 
      })
      .catch((error) => {
      });
  }


  toggle() {
    this.setState({ delivery: !this.state.delivery });
  }

  handleProceed = () => {
    this.props.history.push('/caterer/services/minspending')
  }

  handleNext() {
    this.setState({
      isSaving: true,
    })

    const {delivery, _id, latitude, longitude, radius, deliveryfee} = this.state
  
    var data = {
      deliveryradius: radius,
      deliveryfee: deliveryfee,
      catererDelivery: delivery,
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

  addCircle = (map, maps) => {
    var newcircle = new maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.3,
      editable: true,
      map,
      center: { lat: this.state.latitude, lng: this.state.longitude },
      radius: 1000
    });
    newcircle.setMap(map);
    // Add an event listener on the rectangle.
    newcircle.addListener("radius_changed", () => {
      // alert(newcircle.getRadius());
      this.setState({
        radius: Math.floor(newcircle.getRadius()) 
      });
    });
  };

  
  handlePriceChange(e, value) {
    this.setState({
      deliveryfee: Number(value).toFixed(2)
    });
  }

  render() {
    const center = this.state.center;
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Delivery Option</strong>
              </CardHeader>
              <CardBody>

                <FormGroup row className="my-0">
                  <Col xs="10">
                    <Label htmlFor="Delivery">Do you offer food delivery?</Label>
                  </Col>
                  <Col xs="2">
                    <AppSwitch onChange={this.toggle} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.delivery} label dataOn={'Yes'} dataOff={'No'}/>   
                  </Col>
                </FormGroup>

                <Collapse style={{paddingTop: 20}} isOpen={this.state.delivery} >

                <FormGroup row>
                  <Col xs="4" md="3">
                    <h6>Delivery Fee:</h6>
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
                        value={this.state.deliveryfee}
                        onChange={(e, value) => this.handlePriceChange(e, value)}
                        placeholder="0.00"
                        required
                      />
                    </InputGroup>
                  </Col>
                </FormGroup>

                <h6>Delivery Radius: <b style={{fontWeight:'700', color: 'darkorange', fontSize:17}}>{this.state.radius}</b>&nbsp;km</h6>

                <div style={{ marginTop: 20, height: 500, width: '100%' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: [GOOGLE_API_KEY] }}
                    center={center}
                    zoom={14}
                    yesIWantToUseGoogleMapApiInternals={true}
                    onGoogleApiLoaded={({ map, maps }) => this.addCircle(map, maps)}
                  >
                    <AnyReactComponent 
                      lat={this.state.latitude} 
                      lng={this.state.longitude} 
                      text={'Select Area'} 
                    />
                  </GoogleMapReact>
                </div>

             
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

export default Delivery;
