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
import AutoCompleteAddress from '../../../components/AutoCompleteAddress/AutoCompleteAddress'
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Geocode from "react-geocode";

const GOOGLE_API_KEY = "AIzaSyCFHrZBb72wmg5LTiMjUgI_CLhsoMLmlBk";

class Location extends Component {

  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);

    this.state = {
      _id: "",
      center: null,
      catererFullAddress: "",
      catererAddress: "",
      catererCity: "",
      catererCounty: "",
      catererCountry: "",
      isProceedButtonVisible: false,
      isSaving: false,
    };

    this.marker = null;
   
  }

  componentDidMount() {

    Geocode.setApiKey(GOOGLE_API_KEY);
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {

          var center;

          if (response.data[0].location.coordinates.length > 0) {
            center =  {
              lat: response.data[0].location.coordinates[0],
              lng: response.data[0].location.coordinates[1]
            };
          }
          else {
            center =  {
              lat: 53.350140,
              lng: -6.266155
            };
          }

          this.setState({
            center,
            catererFullAddress: response.data[0].catererFullAddress,
          })
        } 
      })
      .catch((error) => {
      });
  }

  handleProceed = () => {
    this.props.history.push('/caterer/basics/cuisine')
  }

  handleNext() {

    this.setState({
      isSaving: true,
    })

    const {center, catererAddress, catererFullAddress, catererCity, catererCountry, catererCounty} = this.state
  
    var data = {
      location: {
        type: "Point",
        coordinates: [center.lat, center.lng]
      },
      catererAddress: catererAddress,
      catererFullAddress: catererFullAddress,
      catererCity: catererCity,
      catererCountry: catererCountry,
      catererCounty: catererCounty,
    }

    console.log(data)

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

  showPlaceDetails(address) {
    var lat = Number(address.geometry.location.lat())
    var lng = Number(address.geometry.location.lng())
    
    Geocode.fromLatLng(lat, lng).then(
      response => {

        //Get rid of postal code
        for(var i = 0 ; i < response.results[0].address_components.length ; i++){
          if (response.results[0].address_components[i].types[0] === "postal_code") {
            response.results[0].address_components.splice(i, 1)
          }
        }

        var address_components = response.results[0].address_components
 
        var catererAddress = ""
        for(var i = address_components.length - 4 ; i >= 0; i--){
          catererAddress = address_components[i].long_name + ( i === address_components.length - 4 ? "" : ", " ) + catererAddress 
        }
        
        this.setState({
          center: {
            lat: lat,
            lng: lng,
          },
          catererFullAddress: response.results[0].formatted_address,
          catererAddress: catererAddress,
          catererCity: address_components[address_components.length - 3].long_name,
          catererCounty: address_components[address_components.length - 2].long_name,
          catererCountry: address_components[address_components.length - 1].long_name,
        })
      },
      error => {
        console.log(error);
      }
    );
  }

  onInputChanged(value) {
    this.setState({
      catererFullAddress: value
    })
  }

  onMapChange = ({center}) => {
   
    var lat = center.lat;
    var lng = center.lng;

    Geocode.fromLatLng(lat, lng).then(
      response => {

        //Get rid of postal code
        for(var i = 0 ; i < response.results[0].address_components.length ; i++){
          if (response.results[0].address_components[i].types[0] === "postal_code") {
            response.results[0].address_components.splice(i, 1)
          }
        }

        var address_components = response.results[0].address_components

        var catererAddress = ""
        for(var i =address_components.length - 4 ; i >= 0; i--){
          catererAddress = address_components[i].long_name + ( i === address_components.length - 4 ? "" : ", " ) + catererAddress 
        }
        this.setState({
          center: {
            lat: lat,
            lng: lng,
          },
          catererFullAddress: response.results[0].formatted_address,
          catererAddress: catererAddress,
          catererCity: address_components[address_components.length - 3].long_name,
          catererCounty: address_components[address_components.length - 2].long_name,
          catererCountry: address_components[address_components.length - 1].long_name,
        })
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
 
    return (
      <div style={{ height: '100%', width: '100%' }} className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="9">
            <Card >
              <CardHeader>
                <strong >Business Location</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-0">
                  <Col xs="12">
                    <Label style={{fontWeight: '600'}} htmlFor="Location">Drag the map to pin your restaurant's location.</Label>
                  </Col>
                  <Col style={{marginTop:20}} xs="9">
                    <InputGroup >
                      <AutoCompleteAddress 
                        borderTopRightRadius={0}
                        borderBottomRightRadius = {0}
                        borderTopLeftRadius={5}
                        borderBottomLeftRadius={5}
                        borderColor = 'rgba(211,211,211,0.3)'
                        paddingLeft = {20}
                        paddingRight = {20}
                        paddingTop = {10}
                        paddingBottom = {10}
                        fontSize = {14}
                        color = 'black'
                        placeholder = "Enter business address"
                        onInputChanged={this.onInputChanged.bind(this)}
                        value={this.state.catererFullAddress}
                        onPlaceChanged={this.showPlaceDetails.bind(this)} />    
                    </InputGroup>
                  </Col>
                  <Col style={{marginTop:20}} xs="3">
                  {this.state.isProceedButtonVisible ? 
                    <Button style={{marginLeft:10, fontSize: 17}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button style={{ fontSize: 17}} onClick={this.handleNext} className="float-right" type="submit" color="primary">{this.state.isSaving ? "Updating..." : "Update" }</Button>
                  </Col>
                </FormGroup>
                <div style={{ marginTop:25, height: '60vh', width: '100%' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: [GOOGLE_API_KEY] }}
                    center={this.state.center}
                    zoom={14}
                    onChange={this.onMapChange}
                  >
                  </GoogleMapReact>
                  <div style={{position: 'absolute',top: '60%', left: '50%', zIndex: 1, height: 30, width: 30 }}>
                    <img style={{ objectFit:'cover', width: 30, height: 30 }} src={require("../../../assets/img/mapmarker.png")} />
                  </div>

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


export default Location;
