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
      isSearched: false,
      zoom: 14,
      isStreetAddressMissing: false,
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
          var center;
          center =  {
            lat: 53.350140,
            lng: -6.266155
          };
          this.setState({
            center,
          })
      });
  }

  handleProceed = () => {
    this.props.history.push('/restaurant/basics/payment')
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

  showPlaceDetails(details) {

    var lat = Number(details.geometry.location.lat())
    var lng = Number(details.geometry.location.lng())
    
    Geocode.fromLatLng(lat, lng).then(
      response => {

        var results = response.results
        var catererCountry = ""
        var catererCounty = ""
        var catererCity = ""
        var catererAddress = ""
        var catererFullAddress = ""
  
        for (var x = 0; x < results.length; x++) {
        
          //Check for country
          if (results[x].types.includes('country')) {
            catererCountry = results[x].address_components[0].long_name
          }
          
          //Check for county
          if (results[x].types.includes('administrative_area_level_1')) {
            catererCounty = results[x].address_components[0].long_name
          }
          
          //Check for city
          if (results[x].types.includes('locality')) {
            catererCity = results[x].address_components[0].long_name
          }

        }

        for (var i = 0; i < details.address_components.length; i++) {
            
              //Check for street_number
              if (details.address_components[i].types.includes('street_number')) {
                catererAddress = catererAddress + details.address_components[i].long_name + ", "
              }
              
              //Check for route
              if (details.address_components[i].types.includes('route')) {
                catererAddress = catererAddress + details.address_components[i].long_name + ", "
              }
              
              //Check for sublocality
              if (details.address_components[i].types.includes('sublocality')) {
                catererAddress = catererAddress + details.address_components[i].long_name + ", "
              }
            
        }
            
        //Remove last 2 substrings of catererAddress
        catererAddress = catererAddress.substring(0, catererAddress.length - 2);

        catererFullAddress = details.formatted_address

        var newCenter = {
          lat: lat,
          lng: lng,
        }
        
        this.setState({
          catererFullAddress,
          catererAddress,
          catererCity,
          catererCounty,
          catererCountry,
          isSearched: true,
          isStreetAddressMissing: catererAddress === "" ? true : false,
        }, () => {
          this.setState({
            zoom: 16,
            center: newCenter
          })
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

  onDrag = (map) => {
    // alert('drag end = ', JSON.stringify(map))
     if (this.state.isSearched) {
       this.setState({
         isSearched: false
       })
     }
   }

  onMapChange = ({center}) => {

    if (this.state.isSearched) {
      return;
    }
   
    var lat = center.lat;
    var lng = center.lng;

    Geocode.fromLatLng(lat, lng).then(
      response => {

        var results = response.results
        var catererCountry = ""
        var catererCounty = ""
        var catererCity = ""
        var catererAddress = ""
        var catererFullAddress = ""
        var isStreetAddressAppeared = false
        
        for (var x = 0; x < results.length; x++) {
        
          //Check for country
          if (results[x].types.includes('country')) {
            catererCountry = results[x].address_components[0].long_name
          }
          
          //Check for county
          if (results[x].types.includes('administrative_area_level_1')) {
            catererCounty = results[x].address_components[0].long_name
          }
          
          //Check for city
          if (results[x].types.includes('locality')) {
            catererCity = results[x].address_components[0].long_name
          }
          
          //Check for street_address
          if (results[x].types.includes('street_address') && !isStreetAddressAppeared) {
            
            var street_address_components = results[x].address_components

            for (var i = 0; i < street_address_components.length; i++) {
            
              //Check for street_number
              if (street_address_components[i].types.includes('street_number')) {
                catererAddress = catererAddress + street_address_components[i].long_name + ", "
              }
              
              //Check for route
              if (street_address_components[i].types.includes('route')) {
                catererAddress = catererAddress + street_address_components[i].long_name + ", "
              }
              
              //Check for sublocality
              if (street_address_components[i].types.includes('sublocality')) {
                catererAddress = catererAddress + street_address_components[i].long_name + ", "
              }
            
            }
            
            //Remove last 2 substrings of catererAddress
            catererAddress = catererAddress.substring(0, catererAddress.length - 2);

            catererFullAddress = results[x].formatted_address

            //Set isStreetAddressAppeared to true to ensure only 1 address
            isStreetAddressAppeared = true

          }
        }

        var newCenter = {
          lat: lat,
          lng: lng,
        }

        this.setState({
          center: newCenter,
          catererFullAddress,
          catererAddress,
          catererCity,
          catererCounty,
          catererCountry,
          isStreetAddressMissing: catererAddress === "" ? true : false,
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
                    <Button disabled={this.state.isStreetAddressMissing} style={{marginLeft:10, fontSize: 17}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button disabled={this.state.isStreetAddressMissing} style={{ fontSize: 17}} onClick={this.handleNext} className="float-right" type="submit" color="primary">{this.state.isSaving ? "Updating..." : "Update" }</Button>
                  </Col>
                  {this.state.isStreetAddressMissing ? 
                  <Col xs="12">
                    <Label style={{fontWeight: '500', fontSize: 12, color: 'red'}}>Please enter address with street name</Label>
                  </Col> : null }
                </FormGroup>
                <div style={{ marginTop:25, height: '60vh', width: '100%' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: [GOOGLE_API_KEY] }}
                    center={this.state.center}
                    zoom={this.state.zoom}
                    onDrag={this.onDrag}
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
