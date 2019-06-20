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
import Widget from "../../../components/Widget"
import "./Publish.css"
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
var _ = require('lodash');

class Publish extends Component {

  constructor(props) {
    super(props);

    this.refObj = {}
    this.refObj[0] = React.createRef();
    this.refObj[1] = React.createRef();
    this.refObj[2] = React.createRef();
    this.refObj[3] = React.createRef();

    this.state = {
      loadingModal: false,
      catererDetails: {},
      catererMenu: [],
      catererMenuPublished: [],
      nameAddressInvalid: false,
      nameAddressAction: "",
      descriptionInvalid: false,
      descriptionAction: "",
      locationInvalid: false,
      locationAction: "",
      cuisineInvalid: false,
      cuisineAction: "",
      occasionInvalid: false,
      occasionAction: "",

      pickupInvalid: false,
      pickupAction: "",
      deliveryInvalid: false,
      deliveryAction: "",
      deliveryHoursInvalid: false,
      deliveryHoursAction: "",
      minimumSpendingInvalid: false,
      minimumSpendingAction: "",

      menusetupInvalid: false,
      menusetupAction: "",

      paymentInvalid: false,
      paymentAction: "",

      basicSelected: false,
      basicCompleteness: null,
      serviceSelected: false,
      serviceCompleteness: null,
      orderSelected: false,
      orderCompleteness: null,
      paymentSelected: false,
      paymentCompleteness: null,
    };
  }

  componentDidMount() {
    this.getCatererDetails()
    this.getCatererMenu()
  }

  getCatererDetails = () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererDetails: response.data[0],
          }, () => {
            var catererDetails = this.state.catererDetails
            this.validateBasics(catererDetails)
            this.validateServices(catererDetails)
            this.validatePayment(catererDetails)
          })
        } 
      })
      .catch((error) => {
      });
  }

  getCatererMenu= () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETmenu;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererMenu: response.data,
          },() => {
            var catererMenu = this.state.catererMenu
            this.validateMenu(catererMenu);
          })
        } 
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
      });
  }

  getCatererMenuPublished= () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETmenuPublished;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererMenuPublished: response.data,
          }, () => {
            this.comparePublishedMenuWithCatererMenu()
          })
        } 
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
      });
  }


  validateBasics = (catererDetails) => {
  
    var nameAddressAction = this.state.nameAddressAction
    var nameAddressInvalid = this.state.nameAddressInvalid

    if (typeof catererDetails.catererName !== 'undefined' && typeof catererDetails.catererPhoneNumber !== 'undefined' && typeof catererDetails.catererFullAddress !== 'undefined' && typeof catererDetails.profilesrc !== 'undefined' && typeof catererDetails.coversrc !== 'undefined' ) {
      nameAddressAction = "All Set"
      nameAddressInvalid = false
    }
    else {

      nameAddressInvalid = true

      if (typeof catererDetails.catererName === 'undefined' ) {
        nameAddressAction =  nameAddressAction + "Missing restaurant / caterer's name. "
      }
      if (typeof catererDetails.catererPhoneNumber === 'undefined' ) {
        nameAddressAction = nameAddressAction + "Missing phone number. "
      }
      if (typeof catererDetails.catererFullAddress === 'undefined' ) {
        nameAddressAction =  nameAddressAction + "Missing address. "
      }
      if (typeof catererDetails.profilesrc === 'undefined' ) {
        nameAddressAction = nameAddressAction + "Missing restaurant / caterer's logo. "
      }
      if (typeof catererDetails.coversrc === 'undefined' ) {
        nameAddressAction = nameAddressAction + "Missing restaurant / caterer's cover image. "
      }
    }


    var descriptionAction = this.state.descriptionAction
    var descriptionInvalid = this.state.descriptionInvalid

    if (typeof catererDetails.catererDescrip !== 'undefined') {
      descriptionAction = "All Set"
      descriptionInvalid = false
    }
    else {
      descriptionAction = "Missing description. "
      descriptionInvalid = true
    }


    var locationAction = this.state.locationAction
    var locationInvalid = this.state.locationInvalid

    if (catererDetails.location.coordinates.length > 0) {
      locationAction = "All Set"
      locationInvalid = false
    }
    else {
      locationAction = "Missing location. Please move the pin point to your business location and click save."
      locationInvalid = true
    }

 
    var cuisineAction = this.state.cuisineAction
    var cuisineInvalid = this.state.cuisineInvalid

    if (catererDetails.catererCuisine.length > 0) {
      cuisineAction = "All Set"
      cuisineInvalid = false
    }
    else {
      cuisineAction = "Please select types of cuisines your restaurants or caterings are providing."
      cuisineInvalid = true
    }

    
    var occasionAction = this.state.occasionAction
    var occasionInvalid = this.state.occasionInvalid

    if (catererDetails.catererOccasion.length > 0) {
      occasionAction = "All Set"
      occasionInvalid = false
    }
    else {
      occasionAction = "Please select types of occasions your caterings are suitable for."
      occasionInvalid = true
    }


    this.setState({
      nameAddressAction,
      nameAddressInvalid,
      descriptionInvalid,
      descriptionAction,
      locationInvalid,
      locationAction,
      cuisineInvalid,
      cuisineAction,
      occasionInvalid,
      occasionAction,
    }, () => {
      this.calculateBasicCompleteness()
    })
  }

  calculateBasicCompleteness = () => {
    var completecount = 0

    if (!this.state.nameAddressInvalid) {
      completecount = completecount + 1
    }
    if (!this.state.descriptionInvalid) {
      completecount = completecount + 1
    }
    if (!this.state.locationInvalid) {
      completecount = completecount + 1
    }
    if (!this.state.cuisineInvalid) {
      completecount = completecount + 1
    }
    if (!this.state.occasionInvalid) {
      completecount = completecount + 1
    }

    var percentage = (completecount/5) * 100
    var basicCompleteness = percentage + "% Complete"

    this.setState({
      basicCompleteness
    })
  }


  validateServices = (catererDetails) => {
 
    var pickupAction = this.state.pickupAction
    var pickupInvalid = this.state.pickupInvalid

    if (typeof catererDetails.catererPickup !== 'undefined') {
      pickupAction = "All Set"
      pickupInvalid = false
    }
    else {
      pickupAction = "Please select if your restaurants are offering pick up or collection. "
      pickupInvalid = true
    }


    var deliveryAction = this.state.deliveryAction
    var deliveryInvalid = this.state.deliveryInvalid

    if (typeof catererDetails.catererDelivery !== 'undefined' && typeof catererDetails.deliveryradius !== 'undefined' && typeof catererDetails.deliveryfee !== 'undefined') {
      deliveryAction = "All Set"
      deliveryInvalid = false
    }
    else {
      deliveryAction = "Please select if your restaurants are offering food delivery."
      if (typeof catererDetails.deliveryradius === 'undefined') {
        deliveryAction = "Missing delivery radius. "
      }

      if (typeof catererDetails.deliveryfee === 'undefined') {
        deliveryAction = "Missing delivery fee. "
      }
      deliveryInvalid = true
    }


    var deliveryHoursAction = this.state.deliveryHoursAction
    var deliveryHoursInvalid = this.state.deliveryHoursInvalid

    if (catererDetails.deliveryhours.length > 0) {
      deliveryHoursAction = "All Set"
      deliveryHoursInvalid = false
    }
    else {
      deliveryHoursAction = "Please enter delivery times and click save."
      deliveryHoursInvalid = true
    }

 
    var minimumSpendingAction = this.state.minimumSpendingAction
    var minimumSpendingInvalid = this.state.minimumSpendingInvalid

    if (typeof catererDetails.minimumspend !== 'undefined') {
      minimumSpendingAction = "All Set"
      minimumSpendingInvalid = false
    }
    else {
      minimumSpendingAction = "Please select types of cuisines your restaurants or caterings are providing."
      minimumSpendingInvalid = true
    }

    this.setState({
      pickupAction,
      pickupInvalid,
      deliveryAction,
      deliveryInvalid,
      deliveryHoursAction,
      deliveryHoursInvalid,
      minimumSpendingAction,
      minimumSpendingInvalid,
    }, () => {
      this.calculateServiceCompleteness()
    })
  }

  calculateServiceCompleteness = () => {
    var completecount = 0

    if (!this.state.pickupInvalid) {
      completecount = completecount + 1
    }
    if (!this.state.deliveryInvalid) {
      completecount = completecount + 1
    }
    if (!this.state.deliveryHoursInvalid) {
      completecount = completecount + 1
    }
    if (!this.state.minimumSpendingInvalid) {
      completecount = completecount + 1
    }

    var percentage = (completecount/4) * 100
    var serviceCompleteness = percentage + "% Complete"

    this.setState({
      serviceCompleteness
    })
  }

  
  validatePayment = (catererDetails) => {
 
    var paymentAction = this.state.paymentAction
    var paymentInvalid = this.state.paymentInvalid

    if (typeof catererDetails.catererPaymentAccoundID !== 'undefined') {
      paymentAction = "All Set"
      paymentInvalid = false
    }
    else {
      paymentAction = "Please connect your bank account. "
      paymentInvalid = true
    }

    this.setState({
      paymentAction,
      paymentInvalid,
    }, () => {
      this.calculatePaymentCompleteness()
    })
  }

  calculatePaymentCompleteness = () => {
    var completecount = 0

    if (!this.state.paymentInvalid) {
      completecount = completecount + 1
    }

    var percentage = (completecount/1) * 100
    var paymentCompleteness = percentage + "% Complete"

    this.setState({
      paymentCompleteness
    })
  }

  validateMenu = (catererMenu) => {
 
    var menusetupAction = this.state.menusetupAction
    var menusetupInvalid = this.state.menusetupInvalid

    if (typeof catererMenu !== 'undefined' && catererMenu.length >= 5) {
      menusetupAction = "All Set"
      menusetupInvalid = false
    }
    else {
      menusetupAction = "Please setup your menu items. Minimum menu items are 5."
      menusetupInvalid = true
    }

    this.setState({
      menusetupAction,
      menusetupInvalid,
    }, () => {
      this.calculateOrderCompleteness()
    })
  }

  calculateOrderCompleteness = () => {
    var completecount = 0

    if (!this.state.menusetupInvalid) {
      completecount = completecount + 1
    }

    var percentage = (completecount/1) * 100
    var orderCompleteness = percentage + "% Complete"

    this.setState({
      orderCompleteness
    })
  }

  rowClicked = (goToPage) => {
    this.props.history.push(goToPage)
  }

  comparePublishedMenuWithCatererMenu = () => {
    const {catererMenuPublished, catererMenu} = this.state
    var toBeUpdateID = [];
    var toBeUpdateBody = [];
    for (let i = 0; i < catererMenu.length; i++) {
      var index = catererMenuPublished.findIndex(x => x._id === catererMenu[i]._id);
      if (index >= 0) {
        if (!_.isEqual(catererMenu[i], catererMenuPublished[index])) {
          toBeUpdateID.push(catererMenu[i]._id)
          var newbody = catererMenu[i]
          delete newbody['_id'];
          toBeUpdateBody.push(newbody)
        }
      }
      else {
        toBeUpdateID.push(catererMenu[i]._id)
        var newbody = catererMenu[i]
        delete newbody['_id'];
        toBeUpdateBody.push(newbody)
      }
    }

    if (toBeUpdateID.length > 0 && toBeUpdateBody.length > 0) {
      var body = {
        toBeUpdateID: JSON.stringify(toBeUpdateID),
        toBeUpdateBody: JSON.stringify(toBeUpdateBody)
      }
  
      var headers = {
        'Content-Type': 'application/json',
      }
  
      var url = apis.UPDATEmenuPublished
  
      axios.put(url, body, {withCredentials: true}, {headers: headers})
        .then((response) => {
          if (response.status === 201) {
            this.setState({
              loadingModal: false,
            }, () => {
              toast(<SuccessInfo/>, {
                position: toast.POSITION.BOTTOM_RIGHT
              });
            })
          }
        })
        .catch((error) => {
          this.setState({
            loadingModal: false,
          }, () => {
            toast(<ErrorInfo/>, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          })
        });
    }
    else {
      this.setState({
        loadingModal: false,
      }, () => {
        toast(<SuccessInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      })
    }
  }

  publish = () => {
    const { 
      nameAddressInvalid, descriptionInvalid, locationInvalid, cuisineInvalid, occasionInvalid,
      pickupInvalid, deliveryInvalid, deliveryHoursInvalid,  minimumSpendingInvalid, menusetupInvalid, paymentInvalid,
    } = this.state
    
    if (nameAddressInvalid || descriptionInvalid || locationInvalid || cuisineInvalid || occasionInvalid ) {
      this.setState({
        basicSelected: true
      },() => {
        this.refObj[0].current.scrollIntoView({behavior: 'smooth'});
      })
    }

    else if (pickupInvalid || deliveryInvalid || deliveryHoursInvalid || minimumSpendingInvalid ) {
      this.setState({
        serviceSelected: true
      },() => {
        this.refObj[1].current.scrollIntoView({behavior: 'smooth'});
      })
    }

    else if (menusetupInvalid) {
      this.setState({
        orderSelected: true
      },() => {
        this.refObj[2].current.scrollIntoView({behavior: 'smooth'});
      })
    }

    else if (paymentInvalid ) {
      this.setState({
        paymentSelected: true
      },() => {
        this.refObj[3].current.scrollIntoView({behavior: 'smooth'});
      })
    }

    if ( !nameAddressInvalid && !descriptionInvalid && !locationInvalid && !cuisineInvalid && !occasionInvalid && !pickupInvalid && !deliveryInvalid && !deliveryHoursInvalid && !minimumSpendingInvalid && !menusetupInvalid && !paymentInvalid) {
      
      this.setState({
        loadingModal: true
      })

      var data = this.state.catererDetails
  
      var headers = {
        'Content-Type': 'application/json',
      }
  
      var url = apis.UPDATE_catererPublished + "?_id=" + this.state.catererDetails._id;
  
      axios.put(url, data, {withCredentials: true}, {headers: headers})
        .then((response) => {
          if (response.status === 201) {
            this.getCatererMenuPublished()
          }
        })
        .catch((error) => {
          this.setState({
            loadingModal: false,
          }, () => {
            toast(<ErrorInfo/>, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          })
        });
    }
  }

  openTermsofUse = () => {
   // window.open('https://www.foodiebee.eu/termscondition', '_blank');
   this.props.history.push('/caterer/account/termscondition')
  }

  openPrivacyPolicy = () => {
   // window.open('https://www.foodiebee.eu/privacypolicy', '_blank');
    this.props.history.push('/caterer/account/privacypolicy')
  }

  basicsClicked = () => {
    this.setState({
      basicSelected: !this.state.basicSelected
    })
  }

  servicesClicked = () => {
    this.setState({
      serviceSelected: !this.state.serviceSelected
    })
  }

  orderClicked = () => {
    this.setState({
      orderSelected: !this.state.orderSelected
    })
  }

  paymentClicked = () => {
    this.setState({
      paymentSelected: !this.state.paymentSelected
    })
  }

  renderLoadingModal() {

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: require('../../../assets/animation/order_loading.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <Modal    
        aria-labelledby="contained-modal-title-vcenter"
        centered
        isOpen={this.state.loadingModal} >
        <ModalBody>
          <div>
            <Lottie 
              options={defaultOptions}
              height={200}
              width={200}/>

            <p style={{textAlign: 'center', paddingLeft:20, paddingRight:20, fontSize: 16, fontWeight: '600'}}>
              Processing...
            </p>
          </div>
        </ModalBody>
      </Modal>
    )
  }


  render() {
  
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="9">
            <Card >
              <CardHeader>
                <strong>Publish Store</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12">
                    <Label style={{lineHeight: 2}} className="h6">Are you ready to publish your store to FoodieBee platform?</Label>
                    <Label style={{lineHeight: 2, marginTop: 20}} >Once published, your store will be visible to our main site: www.foodiebee.eu. By publishing your store to live, you agree to the</Label>
                    <div >

                      <Button color="link" onClick={() => this.openTermsofUse()} style={{ fontSize: 14, marginLeft: 0, paddingLeft:0, paddingRight:5, marginBottom:2, fontWeight: '500',color: "#20a8d8" }} >
                        Terms & Conditions
                      </Button>
                    

                      <span style={{color:'black'}}> and </span>

                      <Button color="link" onClick={() => this.openPrivacyPolicy()} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginBottom:2, fontWeight: '500',color: "#20a8d8" }} >
                        Privacy Policy
                      </Button>
                    
                    </div>

                    <div ref={this.refObj[0]} >
                    <Card className="card-1" onClick={() => this.basicsClicked()} style={{padding:0, marginTop: 20, cursor: 'pointer'}}>
                      <CardBody style={{padding:0}}>

                        <Widget collapse={this.state.basicSelected} header="Basics" mainText={this.state.basicCompleteness} icon="fa fa-home" color="primary" />

                        <Collapse isOpen={this.state.basicSelected}>
                          <Table hover style={{marginTop: 0, paddingTop: 0}} responsive>
                            <thead style={{marginTop: 0, paddingTop: 0}} className="thead-light">
                              <tr>
                                <th>Details</th>
                                <th>Complete</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr onClick={() => this.rowClicked("/caterer/basics/nameaddress")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Name & Address</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.nameAddressInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.nameAddressAction}</td>
                              </tr>
                              <tr onClick={() => this.rowClicked("/caterer/basics/description")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Description</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.descriptionInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.descriptionAction}</td>
                              </tr>
                              <tr onClick={() => this.rowClicked("/caterer/basics/location")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Location</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.locationInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.locationAction}</td>
                              </tr>
                              <tr onClick={() => this.rowClicked("/caterer/basics/cuisine")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Cuisine</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.cuisineInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.cuisineAction}</td>
                              </tr>
                              <tr onClick={() => this.rowClicked("/caterer/basics/occasion")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Occasion</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.occasionInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.occasionAction}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Collapse>
                      </CardBody>
                    </Card>
                    </div>
             
                    <div ref={this.refObj[1]} >
                    <Card className="card-1" onClick={() => this.servicesClicked()} style={{padding:0, marginTop: 20, cursor: 'pointer'}}>
                      <CardBody style={{padding:0}}>

                        <Widget collapse={this.state.serviceSelected} header="Services & Hours" mainText={this.state.serviceCompleteness} icon="fa fa-home" color="success" />

                        <Collapse isOpen={this.state.serviceSelected}>
                          <Table hover style={{marginTop: 0, paddingTop: 0}} responsive>
                            <thead style={{marginTop: 0, paddingTop: 0}} className="thead-light">
                              <tr>
                                <th>Details</th>
                                <th>Complete</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr onClick={() => this.rowClicked("/caterer/services/pickup")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Pickup</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.pickupInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.pickupAction}</td>
                              </tr>
                              <tr onClick={() => this.rowClicked("/caterer/services/delivery")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Delivery</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.deliveryInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.deliveryAction}</td>
                              </tr>
                              <tr onClick={() => this.rowClicked("/caterer/services/deliveryhours")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Delivery Hours</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.deliveryHoursInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.deliveryHoursAction}</td>
                              </tr>
                              <tr onClick={() => this.rowClicked("/caterer/services/minspending")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Minimum Spending</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.minimumSpendingInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.minimumSpendingAction}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Collapse>
                      </CardBody>
                    </Card>
                    </div>

                    <div ref={this.refObj[2]} >
                    <Card className="card-1" onClick={() => this.orderClicked()} style={{padding:0, marginTop: 20, cursor: 'pointer'}}>
                      <CardBody style={{padding:0}}>

                        <Widget collapse={this.state.orderSelected} header="Orders & Menu" mainText={this.state.orderCompleteness} icon="fa fa-home" color="warning" />

                        <Collapse isOpen={this.state.orderSelected}>
                          <Table hover style={{marginTop: 0, paddingTop: 0}} responsive>
                            <thead style={{marginTop: 0, paddingTop: 0}} className="thead-light">
                              <tr>
                                <th>Details</th>
                                <th>Complete</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr onClick={() => this.rowClicked("/caterer/ordersmenu/menusetup")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Menu Setup</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.menusetupInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.menusetupAction}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Collapse>
                      </CardBody>
                    </Card>
                    </div>

                    <div ref={this.refObj[3]}>
                    <Card  className="card-1" onClick={() => this.paymentClicked()} style={{padding:0, marginTop: 20, cursor: 'pointer'}}>
                      <CardBody style={{padding:0}}>

                        <Widget collapse={this.state.paymentSelected} header="Payment" mainText={this.state.paymentCompleteness} icon="fa fa-credit-card" color="danger" />

                        <Collapse isOpen={this.state.paymentSelected}>
                          <Table hover style={{marginTop: 0, paddingTop: 0}} responsive>
                            <thead style={{marginTop: 0, paddingTop: 0}} className="thead-light">
                              <tr>
                                <th>Details</th>
                                <th>Complete</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr onClick={() => this.rowClicked("/caterer/payment/onlinepayment")}>
                                <td style={{ fontWeight: "500", width: '30%' }}>Online Payment</td>
                                <td style={{ fontWeight: "500", width: '20%' }}>
                                  <img style={{objectFit:'cover', width: 25, height: 25 }} src={this.state.paymentInvalid ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/cancel.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/checked.png"}  />
                                </td>
                                <td style={{ width: '50%' }}>{this.state.paymentAction}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Collapse>
                      </CardBody>
                    </Card>
                    </div>

                    <Button
                      style={{ marginTop:50, fontSize: 17, fontWeight: "600", marginBottom:20, }}
                      onClick={() => this.publish()}
                      color="success"
                      className="float-center"
                      
                    >
                      <i className="fa fa-rocket fa-1x" aria-hidden="true" />
                      &nbsp; Publish
                    </Button>
                  </Col>
                  
                </Row>
              </CardBody>
            </Card>
          </Col>
          {this.renderLoadingModal()}
          <ToastContainer hideProgressBar/>
        </Row>
      </div>
    );
  }
}


const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Store Published Successfully!</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>An unknown error occured.</b>
   
  </div>
)

export default Publish;
