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
import "./Review.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange } from 'react-date-range';
import { format, addDays, subDays } from 'date-fns';
import StarRatings from 'react-star-ratings';
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

class Review extends Component {
  constructor(props) {
    super(props);

    this.selectDateRange = this.selectDateRange.bind(this)

    this.state = {
      empty: false,
      sortDate: false,
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
      tableitems: [],
      pagesCount: 0,
      pageSize: 2,
      currentPage: 1,
      totalReviewCount: 0,
    };
  }

  getLocalStorage = () => {

    var maxDate = moment().toDate();

    var currentDate = moment(sessionStorage.getItem("currentReviewDateString"), 'ddd, DD MMM YYYY').toDate()
    var previousDate = moment(sessionStorage.getItem("previousReviewDateString"), 'ddd, DD MMM YYYY').toDate()

    var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")
    var previousDateString = moment(previousDate).format("ddd, DD MMM YYYY")
    var finalSelectionDate = previousDateString + ' - ' + currentDateString
    var finalDateArray = this.getIntervalDates(currentDate, previousDate).reverse();

    this.setState({
      maxDate: maxDate,
      currentDate: currentDate,
      previousDate: previousDate,
      dateRange: finalSelectionDate,
      dateArray: finalDateArray,
    }, () => {
      this.getReview(currentDateString, previousDateString)
    })
  }

  componentDidMount() {
    var currentDate = moment().toDate();
    var previousDate = this.getPreviousDate(currentDate, 7);

    var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")
    var previousDateString = moment(previousDate).format("ddd, DD MMM YYYY")
    var finalSelectionDate = previousDateString + ' - ' + currentDateString
    var finalDateArray = this.getIntervalDates(currentDate, previousDate).reverse();
 
    this.setState({
      maxDate: currentDate,
      currentDate: currentDate,
      previousDate: previousDate,
      dateRange: finalSelectionDate,
      dateArray: finalDateArray,
    }, () => {
      this.getReview(currentDateString, previousDateString)
    })
  }

  getReview = (currentDateString, previousDateString) => {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETreview + "?lteDate=" + currentDateString + "&gteDate=" + previousDateString;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          var pagesCount = Math.ceil( response.data.length / this.state.pageSize );
          this.setState({
            tableitems: response.data,
            empty: response.data.length === 0 ? true : false,
            totalReviewCount: response.data.length,
            pagesCount,
            currentPage: 1
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
    this.setState({
      dateRange: finalDate,
      dropDownDate: !this.state.dropDownDate,
      currentDate: this.state.dateRangePicker.selection.endDate,
      previousDate: this.state.dateRangePicker.selection.startDate,
      dateArray: finalDateArray,
    }, () => {
      sessionStorage.setItem('currentReviewDateString', endDate)
      sessionStorage.setItem('previousReviewDateString', startDate)
      this.getReview(endDate, startDate)
    })
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

  renderTableItems() {
    var itemarray = [];

    var tableitems = this.state.tableitems;

    for (let i = 0; i < tableitems.length; i++) {
      itemarray.push(
        <tr>
          <td style={{width: '10%'}}>{tableitems[i].customerDetails[0].customerFirstName}{" "}{tableitems[i].customerDetails[0].customerLastName.charAt(0)}.</td>
          <td style={{width: '15%'}}>
            <StarRatings
              starRatedColor='orange'
              starSpacing='0px'
              starDimension='15px'
              rating={tableitems[i].customerRating}
              numberOfStars={5}
              name='rating'
            />
          </td>
          <td style={{width: '45%'}}>{tableitems[i].customerComment}</td>
          <td style={{width: '15%'}}>{moment(tableitems[i].createdAt).format("DD MMM, YYYY")}</td>
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
            You have 0 reviews for now.
          </p>
        </Col>
      </Row>
    );
  }

  renderReviewTable() {
    return (
      <div>
        <Table hover={true} >
          <thead className="thead-light">
            <tr>
              <th>Customer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th style={{ cursor: "pointer" }} className={!this.state.sortDate ? "headerSortUp" : "headerSortDown"} onClick={() => this.sortDateClicked()} >Date</th>
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
              {this.state.totalReviewCount === 0 ? 
              <p>
                Showing 0 of {this.state.totalReviewCount} reviews
              </p>
              :
              <p>
                Showing{" "}
                {(this.state.currentPage - 1) * this.state.pageSize + 1} -{" "}
                {this.state.currentPage === this.state.pagesCount
                  ? this.state.totalReviewCount
                  : this.state.currentPage * this.state.pageSize}{" "}
                of {this.state.totalReviewCount} reviews
              </p>
              }
            </Col>
          </Row>
        </div>
      </div>
    );
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
                      Review
                    </Label>
                  </Col>
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
                <div style={{marginTop: 20}}>
                  {this.renderReviewTable()}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Review;
