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
import "./Sales.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange } from 'react-date-range';
import { format, addDays, subDays } from 'date-fns';
import axios from 'axios';
import apis from "../../../apis";
import TablePagination from "../../../components/TablePagination";

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        min: 0
      }    
    }]
  },
  maintainAspectRatio: false
};

class Sales extends Component {
  constructor(props) {
    super(props);

    this.tableClicked = this.tableClicked.bind(this);
    this.linechartClicked = this.linechartClicked.bind(this);
    this.barchartClicked = this.barchartClicked.bind(this);
    this.selectDateRange = this.selectDateRange.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
   

    this.state = {
      salesModal: false,
      selectedOrderItem: null,
      empty: false,
      isTablePressed: true,
      isLineChartPressed: false,
      isBarChartPressed: false,
      maxDate: null,
      currentDate: null,
      previousDate: null,
      sortDate: false,
      dropDownDate: false,
      dropDownPayment: false,
      dropDownType: false,
      dateRangePicker: {
        selection: {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
      },
      dateArray: [],
      dateRange: '',
      line: {
        labels: [],
        datasets: [
          {
            label: "Total sales",
            fill: false,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            data: []
          }
        ]
      },
      bar: {
        labels: [],
        datasets: [
          {
            label: "Total sales",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: []
          }
        ]
      },
      tableitems: [],
      pagesCount: 0,
      pageSize: 2,
      currentPage: 1,
      totalSalesCount: 0,
    };
  }

  getLocalStorage = () => {

    var maxDate = moment().toDate();

    var currentDate = moment(sessionStorage.getItem("currentLunchSalesDateString"), 'ddd, DD MMM YYYY').toDate()
    var previousDate = moment(sessionStorage.getItem("previousLunchSalesDateString"), 'ddd, DD MMM YYYY').toDate()

    var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")
    var previousDateString = moment(previousDate).format("ddd, DD MMM YYYY")
    var finalSelectionDate = previousDateString + ' - ' + currentDateString
    var finalDateArray = this.getIntervalDates(currentDate, previousDate).reverse();
    var newline = this.state.line;
    newline.labels = finalDateArray;
    var newbar = this.state.bar;
    newbar.labels = finalDateArray;

    this.setState({
      maxDate: maxDate,
      currentDate: currentDate,
      previousDate: previousDate,
      dateRange: finalSelectionDate,
      line: newline,
      bar: newbar,
      dateArray: finalDateArray,
    }, () => {
      this.getSales(currentDateString, previousDateString)
    })
  }

  componentDidMount() {

    if (sessionStorage.getItem("currentLunchSalesDateString") !== null && sessionStorage.getItem("previousLunchSalesDateString") !== null) {
      this.getLocalStorage()
    }
    else {
      var currentDate = moment().toDate();
      var previousDate = this.getPreviousDate(currentDate, 7);

      var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")
      var previousDateString = moment(previousDate).format("ddd, DD MMM YYYY")
      var finalSelectionDate = previousDateString + ' - ' + currentDateString
      var finalDateArray = this.getIntervalDates(currentDate, previousDate).reverse();
      var newline = this.state.line;
      newline.labels = finalDateArray;
      var newbar = this.state.bar;
      newbar.labels = finalDateArray;

      this.setState({
        maxDate: currentDate,
        currentDate: currentDate,
        previousDate: previousDate,
        dateRange: finalSelectionDate,
        line: newline,
        bar: newbar,
        dateArray: finalDateArray,
      }, () => {
        this.getSales(currentDateString, previousDateString)
      })
    }
  }

  getSales = (currentDateString, previousDateString) => {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETlunchorder + "?paymentStatus=succeeded" + "&lteDate=" + currentDateString + "&gteDate=" + previousDateString;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          var pagesCount = Math.ceil( response.data.length / this.state.pageSize );
          this.setState({
            tableitems: response.data,
            empty: response.data.length === 0 ? true : false,
            totalSalesCount: response.data.length,
            pagesCount,
            currentPage: 1
          }, () => {
            this.getChartData()
          })
        } 
      })
      .catch((error) => {
        this.setState({
          empty: true 
        })
      });
  }

  getChartData = () => {
    var linedata = [];
    var bardata = [];
    var tableitems = this.state.tableitems
    var dateArray = this.state.dateArray

    for (let i = 0; i < dateArray.length; i++) {
      var sales = 0
      for (let x = 0; x < tableitems.length; x++) {
        if (moment(tableitems[x].createdAt).format("ddd, DD MMM YYYY") === dateArray[i]) {
          sales = sales + tableitems[x].netOrderPrice
        }
      }
      linedata.push(sales)
      bardata.push(sales)
    }

    var newline = this.state.line;
    newline.datasets[0].data = linedata;
    var newbar = this.state.bar;
    newbar.datasets[0].data = bardata;

    this.setState({
      line: newline,
      bar: newbar,
    })
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
  
  tableItemClicked = (_id) => {
    
    var itemindex = this.state.tableitems.findIndex(x => x._id == _id);

    this.setState({
      selectedOrderItem: this.state.tableitems[itemindex]
    }, () => {
      this.toggleSalesModal()
    })
  }

  toggleSalesModal = () => {
    this.setState({
      salesModal: !this.state.salesModal
    })
  }

  toggleDropDown = () => {
    this.setState({
      dropDownDate: !this.state.dropDownDate
    })
  }
  
  sortDateClicked = () => {
    var sorteddata = [];
    if (this.state.sortDate) {
      sorteddata = this.state.tableitems.slice().sort(function(x, y) {
        return (
          new Date(y["createdAt"]).getTime() -
          new Date(x["createdAt"]).getTime()
        );
      });
    } else {
      sorteddata = this.state.tableitems.slice().sort(function(x, y) {
        return (
          new Date(x["createdAt"]).getTime() -
          new Date(y["createdAt"]).getTime()
        );
      });
    }
    this.setState({
      tableitems: sorteddata,
      sortDate: !this.state.sortDate,
      currentPage: 1
    });
  };

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

  handleRangeChange(which, payload) {
    this.setState({
      [which]: {
        ...this.state[which],
        ...payload,
      },
    });
  }

  selectDateRange() {
    var startDate = moment(this.state.dateRangePicker.selection.startDate).format("ddd, DD MMM YYYY")
    var endDate = moment(this.state.dateRangePicker.selection.endDate).format("ddd, DD MMM YYYY")
    var finalDate = startDate + ' - ' + endDate
    var finalDateArray = this.getIntervalDates(this.state.dateRangePicker.selection.endDate, this.state.dateRangePicker.selection.startDate).reverse();
    var newline = this.state.line;
    newline.labels = finalDateArray;
    var newbar = this.state.bar;
    newbar.labels = finalDateArray;

    this.setState({
      dateRange: finalDate,
      dropDownDate: !this.state.dropDownDate,
      currentDate: this.state.dateRangePicker.selection.endDate,
      previousDate: this.state.dateRangePicker.selection.startDate,
      line: newline,
      bar: newbar,
      dateArray: finalDateArray,
    }, () => {
      sessionStorage.setItem('currentLunchSalesDateString', endDate)
      sessionStorage.setItem('previousLunchSalesDateString', startDate)
      this.getSales(endDate, startDate)
    })
  }

  tableClicked() {
    this.setState({
      isTablePressed: true,
      isLineChartPressed: false,
      isBarChartPressed: false
    });
  }

  linechartClicked() {
    this.setState({
      isTablePressed: false,
      isLineChartPressed: true,
      isBarChartPressed: false,
    });
  }

  barchartClicked() {
    this.setState({
      isTablePressed: false,
      isLineChartPressed: false,
      isBarChartPressed: true,
    });
  }

  renderLineChart() {
    return <Line data={this.state.line} options={options} />;
  }

  renderBarChart() {
    return <Bar data={this.state.bar} options={options} />;
  }

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

  rendeSelectedOrderItems() {
    const { selectedOrderItem } = this.state;
    return (
      <div style={{ textAlign: "start" }}>
        <Table bordered responsive className="mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              <th>Item</th>
              <th>Price (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1x {selectedOrderItem.orderItem[0].title}</td>
              <td>{Number(selectedOrderItem.totalOrderPrice).toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>

        <Table style={{ marginTop: 20 }} borderless>
          <tbody>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>Customer</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                {selectedOrderItem.customerDetails[0].customerFirstName}{" "}
                {selectedOrderItem.customerDetails[0].customerLastName.charAt(
                  0
                )}
                .
                <Badge
                  style={{ marginLeft: 5 }}
                  color={
                    selectedOrderItem.customerType === "new"
                      ? "warning"
                      : selectedOrderItem.customerType === "recurring"
                      ? "primary"
                      : "secondary"
                  }
                >
                  {this.capitalizeFirstLetter(
                    selectedOrderItem.customerType
                  )}
                </Badge>
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>Date</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                {moment(selectedOrderItem.createdAt).format("DD MMM, YYYY")}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>Pick Up Time</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                {moment(selectedOrderItem.pickupTime).format("hh:mm A")}
              </td>
            </tr>
          </tbody>
        </Table>

        <div
          style={{
            height: 1,
            backgroundColor: "gray",
            opacity: 0.5,
            width: "100%"
          }}
        />

        <Table borderless>
          <tbody>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>Total Order Price</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                €{Number(selectedOrderItem.totalOrderPrice).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>FoodieBee Commission</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                {selectedOrderItem.commission}%
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 16, textAlign: "start" }}>Net Sales</td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                €{Number(selectedOrderItem.netOrderPrice).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  renderSalesModal() {
    const { selectedOrderItem } = this.state;
    return (
      <Modal
        isOpen={this.state.salesModal}
        toggle={() => this.toggleSalesModal()}
      >
        <ModalHeader toggle={() => this.toggleSalesModal()}>
          Order #{selectedOrderItem.orderNumber}
        </ModalHeader>

        <ModalBody>{this.rendeSelectedOrderItems()}</ModalBody>

        {selectedOrderItem.paymentStatus === "incomplete" ? 
        <ModalFooter>
          <Button disabled style={{ opacity: 1, fontSize: 17, padding: 10, fontWeight: '600'}} block onClick={() => this.toggleOrderModal()} color="warning">
            Payment Incomplete
          </Button>
        </ModalFooter>
        :
        selectedOrderItem.paymentStatus === "succeeded" ? 
        <ModalFooter>
          <Button disabled style={{ opacity: 1, marginTop: 7, fontSize: 17, padding: 10, fontWeight: '600'}} block color="success">
            Payment Succeeded
          </Button>
        </ModalFooter>
        :
        selectedOrderItem.paymentStatus === "refunded" ? 
        <ModalFooter>
          <Button disabled style={{ opacity: 1, marginTop: 7, fontSize: 17, padding: 10, fontWeight: '600'}} block color="danger">
            Payment Refunded
          </Button>
        </ModalFooter>
        :
        selectedOrderItem.paymentStatus === "uncaptured" ? 
        <ModalFooter>
          <Button disabled style={{ opacity: 1, marginTop: 7, fontSize: 17, padding: 10, fontWeight: '600'}} block color="secondary">
            Payment Uncaptured
          </Button>
        </ModalFooter>
        :
        null }
      </Modal>
    );
  }

  renderTableItems() {
    var itemarray = [];

    var tableitems = this.state.tableitems.slice((this.state.currentPage - 1) * this.state.pageSize,this.state.currentPage * this.state.pageSize);

    for (let i = 0; i < tableitems.length; i++) {
      itemarray.push(
        <tr style={{cursor: 'pointer'}} onClick={() => this.tableItemClicked(tableitems[i]._id)}>
          <td>#{tableitems[i].orderNumber}</td>
          <td>{moment(tableitems[i].createdAt).format("DD MMM, YYYY")}</td>
          <td> {tableitems[i].customerDetails[0].customerFirstName}{" "}{tableitems[i].customerDetails[0].customerLastName.charAt(0)}.</td>
          <td >1x {tableitems[i].orderItem[0].title}</td>
          <td>{Number(tableitems[i].totalOrderPrice).toFixed(2)}</td>
          <td>
            <Badge
              color=
              {
                  tableitems[i].paymentStatus === "incomplete"
                  ? "warning"
                  : tableitems[i].paymentStatus === "succeeded"
                  ? "success"
                  : tableitems[i].paymentStatus === "refunded"
                  ? "danger"
                  : tableitems[i].paymentStatus === "uncaptured"
                  ? "secondary"
                  : null
              }
            >
              {this.capitalizeFirstLetter(tableitems[i].paymentStatus)}
            </Badge>
          </td>
          <td>{tableitems[i].paymentStatus !== "succeeded" ? "0" : tableitems[i].commission}</td>
          <td>{tableitems[i].paymentStatus !== "succeeded" ? "0" : Number(tableitems[i].netOrderPrice).toFixed(2)}</td>
        </tr>
      );
    }

    return <tbody>{itemarray}</tbody>;
  }

  renderEmptyItems() {
    return (
      <Row style={{ marginTop: 90 }}>
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
            style={{ fontSize: 18, letterSpacing: 2, marginTop: 30 }}
            className="big"
          >
            You have 0 sales for now.
          </p>
        </Col>
      </Row>
    );
  }
 

  renderTable() {
    return (
      <div>
        <Table hover={true} >
          <thead className="thead-light">
            <tr>
              <th>Order No.</th>
              <th style={{ cursor: "pointer" }} className={!this.state.sortDate ? "headerSortUp" : "headerSortDown"} onClick={() => this.sortDateClicked()} >Date</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Order Price (€)</th>
              <th>Payment Status</th>
              <th>Commission (%)</th>
              <th>Net Sales (€)</th>
            </tr>
          </thead>
          {this.state.empty ? null : this.renderTableItems()}
        </Table>
        {this.state.empty ? this.renderEmptyItems() : null }
        <div style={{ marginTop: 20, marginBottom: 20 }} xs="12">
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
              {this.state.totalSalesCount === 0 ? 
              <p>
                Showing 0 of {this.state.totalSalesCount} sales
              </p>
              :
              <p>
                Showing{" "}
                {(this.state.currentPage - 1) * this.state.pageSize + 1} -{" "}
                {this.state.currentPage === this.state.pagesCount
                  ? this.state.totalSalesCount
                  : this.state.currentPage * this.state.pageSize}{" "}
                of {this.state.totalSalesCount} sales
              </p>
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  render() {
    const {
      isTablePressed,
      isLineChartPressed,
      isBarChartPressed
    } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Row >
                  <Col>
                    <Label style={{ marginTop: 10 }} className="h6">
                      Sales
                    </Label>
                  </Col>
                  <Button
                    style={{  backgroundColor: isTablePressed ? null : 'white', borderRightWidth: 0 }}
                    active={isTablePressed}
                    outline
                    className="btn-square float-right"
                    color="primary"
                    onClick={this.tableClicked}
                  >
                    <i style={{marginRight: 5}} className="fa fa-table" />
                    Table
                  </Button>
                  <Button
                    style={{ backgroundColor: isLineChartPressed ? null : 'white', borderRightWidth: 0 }}
                    active={isLineChartPressed}
                    outline
                    className="btn-square float-right"
                    color="primary"
                    onClick={this.linechartClicked}
                  >
                    <i style={{marginRight: 5}} className="fa fa-line-chart" />
                    Line
                  </Button>
                  <Button
                    style={{ backgroundColor: isBarChartPressed ? null : 'white',  marginRight: 10 }}
                    active={isBarChartPressed}
                    outline
                    className="btn-square float-right"
                    color="primary"
                    onClick={this.barchartClicked}
                  >
                    <i style={{marginRight: 5}} className="fa fa-bar-chart" />
                    Bar
                  </Button>
                </Row>
              </CardHeader>
              <CardBody>
                <Row style={{ marginLeft: 0 }}>
                  <h4>{this.state.dateRange}</h4>
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
                      <img style={{ objectFit:'cover', width: 17, height: 17 }} src={require("../../../assets/img/calendar.png")} />

                    </DropdownToggle>
                    <DropdownMenu>
                      <div >
                        <DateRange
                          onChange={this.handleRangeChange.bind(this, 'dateRangePicker')}
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          className={'PreviewArea'}
                          months={1}
                          ranges={[this.state.dateRangePicker.selection]}
                          direction="horizontal"
                          maxDate={this.state.maxDate}
                        />
                      </div>
                      <div className="float-right">
                        {this.renderDateAction()}     
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Row>
                <div style={{marginTop: 20}} className={isTablePressed ? null : "table-wrapper-scroll-y my-custom-scrollbar"}>
                  {isTablePressed
                    ? this.renderTable()
                    : isLineChartPressed
                    ? this.renderLineChart()
                    : this.renderBarChart()}
                </div>
               
              </CardBody>
            </Card>
          </Col>
          {this.state.selectedOrderItem !== null ? this.renderSalesModal() : null}
        </Row>
      </div>
    );
  }
}

export default Sales;
