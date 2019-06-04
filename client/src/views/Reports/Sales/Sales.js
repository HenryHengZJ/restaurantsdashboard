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
    this.selectDateRange = this.selectDateRange.bind(this)

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
      tableitems: []
    };
  }

  getLocalStorage = () => {

    var maxDate = moment().toDate();

    var currentDate = moment(sessionStorage.getItem("currentSalesDateString"), 'DD MMM, YYYY').toDate()
    var previousDate = moment(sessionStorage.getItem("previousSalesDateString"), 'DD MMM, YYYY').toDate()

    var currentDateString = moment(currentDate).format("DD MMM, YYYY")
    var previousDateString = moment(previousDate).format("DD MMM, YYYY")
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

    if (sessionStorage.getItem("currentSalesDateString") !== null && sessionStorage.getItem("previousSalesDateString") !== null) {
      this.getLocalStorage()
    }
    else {
      var currentDate = moment().toDate();
      var previousDate = this.getPreviousDate(currentDate, 7);

      var currentDateString = moment(currentDate).format("DD MMM, YYYY")
      var previousDateString = moment(previousDate).format("DD MMM, YYYY")
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

    var url = apis.GETorder + "?lteDate=" + currentDateString + "&gteDate=" + previousDateString;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            tableitems: response.data,
            empty: response.data.length === 0 ? true : false
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
        if (moment(tableitems[x].createdAt).format("DD MMM, YYYY") === dateArray[i]) {
          sales = sales + tableitems[x].totalOrderPrice
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

  togglePayment = () => {
    this.setState({
      dropDownPayment: !this.state.dropDownPayment
    })
  }

  toggleType = () => {
    this.setState({
      dropDownType: !this.state.dropDownType
    })
  }

  getPreviousDate = (currentDate, days) => {
    return moment(currentDate).subtract(days, "days");
  };

  getIntervalDates = (startDate, stopDate) => {
    var dateArray = [];
    var currentDate = startDate;
    var endDate = stopDate;
    while (currentDate >= endDate) {
      dateArray.push(moment(currentDate).format("DD MMM, YYYY"));
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
    var startDate = moment(this.state.dateRangePicker.selection.startDate).format("DD MMM, YYYY")
    var endDate = moment(this.state.dateRangePicker.selection.endDate).format("DD MMM, YYYY")
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
      sessionStorage.setItem('currentSalesDateString', endDate)
      sessionStorage.setItem('previousSalesDateString', startDate)
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

  renderOrderItems(index) {
    var orderitemarray = [];

    var orderitems = this.state.tableitems[index].orderItem;

    for (let i = 0; i < orderitems.length; i++) {
      orderitemarray.push(
        <Row>
          <Label>
            {orderitems[i].quantity} x {orderitems[i].title}
          </Label>
        </Row>
      );
    }

    return <td>{orderitemarray}</td>;
  }

  renderSelectedOrderSelectionItem(selectionitem) {
    var itemstext = "";

    for (let i = 0; i < selectionitem.length; i++) {
      if (i == 0) {
        itemstext = selectionitem[i].selectionitemtitle;
      } else {
        itemstext = itemstext + ", " + selectionitem[i].selectionitemtitle;
      }
    }
    return (
      <div>
        <Label style={{ cursor: "pointer", opacity: 0.7 }}>{itemstext}</Label>
      </div>
    );
  }

  renderSelectedOrderSelection(selection) {
    var itemsarray = [];

    for (let i = 0; i < selection.length; i++) {
      itemsarray.push(
        <p key={i} style={{ textSize: 13, opacity: 0.7, margin: 0 }}>
          <span>&#8226;</span> {selection[i].selectioncategory}:
          {this.renderSelectedOrderSelectionItem(selection[i].selectionitem)}
        </p>
      );
    }

    return <div>{itemsarray}</div>;
  }

  renderInstruction(instruction) {
    var itemsarray = [];

    for (let i = 0; i < 1; i++) {
      itemsarray.push(
        <p key={i} style={{ textSize: 13, opacity: 0.7, margin: 0 }}>
          <span>&#8226;</span> Instruction:
          <div>
            <Label style={{ cursor: "pointer", opacity: 0.7 }}>
              {instruction}
            </Label>
          </div>
        </p>
      );
    }

    return <div>{itemsarray}</div>;
  }

  renderSelectedOrderTableItems() {
    const { selectedOrderItem } = this.state;

    var itemarray = [];

    var orderItem = selectedOrderItem.orderItem;

    for (let i = 0; i < orderItem.length; i++) {
      itemarray.push(
        <tr>
          <td style={{ fontWeight: "500" }}>{orderItem[i].quantity}</td>
          <td style={{ textAlign: "start" }}>
            <p
              style={{
                marginBottom: 5,
                fontWeight: "500",
                color: "#20a8d8",
                overflow: "hidden"
              }}
            >
              {orderItem[i].title}
            </p>

            <p
              style={{
                fontStyle: "italic",
                marginBottom: 5,
                textSize: 13,
                opacity: 0.7
              }}
            >
              serves {orderItem[i].serveperunit}
            </p>
            {typeof orderItem[i].selection === "undefined"
              ? null
              : this.renderSelectedOrderSelection(orderItem[i].selection)}
            {typeof orderItem[i].instruction === "undefined"
              ? null
              : this.renderInstruction(orderItem[i].instruction)}
          </td>

          <td style={{ width: "20%", textAlign: "start" }}>
            €{Number(orderItem[i].totalprice).toFixed(2)}
          </td>
        </tr>
      );
    }

    return <tbody>{itemarray}</tbody>;
  }

  rendeSelectedOrderItems() {
    const { selectedOrderItem } = this.state;
    return (
      <div style={{ textAlign: "start" }}>
        <Table responsive className="mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              <th>Qty</th>
              <th>Items</th>
              <th>Price</th>
            </tr>
          </thead>
          {this.renderSelectedOrderTableItems()}
        </Table>

        <Row style={{ marginTop: 20 }}>
          <Col>
            <Card
              style={{
                borderColor: "#20a8d8"
              }}
            >
              <CardBody style={{ margin: 0, padding: 10 }}>
                <h6
                  style={{
                    marginTop: 5,
                    textAlign: "center",
                    color: "#20a8d8"
                  }}
                >
                  {selectedOrderItem.orderType}
                </h6>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Collapse isOpen={selectedOrderItem.orderType === "Delivery"}>
          <Table borderless>
            <tbody>
              <tr>
                <td style={{ fontSize: 16, textAlign: "start" }}>
                  Delivery Fee
                </td>
                <td style={{ fontSize: 16, textAlign: "end" }}>
                  €{Number(2).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Collapse>

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
              <td
                style={{ fontSize: 16, fontWeight: "600", textAlign: "start" }}
              >
                TOTAL
              </td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                €{Number(selectedOrderItem.totalOrderPrice).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                style={{ fontSize: 16, fontWeight: "600", textAlign: "start" }}
              >
                Paid By
              </td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                {selectedOrderItem.paymentType}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  renderOrderModal() {
    const { selectedOrderItem } = this.state;
    return (
      <Modal
        isOpen={this.state.salesModal}
        toggle={() => this.toggleSalesModal()}
      >
        <ModalHeader toggle={() => this.toggleSalesModal()}>
          Order #{selectedOrderItem._id}
        </ModalHeader>
        <ModalBody>{this.rendeSelectedOrderItems()}</ModalBody>
      </Modal>
    );
  }

  renderTableItems() {
    var itemarray = [];

    var tableitems = this.state.tableitems;

    for (let i = 0; i < tableitems.length; i++) {
      itemarray.push(
        <tr style={{cursor: 'pointer'}} onClick={() => this.tableItemClicked(tableitems[i]._id)}>
          <td>{tableitems[i]._id}</td>
          <td>{moment(tableitems[i].createdAt).format("DD MMM, YYYY")}</td>
          {this.renderOrderItems(i)}
          <td>{Number(tableitems[i].totalOrderPrice).toFixed(2)}</td>
          <td>{tableitems[i].orderType}</td>
          <td>
            {tableitems[i].paymentType}
            {tableitems[i].paymentType == "Card" ?
              <i className="fa fa-cc-visa" style={{ fontSize: 20 + 'px', marginLeft: 10}}></i>
              :
              <i className="fa fa-money" style={{ fontSize: 24 + 'px', marginLeft: 10 }}></i>
            }
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
            You have 0 sales for now.
          </p>
        </Col>
      </Row>
    );
  }
 

  renderTable() {
    return (
      <div>
        <Table striped >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Time</th>
              <th>Items</th>
              <th>Price (€)</th>
              <th>
                <Row style={{marginLeft: 0}}> 
                  Type
                  <Dropdown isOpen={this.state.dropDownType} toggle={() => this.toggleType()} size="sm">
                    <DropdownToggle style={{margin:0, padding:0, paddingRight: 5, backgroundColor: 'white', borderWidth: 0}} caret />
                    <DropdownMenu>
                      <DropdownItem onClick={() => alert('Delivery Clicked')}>Delivery</DropdownItem>
                      <DropdownItem onClick={() => alert('Pickup Clicked')}>Pickup</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Row>
              </th>
              <th>
                <Row style={{marginLeft: 0}}> 
                  Payment
                  <Dropdown isOpen={this.state.dropDownPayment} toggle={() => this.togglePayment()} size="sm">
                    <DropdownToggle style={{margin:0, padding:0, paddingRight: 5, backgroundColor: 'white', borderWidth: 0}} caret />
                    <DropdownMenu>
                      <DropdownItem onClick={() => alert('Card Clicked')}>Card</DropdownItem>
                      <DropdownItem onClick={() => alert('Cash Clicked')}>Cash</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Row>
              </th>
              
            </tr>
          </thead>
          {this.state.empty ? null : this.renderTableItems()}
        </Table>
        {this.state.empty ? this.renderEmptyItems() : null }
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
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                  {isTablePressed
                    ? this.renderTable()
                    : isLineChartPressed
                    ? this.renderLineChart()
                    : this.renderBarChart()}
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
                    {this.state.dateRange}
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
              </CardBody>
            </Card>
          </Col>
          {this.state.selectedOrderItem !== null ? this.renderOrderModal() : null}
        </Row>
      </div>
    );
  }
}

export default Sales;
