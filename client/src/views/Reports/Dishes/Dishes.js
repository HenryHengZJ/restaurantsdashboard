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
  Progress,
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import moment from "moment";
import "./Dishes.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange } from 'react-date-range';
import { format, addDays, subDays } from 'date-fns';
import StarRatings from 'react-star-ratings';

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

class Dishes extends Component {
  constructor(props) {
    super(props);

    this.selectDateRange = this.selectDateRange.bind(this)

    this.state = {
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
      topsellingitems: [
        {
          itemtitle: 'Sandwich Combo',
          orderquantity: 108,
        },
        {
          itemtitle: 'Bagel Tray',
          orderquantity: 87,
        },
        {
          itemtitle: 'Traditional Irish Breakfast',
          orderquantity: 76,
        },
        {
          itemtitle: 'Chicken Parmigiano',
          orderquantity: 65,
        },
        {
          itemtitle: 'Lasagna',
          orderquantity: 54,
        },
        {
          itemtitle: 'Meatball & Cheese Sub',
          orderquantity: 27,
        },
      ],
    };
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

  renderMenuBarChart() {

    var topsellingitems = this.state.topsellingitems
    var itemarray = [];
    var barColor;

    for(let i = 0; i < topsellingitems.length; i++){
      if (topsellingitems[i].orderquantity > 70) {
        barColor = "success"
      }
      else if (topsellingitems[i].orderquantity <= 70 && topsellingitems[i].orderquantity > 30) {
        barColor = "warning"
      }
      else if (topsellingitems[i].orderquantity <= 30 && topsellingitems[i].orderquantity > 0) {
        barColor = "danger"
      }
      itemarray.push(
        <div className="progress-group mb-4">
          <div className="progress-group-header">
            <p >
              {topsellingitems[i].itemtitle}
            </p>
            <p className="ml-auto font-weight-bold">{topsellingitems[i].orderquantity}</p>
          </div>
          <div className="progress-group-bars">
            <Progress className="progress-xs" color={barColor} value={topsellingitems[i].orderquantity} />
          </div>
        </div>
      )
    } 

    return(
      <div>
        {itemarray}
      </div>
    )
  }

  renderTableItems() {
    var itemarray = [];

    var tableitems = this.state.Dishes;

    for (let i = 0; i < tableitems.length; i++) {
      itemarray.push(
        <tr>
          <td style={{width: '10%'}}>{tableitems[i].name}</td>
          <td style={{width: '15%'}}>{tableitems[i].location}</td>
          <td style={{width: '15%'}}>
            <StarRatings
              starRatedColor='orange'
              starSpacing='0px'
              starDimension='15px'
              rating={tableitems[i].rating}
              numberOfStars={5}
              name='rating'
            />
          </td>
          <td style={{width: '45%'}}>{tableitems[i].comment}</td>
          <td style={{width: '15%'}}>{tableitems[i].time}</td>
        </tr>
      );
    }

    return <tbody>{itemarray}</tbody>;
  }

  renderReviewTable() {
    return (
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
        {this.renderTableItems()}
      </Table>
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
                      Dishes
                    </Label>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                  {this.renderMenuBarChart()}
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

export default Dishes;
