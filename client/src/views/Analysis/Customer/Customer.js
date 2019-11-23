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
  UncontrolledDropdown
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import moment from "moment";
import "./Customer.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange } from 'react-date-range';
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

class Customer extends Component {
  constructor(props) {
    super(props);

    this.tableClicked = this.tableClicked.bind(this);
    this.linechartClicked = this.linechartClicked.bind(this);
    this.barchartClicked = this.barchartClicked.bind(this);
    this.selectDateRange = this.selectDateRange.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
   

    this.state = {
      empty: false,
      sortDate: false,
      isTablePressed: true,
      isLineChartPressed: false,
      isBarChartPressed: false,
      maxDate: null,
      currentDate: null,
      previousDate: null,
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
      dateRange: '',
      dateArray: [],
      line: {
        labels: [],
        datasets: [
          {
            label: 'New Customer',
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            borderWidth: 2,
            fill: false,
            data: [],
          },
          {
            label: 'Recurring Customer',
            backgroundColor: "rgba(150,73,191,0.4)",
            borderColor: "rgba(150,73,191,1)",
            pointHoverBackgroundColor: "rgba(150,73,191,1)",
            borderWidth: 2,
            fill: false,
            data: [],
          }
        ]
      },
      bar: {
        labels: [],
        datasets: [
          {
            label: "New Customer",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [],
          },
          {
            label: "Recurring Customer",
            backgroundColor: "rgba(36,201,27,0.2)",
            borderColor: "rgba(36,201,27,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(36,201,27,0.4)",
            hoverBorderColor: "rgba(36,201,27,1)",
            data: [],
          }
        ]
      },
      tableitems: [],
      filtered_data: [],
      pagesCount: 0,
      pageSize: 2,
      currentPage: 1,
      totalCustomerCount: 0,
    };
  }

  getSessionStorage = () => {
    
    var maxDate = moment().toDate();

    var currentDate = moment(sessionStorage.getItem("currentCustomerDateString"), 'ddd, DD MMM YYYY').toDate()
    var previousDate = moment(sessionStorage.getItem("previousCustomerDateString"), 'ddd, DD MMM YYYY').toDate()

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
      this.getCustomer(currentDateString, previousDateString)
    })
  }

  componentDidMount() {

    if (sessionStorage.getItem("currentCustomerDateString") !== null && sessionStorage.getItem("previousCustomerDateString") !== null) {
      this.getSessionStorage()
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
        this.getCustomer(currentDateString, previousDateString)
      })
    }
  }

  getCustomer = (currentDateString, previousDateString) => {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETlunchorder_customer + "?lteDate=" + currentDateString + "&gteDate=" + previousDateString;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          var pagesCount = Math.ceil( response.data.length / this.state.pageSize );
          this.setState({
            tableitems: response.data.length > 0 ? response.data : [],
            empty: response.data.length === 0 ? true : false,
            totalCustomerCount: response.data.length,
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
    var new_linedata = [];
    var recurring_linedata = [];
    var new_bardata = [];
    var recurring_bardata = [];
    var tableitems = this.state.tableitems
    var dateArray = this.state.dateArray

    for (let i = 0; i < dateArray.length; i++) {
      var newcount = 0
      var recurringcount = 0
      for (let x = 0; x < tableitems.length; x++) {
        if (moment(tableitems[x].createdAt).format("ddd, DD MMM YYYY") === dateArray[i]) {

          if (tableitems[x].customerType === 'new') {
            newcount = newcount + 1
          }
          else if (tableitems[x].customerType === 'recurring') {
            recurringcount = recurringcount + 1
          }
        }
      }
      new_linedata.push(newcount)
      new_bardata.push(newcount)

      recurring_linedata.push(recurringcount)
      recurring_bardata.push(recurringcount)
    }

    var newline = this.state.line;
    newline.datasets[0].data = new_linedata;
    newline.datasets[1].data = recurring_linedata;

    var newbar = this.state.bar;
    newbar.datasets[0].data = new_bardata;
    newbar.datasets[1].data = recurring_bardata;

    this.setState({
      line: newline,
      bar: newbar,
    })
  }

  toggleDropDown = () => {
    this.setState({
      dropDownDate: !this.state.dropDownDate
    })
  }

  toggleType = () => {
    this.setState({
      dropDownType: !this.state.dropDownType
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
  
  onTypeClicked = customerType => {
    if (customerType === "all") {
      const pagesCount = Math.ceil(this.state.tableitems.length / this.state.pageSize);
      this.setState({
        filtered_data: [],
        pagesCount,
        currentPage: 1
      });
    } else {
      var filtered_data = this.state.tableitems
        .slice()
        .filter(datachild => datachild.customerType === customerType);
      const pagesCount = Math.ceil(filtered_data.length / this.state.pageSize);
      this.setState({
        filtered_data,
        pagesCount,
        currentPage: 1
      });
    }
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
      sessionStorage.setItem('currentCustomerDateString', endDate)
      sessionStorage.setItem('previousCustomerDateString', startDate)
      this.getCustomer(endDate, startDate)
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

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  renderPendingAction() {
    return (
      <Row>
        <Button
          style={{ marginLeft: 10 }}
          className="float-right"
          color="success"
          onClick={this.tableClicked}
        >
          Accept
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          className="float-right"
          color="danger"
          onClick={this.linechartClicked}
        >
          Reject
        </Button>
      </Row>
    );
  }

  renderRejectAction() {
    return (
      <Row>
        <Button
          style={{ marginLeft: 10 }}
          className="float-right"
          color="secondary"
          onClick={this.tableClicked}
        >
          Reject
        </Button>
      </Row>
    );
  }

  renderAcceptAction() {
    return (
      <Row>
        <Button
          style={{ marginLeft: 10 }}
          className="float-right"
          color="secondary"
          onClick={this.tableClicked}
        >
          Accept
        </Button>
      </Row>
    );
  }


  renderTableItems() {
    var itemarray = [];

    var dataToShow = this.state.filtered_data.length > 0 ? this.state.filtered_data : this.state.tableitems;

    var tableitems = dataToShow.slice((this.state.currentPage - 1) * this.state.pageSize,this.state.currentPage * this.state.pageSize);

    for (let i = 0; i < tableitems.length; i++) {
      itemarray.push(
        <tr>
          <td>{tableitems[i].customerDetails[0].customerFirstName+" "+tableitems[i].customerDetails[0].customerLastName.charAt(0)}</td>
          <td>
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
          <td>#{tableitems[i].orderNumber}</td>
          <td>{moment(tableitems[i].createdAt).format("DD MMM, YYYY")}</td>
          <td>1x {tableitems[i].orderItem[0].title}</td>
          <td>{Number(tableitems[i].totalOrderPrice).toFixed(2)}</td>
          <td>
            <Badge
              color={
                    tableitems[i].orderStatus === "accepted"
                  ? "success"
                  : tableitems[i].orderStatus === "rejected"
                  ? "danger"
                  : tableitems[i].orderStatus === "pickedup"
                  ? "primary"
                  : tableitems[i].orderStatus === "pending"
                  ? "warning"
                  : "secondary"
              }
            >
              {this.capitalizeFirstLetter(tableitems[i].orderStatus)}
            </Badge>
          </td>
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
            You have 0 customers for now.
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
            <th>Name</th>
            <th
               onClick={() => this.toggleType()}
               style={{ cursor: "pointer" }}
            >
              <Row style={{marginLeft: 0}}> 
                Type
                <Dropdown
                    isOpen={this.state.dropDownType}
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
                        onClick={() => this.onTypeClicked("new")}
                      >
                        New
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => this.onTypeClicked("recurring")}
                      >
                        Recurring
                      </DropdownItem>
                      <DropdownItem onClick={() => this.onTypeClicked("all")}>
                        All
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
              </Row>
            </th>
            <th>Last Order No.</th>
            <th style={{ cursor: "pointer" }} className={!this.state.sortDate ? "headerSortUp" : "headerSortDown"} onClick={() => this.sortDateClicked()}>Last Order Date</th>
            <th>Last Order Item</th>
            <th>Last Order Price (€)</th>
            <th>Last Order Status</th>
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
              {this.state.totalCustomerCount === 0 ? 
              <p>
                Showing 0 of {this.state.totalCustomerCount} customers
              </p>
              :
              <p>
                Showing{" "}
                {(this.state.currentPage - 1) * this.state.pageSize + 1} -{" "}
                {this.state.currentPage === this.state.pagesCount
                  ? this.state.totalCustomerCount
                  : this.state.currentPage * this.state.pageSize}{" "}
                of {this.state.totalCustomerCount} customers
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
                      Customer
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
        </Row>
      </div>
    );
  }
}

export default Customer;
