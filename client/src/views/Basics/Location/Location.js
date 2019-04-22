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

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

class Location extends Component {

  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);

    this.state = {
      _id: "",
      latitude: null,
      longitude: null,
      center: null,
      form: null,
      isProceedButtonVisible: false,
      isSaving: false,
    };

    this.marker = null;
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
          var form;

          if (response.data[0].location.coordinates.length > 0) {
            latitude = response.data[0].location.coordinates[0];
            longitude = response.data[0].location.coordinates[1];
            center =  {
              lat: response.data[0].location.coordinates[0],
              lng: response.data[0].location.coordinates[1]
            };
            form = {
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
            form = {
              lat: 53.350140,
              lng: -6.266155
            };
          }

          this.setState({
            center,
            form,
            latitude,
            longitude,
          })
        } 
      })
      .catch((error) => {
      });
  }

  handleProceed = () => {
    this.props.history.push('/caterer/services/cuisine')
  }

  handleNext() {

    this.setState({
      isSaving: true,
    })

    const {latitude, longitude, form, _id} = this.state
  
    var data = {
      location: {
        type: "Point",
        coordinates: [latitude, longitude]
      },
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

  searchAddress = (e) => {
    e.preventDefault()
    const {form} = this.state
  
    this.setState({
      latitude: form.lat,
      longitude: form.lng,
      center: this.state.form
    })
    if (this.marker !== null) {
      this.marker.setPosition(this.state.form);
    }
  }

  showPlaceDetails(address) {
    this.setState({
      form: {
        lat: Number(address.geometry.location.lat()),
        lng: Number(address.geometry.location.lng()),
      },
    })
  }

  renderMarkers(map, maps, center) {
    this.marker = new maps.Marker({
      position: center,
      draggable: true,
      map
    });
    this.marker.setMap(map);
    // Add an event listener on the rectangle.
    this.marker.addListener("dragend", () => {
      const lat = this.marker.getPosition().lat();
      const lng = this.marker.getPosition().lng();
      this.setState({
        latitude: lat,
        longitude: lng,
        form: {
          lat: Number(lat),
          lng: Number(lng)
        },
        center: {
          lat: Number(lat),
          lng: Number(lng)
        },
      });
    });
  }

  render() {
 
    return (
      <div style={{ height: '100%', width: '100%' }} className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12">
            <Card >
              <CardHeader>
                <strong >Pin point location</strong>
                {this.state.isProceedButtonVisible ? 
                  <Button style={{marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                : null}
                <Button onClick={this.handleNext} className="float-right" type="submit" color="primary">{this.state.isSaving ? "Saving..." : "Save" }</Button>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-0">
                  <Col xs="12">
                    <Label htmlFor="Location">Let your customer know the exact location of your business by searching the address below and move the marker to pin point the exact location.</Label>
                  </Col>
                  <Col style={{marginTop:20}} xs="12">
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
                        onPlaceChanged={this.showPlaceDetails.bind(this)} />    
                      <InputGroupAddon addonType="prepend">
                        <Button onClick={(e) => this.searchAddress(e)} block style={{height: '100%', fontWeight: '600', borderTopRightRadius: 5, borderBottomRightRadius: 5,}} className="bg-primary" color="primary">SEARCH</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop:-25, marginBottom: 25, height: 500, width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: [GOOGLE_API_KEY] }}
            center={this.state.center}
            zoom={14}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps, this.state.center)}
          >
          </GoogleMapReact>
        </div>
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
