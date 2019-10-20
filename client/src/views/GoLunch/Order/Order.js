import React, { Component } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  Button,
  Label,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Collapse
} from "reactstrap";
import moment from "moment";
import "./Order.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange, Calendar } from 'react-date-range';
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";

const data = [
  {
    _id: "5cfd0e0ff7f31a378cdbc152",
    __v: 0,
    catererID: "5cc73f58737b761bb4fcf20f",
    createdAt: "2019-06-09T13:47:59.195Z",
    customerID: "5cc08834eb8a2a1a6c26b501",
    customerCompanyID: "5d8ca11c88211f271c35ba32",
    customerCompanyDetails: [
      {
        _id: "5d8ca11c88211f271c35ba32",
        companyName: "Google",
        companyAddress:
          "Google Building Gordon House, 4 Barrow St, Dublin, D04 E5W5, Ireland",
        location: { coordinates: [53.3398678, -6.2362244], type: "Point" }
      }
    ],
    orderDate: "2019-06-11T23:00:00.000Z",
    orderItemID: "5d333da0a44d342688f77218",
    orderItemDetails: [{ title: "Cripsy Duck" }],
    orderStatus: "accepted",
    paymentIntentID: "pi_1EjGimAOgfikw311akMONsQc",
    paymentType: "visa",
    paymentStatus: "succeeded",
    totalOrderPrice: 7.5,
    updatedAt: "2019-06-11T23:25:23.442Z"
  },
  {
    _id: "5cfd0e0ff7f31a378cdbc153",
    __v: 0,
    catererID: "5cc73f58737b761bb4fcf20f",
    createdAt: "2019-06-09T13:47:59.195Z",
    customerID: "5cc08834eb8a2a1a6c26b501",
    customerCompanyID: "5d8ca11c88211f271c35ba32",
    customerCompanyDetails: [
      {
        _id: "5d8ca11c88211f271c35ba32",
        companyName: "Google",
        companyAddress:
          "Google Building Gordon House, 4 Barrow St, Dublin, D04 E5W5, Ireland",
        location: { coordinates: [53.3398678, -6.2362244], type: "Point" }
      }
    ],
    orderDate: "2019-06-11T23:00:00.000Z",
    orderItemID: "5d333da0a44d342688f77218",
    orderItemDetails: [{ title: "Cripsy Duck" }],
    orderStatus: "accepted",
    paymentIntentID: "pi_1EjGimAOgfikw311akMONsQc",
    paymentType: "visa",
    paymentStatus: "succeeded",
    totalOrderPrice: 7.5,
    updatedAt: "2019-06-11T23:25:23.442Z"
  },
  {
    _id: "5cfd0e0ff7f31a378cdbc154",
    __v: 0,
    catererID: "5cc73f58737b761bb4fcf20f",
    createdAt: "2019-06-09T13:47:59.195Z",
    customerID: "5cc08834eb8a2a1a6c26b501",
    customerCompanyID: "5d8ca11c88211f271c35ba32",
    customerCompanyDetails: [
      {
        _id: "5d8ca11c88211f271c35ba32",
        companyName: "Google",
        companyAddress:
          "Google Building Gordon House, 4 Barrow St, Dublin, D04 E5W5, Ireland",
        location: { coordinates: [53.3398678, -6.2362244], type: "Point" }
      }
    ],
    orderDate: "2019-06-11T23:00:00.000Z",
    orderItemID: "5d3462865a843120780de363",
    orderItemDetails: [{ title: "Mekong Roll" }],
    orderStatus: "accepted",
    paymentIntentID: "pi_1EjGimAOgfikw311akMONsQc",
    paymentType: "visa",
    paymentStatus: "succeeded",
    totalOrderPrice: 7.5,
    updatedAt: "2019-06-11T23:25:23.442Z"
  },
  {
    _id: "5cfd0e0ff7f31a378cdbc155",
    __v: 0,
    catererID: "5cc73f58737b761bb4fcf20f",
    createdAt: "2019-06-09T13:47:59.195Z",
    customerID: "5cc08834eb8a2a1a6c26b501",
    customerCompanyID: "5d8ca3523facc3271c4b5ade",
    customerCompanyDetails: [
      {
        _id: "5d8ca3523facc3271c4b5ade",
        companyName: "Facebook",
        companyAddress: "95, Kingsfield St, Dublin 1, Dublin",
        location: { coordinates: [53.34469, -6.242492], type: "Point" }
      }
    ],
    orderDate: "2019-06-11T23:00:00.000Z",
    orderItemID: "5d3463015a843120780de364",
    orderItemDetails: [{ title: "Quarter Chicken with Passion Slaw" }],
    orderStatus: "dispatched",
    paymentIntentID: "pi_1EjGimAOgfikw311akMONsQc",
    paymentType: "visa",
    paymentStatus: "succeeded",
    totalOrderPrice: 7.5,
    updatedAt: "2019-06-11T23:25:23.442Z"
  },
  {
    _id: "5cfd0e0ff7f31a378cdbc156",
    __v: 0,
    catererID: "5cc73f58737b761bb4fcf20f",
    createdAt: "2019-06-09T13:47:59.195Z",
    customerID: "5cc08834eb8a2a1a6c26b501",
    customerCompanyID: "5d8ca3523facc3271c4b5ade",
    customerCompanyDetails: [
      {
        _id: "5d8ca3523facc3271c4b5ade",
        companyName: "Facebook",
        companyAddress: "95, Kingsfield St, Dublin 1, Dublin",
        location: { coordinates: [53.34469, -6.242492], type: "Point" }
      }
    ],
    orderDate: "2019-06-11T23:00:00.000Z",
    orderItemID: "5d3463015a843120780de364",
    orderItemDetails: [{ title: "Quarter Chicken with Passion Slaw" }],
    orderStatus: "dispatched",
    paymentIntentID: "pi_1EjGimAOgfikw311akMONsQc",
    paymentType: "visa",
    paymentStatus: "succeeded",
    totalOrderPrice: 7.5,
    updatedAt: "2019-06-11T23:25:23.442Z"
  }
];

class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingModal: false,
      orderModal: false,
      selectedOrderItem: null,
      empty: true,
      maxDate: null,
      currentDate: null,
      dropDownDate: false,
      fetchedorder: [],
      data: [],
      activeOrderItem: [],
      activeCompany: {},
      activeOrderStatus: {},
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("currentLunchOrderDateString") !== null) {
      this.getLocalStorage()
    }
    else {
      this.getTodayDate()
    }
  }

  getLocalStorage = () => {
    
    var maxDate = moment().toDate();

    var currentDate = moment(sessionStorage.getItem("currentLunchOrderDateString"), "ddd, DD MMM YYYY").toDate()
   
    var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")

    this.setState({
      maxDate,
      currentDate,
      currentDateString,
    }, () => {
      this.getOrder(currentDateString)
    })
  }

  getTodayDate = () => {

    var currentDate = moment().toDate();

    var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")

    this.setState({
      maxDate: currentDate,
      currentDate,
      currentDateString,
    }, () => {
      this.getOrder(currentDateString)
    })
  }
  
  companyClicked = index => {
    var activeOrderItem = this.state.data[index];
    var result = activeOrderItem.orderDetails.reduce(function(r, a) {
      r[a.orderItemID] = r[a.orderItemID] || [];
      r[a.orderItemID].push(a);
      return r;
    }, Object.create(null));

    var finaldataAry = [];

    for (var key in result) {
      var updateData = {
        orderItems: result[key]
      };
      finaldataAry.push(updateData);
    }

    var activeCompany = this.state.data[index].customerCompanyDetails;
    activeCompany.latitude = this.state.data[
      index
    ].customerCompanyDetails.location.coordinates[0];
    activeCompany.longitude = this.state.data[
      index
    ].customerCompanyDetails.location.coordinates[1];

    this.setState({
      activeOrderItem: finaldataAry,
      activeCompany: activeCompany,
      activeOrderStatus: this.state.data[index].companyOrderStatus
    });
  };

  openMaps = () => {
    window.open("https://maps.google.com?q=" + 52.656417 + "," + -8.624068);
  };

  restructureData = () => {
    var result = this.state.fetchedorder.reduce(function(r, a) {
      r[a.customerCompanyID] = r[a.customerCompanyID] || [];
      r[a.customerCompanyID].push(a);
      return r;
    }, Object.create(null));

    var finaldataAry = [];

    for (var key in result) {
      var companyOrderStatus = this.getOrderStatus(result[key][0].orderStatus);
      var updateData = {
        customerCompanyDetails: result[key][0].customerCompanyDetails[0],
        companyOrderStatus: companyOrderStatus,
        orderDetails: result[key]
      };
      finaldataAry.push(updateData);
    }

    this.setState(
      {
        data: finaldataAry
      },
      () => {
        if (data.length > 0) {
          this.companyClicked(0);
        }
      }
    );
    console.log(finaldataAry);
  };

  getOrderStatus = orderStatus => {
    var returnStatus = { value: 0, label: "", buttonText: "" };

    var timenow = parseInt(moment(new Date()).format("HHmm"));
    console.log(timenow);

    if (orderStatus === "pending") {
      if (timenow > 1115) {
        //Cancel all orders
        returnStatus.label = "Orders not accepted";
        returnStatus.value = 0;
        returnStatus.buttonText = "Failed to Accept";
      } else {
        returnStatus.label = "Accept by 11:15am to 11:30am";
        returnStatus.value = 25;
        returnStatus.buttonText = "Accept";
      }
    } else if (orderStatus === "accepted") {
      returnStatus.label = "Dispatch by 11:50am to 12:05pm";
      returnStatus.value = 50;
      returnStatus.buttonText = "Ready to Dispatch";
    } else if (orderStatus === "dispatched") {
      returnStatus.label = "Deliver by 12:15pm to 12:30pm";
      returnStatus.value = 75;
      returnStatus.buttonText = "Mark Delivered";
    } else if (orderStatus === "delivered") {
      returnStatus.label = "Delivered";
      returnStatus.value = 100;
      returnStatus.buttonText = "Delivered";
    }

    return returnStatus;
  };

  getOrder = (currentDateString) => {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETlunchorder + "?date=" + currentDateString;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          this.setState({
            fetchedorder: response.data,
            empty: response.data.length === 0 ? true : false
          }, () => {
            if (!this.state.empty) {
              this.restructureData()
            }
          })
        } 
      })
      .catch((error) => {
        this.setState({
          empty: true 
        })
      });
  }

  toggleDropDown = () => {
    this.setState({
      dropDownDate: !this.state.dropDownDate
    })
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getPreviousDate = (currentDate, days) => {
    return moment(currentDate).subtract(days, "days");
  };

  getIntervalDates = (startDate, stopDate) => {
    var dateArray = [];
    var currentDate = startDate;
    var endDate = stopDate;
    while (currentDate >= endDate) {
      dateArray.push(moment(currentDate).format("ddd, DD MMM YYYY"));
      currentDate = moment(currentDate).subtract(1, "days");
    }
    return dateArray;
  };

  handleDateChange(date) {
    this.setState({
      currentDate: date,
      currentDateString: moment(date).format("ddd, DD MMM YYYY"),
      dropDownDate: !this.state.dropDownDate, 
    }, () => {
      sessionStorage.setItem('currentLunchOrderDateString', moment(date).format("ddd, DD MMM YYYY"))
      this.getOrder(moment(date).format("ddd, DD MMM YYYY"))
    })
  }

  toggleOrderModal = () => {
    this.setState({
      orderModal: !this.state.orderModal
    })
  }

  renderCustomerCompany(items) {
    var itemsarray = [];

    for (let i = 0; i < items.length; i++) {
      itemsarray.push(
        <Card
          className="card-1"
          onClick={() => this.companyClicked(i)}
          style={{
            cursor: "pointer",
            marginBottom: 20,
            borderColor:
              this.state.activeCompany._id ===
              items[i].customerCompanyDetails._id
                ? "#20a8d8"
                : null
          }}
        >
          <CardBody
            style={{
              cursor: "pointer",
              paddingTop: 0,
              paddingBottom: 0,
              paddingRight: 15,
              height: "100%"
            }}
          >
            <Row>
              <Col style={{ marginTop: 15, marginBottom: 10 }} xs="9">
                <div>
                  <p
                    className="h5"
                    style={{ cursor: "pointer", color: "#20a8d8" }}
                  >
                    {items[i].customerCompanyDetails.companyName}
                  </p>
                </div>

                <div style={{ marginTop: 10 }}>
                  <span style={{ cursor: "pointer" }}>
                    {items[i].companyOrderStatus.label}
                  </span>
                </div>
              </Col>

              <Col style={{ marginTop: 10, textAlign: "center" }} xs="3">
                <div>
                  <h3>{items[i].orderDetails.length}</h3>
                </div>

                <div>
                  <p>orders</p>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }

    return (
      <Row style={{ marginTop: 40 }}>
        <Col xs="12">{itemsarray}</Col>
      </Row>
    );
  }

  renderOrderItems(items) {
    var itemsarray = [];

    for (let i = 0; i < items.length; i++) {
      itemsarray.push(
        <Col key={i} xs="12" sm="6" md="6" lg="4" style={{}}>
          <Card
            className="card-2"
            style={{ marginBottom: 20 }}
          >
            <CardBody
              style={{
                paddingTop: 10,
                paddingBottom: 0,
                paddingLeft: 15,
                paddingRight: 15,
                height: "100%"
              }}
            >
              <Row>
                <Col style={{ textAlign: "center", color: "orange" }} xs="3">
                  <div>
                    <h4>{items[i].orderItems.length}</h4>
                  </div>
                </Col>
                <Col style={{ marginTop: 5 }} xs="9">
                  <div>
                    <p style={{fontWeight: '500'}}>
                      {items[i].orderItems[0].orderItemDetails[0].title}
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      );
    }
    return <Row>{itemsarray}</Row>;
  }

  renderEmptyItems() {
    return (
      <Row style={{ marginTop: 130 }}>
        <Col style={{ textAlign: "center" }} xs="12">
          <img
            style={{
              objectFit: "cover",
              width: 70,
              height: 70,
              opacity: 0.6
            }}
            alt={""}
            src={"https://s3-eu-west-1.amazonaws.com/foodiebeegeneralphoto/empty.png"}
          />
        </Col>
        <Col style={{ textAlign: "center" }} xs="12">
          <p
            style={{ fontSize: 18, letterSpacing: 2, marginTop: 30 }}
            className="big"
          >
            You have 0 orders for now.
          </p>
        </Col>
      </Row>
    );
  }

  renderOrder() {
    return (
      <div>
        {this.state.empty ? this.renderEmptyItems()
        :
        <Row>
          <Col
            style={{
              paddingTop: 30,
              paddingLeft: 30,
              backgroundColor: "rgba(211,211,211,0.3)"
            }}
            xs="12"
            md="4"
          >
            <h4>{this.state.currentDateString}</h4>
            {this.renderCustomerCompany(this.state.data)}
          </Col>
          <Col
            style={{ paddingTop: 30, paddingLeft: 40, paddingRight: 20 }}
            xs="12"
            md="8"
          >
            <Row>
              <Col style={{ textAlign: "start" }} xs="6">
                <h4>{this.state.activeCompany.companyName}</h4>
              </Col>
              <Col style={{ textAlign: "end" }} xs="6">
                <h6>
                  <img
                    style={{
                      objectFit: "cover",
                      width: 20,
                      height: 20,
                      marginRight: 10
                    }}
                    src={require("../../../assets/img/alarm.png")}
                    alt=""
                  />
                  {this.state.activeOrderStatus.label}
                </h6>
              </Col>
            </Row>
            <Row>
              <Col style={{ marginTop: 20 }} xs="12">
                <Row>
                  <Col style={{ textAlign: "start" }} xs="4">
                    Accepted
                  </Col>
                  <Col style={{ textAlign: "center" }} xs="4">
                    Dispatched
                  </Col>
                  <Col style={{ textAlign: "end" }} xs="4">
                    Delivered
                  </Col>
                </Row>
              </Col>
              <Col
                style={{ marginTop: 20, paddingLeft: 40, paddingRight: 40 }}
                xs="12"
              >
                <ProgressBar
                  filledBackground="rgb(27, 158, 15)"
                  percent={this.state.activeOrderStatus.value}
                >
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        {index + 1}
                      </div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        {index + 1}
                      </div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        {index + 1}
                      </div>
                    )}
                  </Step>
                </ProgressBar>
              </Col>
              <Col style={{ marginTop: 30, textAlign: "center" }} xs="12">
                <Button
                  onClick={e => this.searchAddress(e, this.state.address)}
                  style={{
                    height: "100%",
                    fontWeight: "600",
                    borderRadius: 5,
                    fontSize: 18
                  }}
                  color={
                    this.state.activeOrderStatus.buttonText ===
                    "Failed to Accept"
                      ? "secondary"
                      : this.state.activeOrderStatus.buttonText === "Accept"
                      ? "success"
                      : this.state.activeOrderStatus.buttonText ===
                        "Ready to Dispatch"
                      ? "success"
                      : this.state.activeOrderStatus.buttonText ===
                        "Mark Delivered"
                      ? "success"
                      : this.state.activeOrderStatus.buttonText ===
                        "Delivered"
                      ? "success"
                      : null
                  }
                  disabled={
                    this.state.activeOrderStatus.buttonText ===
                    "Failed to Accept"
                      ? true
                      : this.state.activeOrderStatus.buttonText === "Accept"
                      ? false
                      : this.state.activeOrderStatus.buttonText ===
                        "Ready to Dispatch"
                      ? false
                      : this.state.activeOrderStatus.buttonText ===
                        "Mark Delivered"
                      ? false
                      : this.state.activeOrderStatus.buttonText ===
                        "Delivered"
                      ? true
                      : null
                  }
                >
                  {this.state.activeOrderStatus.buttonText}
                </Button>
              </Col>
            </Row>
            <Row
              style={{
                marginTop: 20
              }}
            >
              <Col style={{ marginTop: 20 }} xs="12">
                <Button
                  color="link"
                  onClick={() => this.openMaps()}
                  style={{
                    padding: 0,
                    marginBottom: 20,
                    fontWeight: "500",
                    color: "#20a8d8"
                  }}
                >
                  <img
                    style={{
                      objectFit: "cover",
                      width: 20,
                      height: 20,
                      marginRight: 10
                    }}
                    src={require("../../../assets/img/mapmarker.png")}
                    alt=""
                  />
                  {this.state.activeCompany.companyAddress}
                </Button>
                <div>
                  <img
                    style={{ width: "100%" }}
                    src={
                      "https://maps.google.com/maps/api/staticmap?center=" +
                      this.state.activeCompany.latitude +
                      "," +
                      this.state.activeCompany.longitude +
                      "&zoom=15&size=650x200&maptype=terrain&key=AIzaSyCFHrZBb72wmg5LTiMjUgI_CLhsoMLmlBk&sensor=false&markers=" +
                      this.state.activeCompany.latitude +
                      "," +
                      this.state.activeCompany.longitude
                    }
                    alt="exemple"
                  />
                </div>
              </Col>
            </Row>
            <Row
              style={{
                paddingTop: 40,
                paddingBottom: 40
              }}
            >
              <Col style={{ marginTop: 20 }} xs="12">
                <h5>Orders</h5>
              </Col>
              <Col style={{ marginTop: 20 }} xs="12">
                {this.renderOrderItems(this.state.activeOrderItem)}
              </Col>
            </Row>
          </Col>
        </Row>
        }
      </div>
    )
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
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                  {this.renderOrder()}
                </div>
                <UncontrolledDropdown style={{marginTop: 10}} isOpen={this.state.dropDownDate}  toggle={() => this.toggleDropDown()}>
                  <DropdownToggle
                    style={{
                      color: "#fff",
                      borderColor: "#fff",
                      backgroundColor: "#20a8d8"
                    }}
                    caret
                  >
                    {this.state.currentDateString}
                  </DropdownToggle>
                  <DropdownMenu>
                    <div >
                      <Calendar
                        date={this.state.currentDate}
                        maxDate={this.state.maxDate}
                        onChange={this.handleDateChange.bind(this)}
                      />
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
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

const OrderAccepted = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Order Accepted</b>
   
  </div>
)

const OrderRejected = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Order Rejected</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Unknown error</b>
   
  </div>
)

export default Order;
