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
      fetchedmenu: [],
      menuitems: [],
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

    this.getCatererMenu()
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
            fetchedmenu: response.data,
          },() => {
            this.restructureMenu();
          })
        } 
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
      });
  }

  restructureMenu = () => {
    var finalresult = [];

    var result = this.state.fetchedmenu.reduce(function(r, a) {
      r[a.categorytag] = r[a.categorytag] || [];
      r[a.categorytag].push(a);
      return r;
    }, Object.create(null));

    for (var key in result) {
      var result2 = result[key].reduce(function(r, a) {
        r[a.categoryname] = r[a.categoryname] || [];
        r[a.categoryname].push(a);
        return r;
      }, Object.create(null));

      var parentObject = {
        menutitle: key,
        menuitem: []
      };

      for (var key2 in result2) {
        var childObject = {
          categoryname: key2,
          items: result2[key2]
        };
        parentObject["menuitem"].push(childObject);
      }

      finalresult.push(parentObject);
    }

    this.setState({
      menuitems: finalresult,
      loading: false,
    })
  };


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

  renderMenuItems() {
    
    var menuitems = this.state.menuitems

    var itemarray = [];

    for(let i = 0; i < menuitems.length; i++){

      itemarray.push(
        <div >
          <div >
            <p style={{fontWeight: '600', color: "black", fontSize: 17, paddingTop: i === 0 ? 0 : 20}}>
              {menuitems[i].menutitle}
            </p>
          </div>
          {this.renderCategoryMenu(menuitems[i].menuitem)}
        </div>
      )
    } 

    return(
      <div>
        {itemarray}
      </div>
    )
  }

  renderCategoryMenu(menuitem) {
 
    var itemarray = [];

    for(let x = 0; x < menuitem.length; x++){
      itemarray.push(
        <div>
          <div >
            <p style={{fontWeight: '600', color: "#20a8d8", fontSize: 15,  paddingTop: 10}}>
              {menuitem[x].categoryname}
            </p>
          </div>
          {this.renderMenuBarChart(menuitem[x].items)}
        </div>
      )
    }

    return(
      <div> 
        {itemarray}
      </div>
    )
  }

  renderMenuBarChart(items) {

    var itemarray = [];
    var barColor;

    for(let i = 0; i < items.length; i++){
      if (items[i].soldamount > 70) {
        barColor = "success"
      }
      else if (items[i].soldamount <= 70 && items[i].soldamount > 30) {
        barColor = "warning"
      }
      else if (items[i].soldamount <= 30 && items[i].soldamount > 0) {
        barColor = "danger"
      }
      itemarray.push(
        <div className="progress-group mb-4">
          <div className="progress-group-header">
            <p >
              {items[i].title}
            </p>
            <p style={{paddingRight: 20, fontSize: 17, fontWeight: '600'}} className="ml-auto">{items[i].soldamount}</p>
          </div>
          <div className="progress-group-bars">
            <Progress className="progress-xs" color={barColor} value={items[i].soldamount} />
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
            You have 0 dishes for now.
          </p>
        </Col>
      </Row>
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
                  {this.state.fetchedmenu.length > 0 ? this.renderMenuItems() : this.renderEmptyItems()}
                </div>
                
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dishes;
