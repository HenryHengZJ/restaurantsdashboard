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
    };
  }

  getLocalStorage = () => {

    var maxDate = moment().toDate();

    var currentDate = moment(sessionStorage.getItem("currentReviewDateString"), 'DD MMM, YYYY').toDate()
    var previousDate = moment(sessionStorage.getItem("previousReviewDateString"), 'DD MMM, YYYY').toDate()

    var currentDateString = moment(currentDate).format("DD MMM, YYYY")
    var previousDateString = moment(previousDate).format("DD MMM, YYYY")
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

    var currentDateString = moment(currentDate).format("DD MMM, YYYY")
    var previousDateString = moment(previousDate).format("DD MMM, YYYY")
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
          this.setState({
            tableitems: response.data,
            empty: response.data.length === 0 ? true : false
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
          <td style={{width: '10%'}}>{tableitems[i].customerFirstName}</td>
          <td style={{width: '15%'}}>{tableitems[i].customerCity}</td>
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
        <Table striped responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Time</th>
            </tr>
          </thead>
          {this.state.empty ? null : this.renderTableItems()}
          </Table>
          {this.state.empty ? this.renderEmptyItems() : null }
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
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                  {this.renderReviewTable()}
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
        </Row>
      </div>
    );
  }
}

export default Review;
