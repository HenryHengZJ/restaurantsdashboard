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
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import moment from "moment";
import "./Order.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange, Calendar } from 'react-date-range';
import { format, addDays, subDays } from 'date-fns';
import axios from 'axios';
import apis from "../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import TablePagination from "../../components/TablePagination";

class Order extends Component {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
   
    this.state = {
      loadingModal: false,
      empty: false,
      maxDate: null,
      currentDate: null,
      dropDownDate: false,
      tableitems: [
        {
          orderItemID: "123456789",
          orderNumber: "123",
          orderItem: [{
            title: "Ebi Furai",
            descrip: "Deep fried king prawns coated in seasonal breadcrumbs served with sweet Japanese sauce",
            priceperunit: 5.9,
          }],
          customerID: "123123123",
          customerDetails: [{
            customerFirstName: "Cian",
            customerLastName: "Horan",
            customerPhoneNumber: "083-9457891",
          }],
          customerType: "new",
          totalOrderPrice: 5.9,
          orderStatus: "pending",
          paymentIntentID: "123123123",
          paymentType: "visa",
          paymentStatus: "pending",
          pickupTime: new Date(),
        },
        {
          orderItemID: "123456789",
          orderNumber: "478",
          orderItem: [{
            title: "Yasai Gyoza",
            descrip: "Finely chopped seasonal vegetables dumpling steamed and then pan fried, served with traditional gyoza sauce",
            priceperunit: 6.8,
          }],
          customerID: "123123123",
          customerDetails: [{
            customerFirstName: "John",
            customerLastName: "King",
            customerPhoneNumber: "083-9920456",
          }],
          customerType: "recurring",
          totalOrderPrice: 6.8,
          orderStatus: "accepted",
          paymentIntentID: "123123123",
          paymentType: "visa",
          paymentStatus: "succeeded",
          pickupTime: new Date(),
          createdAt: new Date(),
        }
      ],
      pagesCount: 0,
      pageSize: 2,
      currentPage: 1,
      togglePickUpTime: false,
      dropDownStatusForLunch: false,
      filtered_data: [],
      totalOrderCount: 0,
      selectedLunchOrderItem: null,
      orderLunchModal: false
    };
  }


  componentDidMount() {
    this.getTodayDate()
  }

  getLocalStorage = () => {
    
    var maxDate = moment().add(1, 'days').toDate();

    var currentDate = moment(sessionStorage.getItem("currentLunchOrderDateString"), 'ddd, DD MMM YYYY').toDate()
  
    var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")

    this.setState({
      maxDate: maxDate,
      currentDate: currentDate,
    }, () => {
      this.getOrder(currentDateString)
    })
  }

  getTodayDate = () => {

    var maxDate = moment().add(1, 'days').toDate();

    var currentDate = moment().toDate();

    var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")
  
    this.setState({
      maxDate: maxDate,
      currentDate: currentDate,
    }, () => {
      this.getOrder(currentDateString)
    })
  }

  getOrder = (currentDateString) => {
  
    /*var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETlunchorder + "?date=" + currentDateString;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          var pagesCount = Math.ceil( response.data.length / this.state.pageSize );
          console.log(response.data)
          this.setState({
            tableitems: response.data,
            empty: response.data.length === 0 ? true : false,
            totalOrderCount: response.data.length,
            pagesCount,
            currentPage: 1,
            loadingModal: false,
          })
        } 
      })
      .catch((error) => {
        this.setState({
          empty: true ,
          loadingModal: false,
        })
      });*/

      this.setState({
        empty: false,
        totalOrderCount: 1,
        pagesCount: 1,
        currentPage: 1,
        loadingModal: false,
      })
  }

  toggleDropDown = () => {
    this.setState({
      dropDownDate: !this.state.dropDownDate
    })
  }

  toggleStatusForLunch = () => {
    this.setState({
      dropDownStatusForLunch: !this.state.dropDownStatusForLunch
    })
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleDateChange(date) {
    this.setState({
      currentDate: date,
      currentDateString: moment(date).format("ddd, DD MMM YYYY"),
      dropDownDate: !this.state.dropDownDate, 
    //  loadingModal: true,
    }, () => {
    //  sessionStorage.setItem('currentLunchOrderDateString', moment(date).format("ddd, DD MMM YYYY"))
    //  this.getOrder(moment(date).format("ddd, DD MMM YYYY"))
    })
  }

  tableItemClicked = (_id) => {
    var itemindex = this.state.tableitems.findIndex(x => x._id == _id);

    if (itemindex >= 0) {
      this.setState({
        selectedLunchOrderItem: this.state.tableitems[itemindex]
      }, () => {
        this.toggleLunchOrderModal()
      })
  
    }
  }

  toggleLunchOrderModal = () => {
    this.setState({
      orderLunchModal: !this.state.orderLunchModal
    })
  }

  acceptOrder = (orderID, type) => {

    this.setState({
      loadingModal: true
    })

    var headers = {
      'Content-Type': 'application/json',
    }

    var body ={}

    if (type === "single") {
      body ={
        arrayOfLunchOrderID: JSON.stringify([orderID])
      }
    }
    else {
      var arrayOfLunchOrderID = []
      var filtered_data = this.state.tableitems.slice().filter(datachild => datachild.orderStatus === "pending");
      for (let i = 0; i < filtered_data.length; i++) {
        arrayOfLunchOrderID.push(filtered_data[i]._id)
      }
      body ={
        arrayOfLunchOrderID: JSON.stringify(arrayOfLunchOrderID)
      }
    }

    var url = apis.PUTaccept_lunchorder

    axios.put(url, body, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<OrderAccepted/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false,
            orderLunchModal: false
          }, () => {
            if (sessionStorage.getItem("currentLunchOrderDateString") !== null) {
              this.getLocalStorage()
            }
            else {
              this.getTodayDate()
            }
          })
        } 
      })
      .catch((error) => {
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          loadingModal: false,
          orderLunchModal: false
        })
      });
  }

  
  rejectOrder = (orderID, type) => {

    this.setState({
      loadingModal: true
    })

    var headers = {
      'Content-Type': 'application/json',
    }

    var body ={}

    if (type === "single") {
      body ={
        arrayOfLunchOrderID: JSON.stringify([orderID])
      }
    }
    else {
      var arrayOfLunchOrderID = []
      var filtered_data = this.state.tableitems.slice().filter(datachild => datachild.orderStatus === "pending");
      for (let i = 0; i < filtered_data.length; i++) {
        arrayOfLunchOrderID.push(filtered_data[i]._id)
      }
      body ={
        arrayOfLunchOrderID: JSON.stringify(arrayOfLunchOrderID)
      }
    }

    var url = apis.PUTreject_lunchorder

    axios.put(url, body, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<OrderRejected/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false,
            orderLunchModal: false
          }, () => {
            if (sessionStorage.getItem("currentLunchOrderDateString") !== null) {
              this.getLocalStorage()
            }
            else {
              this.getTodayDate()
            }
          })
        } 
      })
      .catch((error) => {
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          loadingModal: false,
          orderLunchModal: false
        })
      });
  }

  handlePageClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index + 1
    });
  }

  handlePreviousClick(e) {
    e.preventDefault();
    const index = this.state.currentPage - 1;
    this.setState({
      currentPage: index
    });
  }

  handleNextClick(e) {
    e.preventDefault();
    const index = this.state.currentPage + 1;
    this.setState({
      currentPage: index
    });
  }
  
  sortPickUpTime = () => {
    var sorteddata = [];
    if (this.state.togglePickUpTime) {
      sorteddata = this.state.tableitems.slice().sort(function(x, y) {
        return (
          new Date(y["pickupTime"]).getTime() -
          new Date(x["pickupTime"]).getTime()
        );
      });
    } else {
      sorteddata = this.state.tableitems.slice().sort(function(x, y) {
        return (
          new Date(x["pickupTime"]).getTime() -
          new Date(y["pickupTime"]).getTime()
        );
      });
    }
    this.setState({
      tableitems: sorteddata,
      togglePickUpTime: !this.state.togglePickUpTime,
      currentPage: 1
    });
  };

  renderDateAction() {
    return (
      <Row style={{marginBottom: 10, marginRight: 10}}>
        <Col>
        
        <Button
          style={{ marginLeft: 10 }}
          outline
          color="primary"
          onClick={this.selectDateRange}
        >
          Select
        </Button>
        <Button
          style={{ marginLeft: 10, opacity: 0.6 }}
          outline
          color="dark"
          onClick={() => this.toggleDropDown()}
        >
          Cancel
        </Button>
        </Col>
      </Row>
    );
  }


  onStatusClicked = orderStatus => {
    if (orderStatus === "all") {
      const pagesCount = Math.ceil(this.state.tableitems.length / this.state.pageSize);
      this.setState({
        filtered_data: [],
        pagesCount,
        currentPage: 1
      });
    } else {
      var filtered_data = this.state.tableitems
        .slice()
        .filter(datachild => datachild.orderStatus === orderStatus);
      const pagesCount = Math.ceil(filtered_data.length / this.state.pageSize);
      this.setState({
        filtered_data,
        pagesCount,
        currentPage: 1
      });
    }
  };

  rendeSelectedLunchOrderItems() {
    const { selectedLunchOrderItem } = this.state;
    return (
      <div style={{ textAlign: "start" }}>
        <Table bordered responsive className="mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1x {selectedLunchOrderItem.orderItem[0].title}</td>
              <td>{selectedLunchOrderItem.totalOrderPrice}</td>
            </tr>
          </tbody>
        </Table>

        <Table style={{ marginTop: 20 }} borderless>
          <tbody>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>Customer</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                {selectedLunchOrderItem.customerDetails[0].customerFirstName}{" "}
                {selectedLunchOrderItem.customerDetails[0].customerLastName.charAt(
                  0
                )}
                .
                <Badge
                  style={{ marginLeft: 5 }}
                  color={
                    selectedLunchOrderItem.customerType === "new"
                      ? "warning"
                      : selectedLunchOrderItem.customerType === "recurring"
                      ? "primary"
                      : "secondary"
                  }
                >
                  {this.capitalizeFirstLetter(
                    selectedLunchOrderItem.customerType
                  )}
                </Badge>
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>Pick Up Time</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                {moment(selectedLunchOrderItem.pickupTime).format("hh:mm A")}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  renderLunchOrderModal() {
    const { selectedLunchOrderItem } = this.state;
    return (
      <Modal
        isOpen={this.state.orderLunchModal}
        toggle={() => this.toggleLunchOrderModal()}
      >
        <ModalHeader toggle={() => this.toggleLunchOrderModal()}>
          Order #{selectedLunchOrderItem.orderNumber}
        </ModalHeader>
        <ModalBody>
          {this.rendeSelectedLunchOrderItems()}
          {selectedLunchOrderItem.orderStatus === "pending"
            ? this.renderPendingStatus()
            : null}
        </ModalBody>
        <ModalFooter style={{ padding: 0 }}>
          {selectedLunchOrderItem.orderStatus === "accepted" ? (
            <Button
              style={{
                opacity: 1,
                padding: 10,
                fontSize: 17,
                fontWeight: "600"
              }}
              disabled
              block
              color="success"
            >
              Accepted
            </Button>
          ) : selectedLunchOrderItem.orderStatus === "cancelled" ? (
            <Button
              style={{
                opacity: 1,
                padding: 10,
                fontSize: 17,
                fontWeight: "600"
              }}
              disabled
              block
              color="secondary"
            >
              Cancelled
            </Button>
          ) : selectedLunchOrderItem.orderStatus === "rejected" ? (
            <Button
              style={{
                opacity: 1,
                padding: 10,
                fontSize: 17,
                fontWeight: "600"
              }}
              disabled
              block
              color="danger"
            >
              Rejected
            </Button>
          ) : selectedLunchOrderItem.orderStatus === "pickedup" ? (
            <Button
              style={{
                opacity: 1,
                padding: 10,
                fontSize: 17,
                fontWeight: "600"
              }}
              disabled
              block
              color="primary"
            >
              Picked Up
            </Button>
           ) : null }
        </ModalFooter>
      </Modal>
    );
  }

  renderEmptyItems() {
    return (
      <Row style={{ marginTop: 40 }}>
        <Col style={{ textAlign: "center" }} xs="12">
          <img
            style={{
              objectFit: "cover",
              width: 70,
              height: 70,
              opacity: 0.6
            }}
            alt={""}
            src={
              "https://s3-eu-west-1.amazonaws.com/foodiebeegeneralphoto/empty.png"
            }
          />
        </Col>
        <Col style={{ textAlign: "center" }} xs="12">
          <p
            style={{ fontSize: 18, letterSpacing: 2, marginTop: 20 }}
            className="big"
          >
            No orders yet.
          </p>
        </Col>
      </Row>
    );
  }

  renderLunchTable() {
    return (
      <div>
        <Table hover={true} responsive={this.state.totalOrderCount === 0 ? false : true }>
          <thead className="thead-light">
            <tr>
              <th>Order No.</th>
              <th>Customer</th>
              <th
                style={{ cursor: "pointer" }}
                className={
                  !this.state.togglePickUpTime
                    ? "headerSortUp"
                    : "headerSortDown"
                }
                onClick={() => this.sortPickUpTime()}
              >
                Pick Up
              </th>
              <th>Item</th>
              <th>Price (€)</th>
              <th
                onClick={() => this.toggleStatusForLunch()}
                style={{ cursor: "pointer" }}
              >
                <Row style={{ marginLeft: 0 }}>
                  Status
                  <Dropdown
                    isOpen={this.state.dropDownStatusForLunch}
                    size="sm"
                  >
                    <DropdownToggle
                      style={{
                        margin: 0,
                        padding: 0,
                        paddingRight: 5,
                        backgroundColor: "transparent",
                        color: "rgb(141, 141, 141)",
                        marginLeft: 5,
                        borderWidth: 0
                      }}
                      caret
                    />
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() => this.onStatusClicked("pending")}
                      >
                        Pending
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => this.onStatusClicked("accepted")}
                      >
                        Accepted
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => this.onStatusClicked("rejected")}
                      >
                        Rejected
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => this.onStatusClicked("pickedup")}
                      >
                        Picked Up
                      </DropdownItem>
                      <DropdownItem onClick={() => this.onStatusClicked("all")}>
                        All
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Row>
              </th>
            </tr>
          </thead>

          {this.state.empty ? null : this.renderLunchTableItems()}
        </Table>
        {this.state.empty ? this.renderEmptyItems() : null}
      </div>
    );
  }

  renderLunchTableItems() {
    var itemarray = [];

    var dataToShow =
      this.state.filtered_data.length > 0 ? this.state.filtered_data : this.state.tableitems;

    var tableitems = dataToShow.slice((this.state.currentPage - 1) * this.state.pageSize,this.state.currentPage * this.state.pageSize);

    for (let i = 0; i < tableitems.length; i++) {
      itemarray.push(
        <tr
          style={{ cursor: "pointer" }}
        >
          <td style={{ width: "10%" }} onClick={() => this.tableItemClicked(tableitems[i]._id)}>#{tableitems[i].orderNumber}</td>
          <td style={{ width: "15%" }} onClick={() => this.tableItemClicked(tableitems[i]._id)}>
            {tableitems[i].customerDetails[0].customerFirstName}{" "}
            {tableitems[i].customerDetails[0].customerLastName.charAt(0)}.
            <Badge
              style={{ marginLeft: 5 }}
              color={
                tableitems[i].customerType === "new"
                  ? "warning"
                  : tableitems[i].customerType === "recurring"
                  ? "primary"
                  : "secondary"
              }
            >
              {this.capitalizeFirstLetter(tableitems[i].customerType)}
            </Badge>
          </td>
          <td style={{ width: "10%" }} onClick={() => this.tableItemClicked(tableitems[i]._id)}>
            {moment(tableitems[i].pickupTime).format("hh:mm A")}
          </td>
          <td style={{ width: "35%" }} onClick={() => this.tableItemClicked(tableitems[i]._id)}>
            1x {tableitems[i].orderItem[0].title}
          </td>
          <td style={{ width: "10%" }} onClick={() => this.tableItemClicked(tableitems[i]._id)}>
            {Number(tableitems[i].totalOrderPrice).toFixed(2)}
          </td>
          <td style={{ width: "20%" }} onClick={() => tableitems[i].orderStatus === "pending" ? this.tableItemClicked("") : this.tableItemClicked(tableitems[i]._id)}>
            {tableitems[i].orderStatus === "pending" ? (
              this.renderPendingStatus(tableitems[i]._id)
            ) : (
              <Badge
                color={
                  tableitems[i].orderStatus === "accepted"
                    ? "success"
                    : tableitems[i].orderStatus === "rejected"
                    ? "danger"
                    : tableitems[i].orderStatus === "pickedup"
                    ? "primary"
                    : "secondary"
                }
              >
                {this.capitalizeFirstLetter(tableitems[i].orderStatus)}
              </Badge>
            )}
          </td>
        </tr>
      );
    }

    return <tbody>{itemarray}</tbody>;
  }

  renderPendingStatus(_id) {
    return (
      <Row>
        <Col xs="12" sm="12" md="12" lg="6">
          <Button
            outline
            style={{ opacity: 1, fontSize: 14, fontWeight: "600" }}
            block
            color="danger"
           // onClick={() => this.rejectOrder(_id, "single")}
          >
            Reject
          </Button>
        </Col>
        <Col xs="12" sm="12" md="12" lg="6">
          <Button
            outline
            style={{ opacity: 1, fontSize: 14, fontWeight: "600" }}
            block
            color="success"
          //  onClick={() => this.acceptOrder(_id, "single")}
          >
            Accept
          </Button>
        </Col>
      </Row>
    );
  }
  
  renderLoadingModal() {

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: require('../../assets/animation/order_loading.json'),
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
              <CardHeader>
                <Row >
                  <Col>
                    <Label style={{ marginTop: 10 }} className="h6">
                      Orders
                    </Label>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col
                    style={{
                      paddingTop: 10,
                      backgroundColor: "white"
                    }}
                    xs="12"
                  >
                    <Row style={{ marginLeft: 0 }}>
                    <h4>{moment(this.state.currentDate).format("ddd, DD MMM YYYY")}</h4>
                    <UncontrolledDropdown style={{marginLeft: 10}} isOpen={this.state.dropDownDate}  toggle={() => this.toggleDropDown()}>
                      <DropdownToggle
                        style={{
                          borderColor: "#20a8d8",
                          backgroundColor: "white",
                          paddingTop: 3,
                          paddingRight: 10,
                          paddingLeft: 10,
                          paddingBottom: 5
                        }}
                      >
                        <img style={{ objectFit:'cover', width: 17, height: 17 }} src={require("../../assets/img/calendar.png")} />

                      </DropdownToggle>
                      <DropdownMenu>
                        <div >
                          <Calendar
                            date={this.state.currentDate}
                            maxDate={this.state.maxDate}
                            onChange={this.handleDateChange.bind(this)}
                          />
                        </div>
                        <div className="float-right">
                          {this.renderDateAction()}     
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    </Row>
                  </Col>

                  <Col style={{ marginTop: 20, marginBottom: 20 }} xs="12">
                    <div>
                      <Button color="success" 
                       //onClick={() => this.acceptOrder("", "bulk")}
                       >
                        Accept All
                      </Button>
                      <Button color="danger" 
                     // onClick={() => this.rejectOrder("", "bulk")} 
                      style={{ marginLeft: 10 }}>
                        Reject All
                      </Button>
                    </div>
                  </Col>

                  <Col xs="12">{this.renderLunchTable()}</Col>
                  <Col style={{ marginTop: 20, marginBottom: 20 }} xs="12">
                    <Row>
                      <Col xs="12" md="6">
                        <TablePagination
                          pagesCount={this.state.pagesCount}
                          currentPage={this.state.currentPage - 1}
                          handlePageClick={this.handlePageClick}
                          handlePreviousClick={this.handlePreviousClick}
                          handleNextClick={this.handleNextClick}
                        />
                      </Col>
                      <Col style={{ textAlign: "end" }} xs="0" md="6">
                        {this.state.totalOrderCount === 0 ? 
                        <p>
                          Showing 0 of {this.state.totalOrderCount} orders
                        </p>
                        :
                        <p>
                          Showing{" "}
                          {(this.state.currentPage - 1) * this.state.pageSize + 1} -{" "}
                          {this.state.currentPage === this.state.pagesCount
                            ? this.state.totalOrderCount
                            : this.state.currentPage * this.state.pageSize}{" "}
                          of {this.state.totalOrderCount} orders
                        </p>
                        }
                      </Col>
                    </Row>
                  </Col>
                </Row>
                
              </CardBody>
            </Card>
          </Col>
          {this.state.selectedLunchOrderItem !== null ? this.renderLunchOrderModal() : null}
          {this.renderLoadingModal()}
          <ToastContainer hideProgressBar/>
        </Row>
      </div>
    );
  }
}

const OrderAccepted = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Order Accepted</b>
   
  </div>
)

const OrderRejected = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Order Rejected</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Unknown error</b>
   
  </div>
)

export default Order;
