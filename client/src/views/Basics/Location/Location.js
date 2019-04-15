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

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


class GMapReact extends React.Component {
  render() {
    const { center, zoom } = this.props;
    return (
      <div style={{ width: "100%", height: "100%" }}>
         <GoogleMapReact
            bootstrapURLKeys={{ key: [GOOGLE_API_KEY] }}
            center={center}
            zoom={zoom}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
          >
            
          </GoogleMapReact>
      </div>
    );
  }
}

class Location extends Component {

  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);

    this.state = {
      latitude: 53.350140,
      longitude: -6.266155,
      center: {
        lat: 53.350140,
        lng: -6.266155
      },
      form: {
        lat: 53.350140,
        lng: -6.266155
      }
    };
  }


  handleNext() {
    const {latitude, longitude, form} = this.state
  
    alert(latitude, longitude)
  }

  searchAddress = (e) => {
   // e.preventDefault()
    const {form} = this.state
  
    this.setState({
      latitude: form.lat,
      longitude: form.lng,
      center: this.state.form
    })
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
    let marker = new maps.Marker({
      position: center,
      draggable: true,
      map
    });
    marker.setMap(map);
    var newLatLng = new maps.LatLng(center.lat, center.lng);
    marker.setPosition(newLatLng);
    // Add an event listener on the rectangle.
    marker.addListener("dragend", () => {
      const lat = marker.getPosition().lat();
      const lng = marker.getPosition().lng();
      this.setState({
        latitude: lat,
        longitude: lng,
        center: {
          lat: lat,
          lng: lng
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
                <Button onClick={this.handleNext} className="float-right" type="submit" color="primary">Next</Button>
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
                        <Button onClick={(e) => this.searchAddress(e)} block style={{height: '100%', borderTopRightRadius: 5, borderBottomRightRadius: 5,}} className="bg-primary" color="primary">SEARCH</Button>
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
            onGoogleApiLoaded={({ map, maps, center }) => this.renderMarkers(map, maps, this.state.center)}
          >
            
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default Location;
