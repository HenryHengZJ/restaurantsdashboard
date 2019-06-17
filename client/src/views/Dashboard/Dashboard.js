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
  Progress,
  Table
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import moment from "moment";
import { format, addDays, subDays } from 'date-fns';
import "./Dashboard.css";
import StarRatingComponent from "react-star-rating-component";
import axios from 'axios';
import apis from "../../apis";

const ratingicon = require('../../assets/img/star.png');

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

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  
    this.state = {
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: 'Closed',
      fadeIn: true,
      timeout: 300,
      domainName: "",
      currentDate: null,
      previousDate: null,
      profileEdit: false,
      orderEdit: false, 
      salesEdit: false,
      customerEdit: false,
      menuitemEdit: false,
      reviewEdit: false,
      orderline: {
        labels: [],
        datasets: [
          {
            label: "Total orders",
            fill: true,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            data: [],
            orderlast7days: 0,
            orderalltime: 0
          }
        ]
      },
      salesbar: {
        labels: [],
        datasets: [
          {
            label: "Total sales",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [],
            saleslast7days: 0,
            salesalltime: 0
          }
        ]
      },
      customerpie: {
        labels: [
          'New Customer',
          'Recurring Customer',
        ],
        datasets: [
          {
            data: [],
            backgroundColor: [
              '#6f42c1',
              '#e83e8c',
            ],
            hoverBackgroundColor: [
              '#6f42c1',
              '#e83e8c',
            ],
            newcustomerlast7days: 0,
            recurringcustomerlast7days: 0,
            totalcustomers: 0,
          }
        ],
      },
      topsellingitems: [],
      dateArray: [],
      review: [],
      catererName: "",
      profilesrc: "",
      coversrc: "",
      catererAddress: "",
      rating: null,
      numofreview: null,
    };
  }

  componentDidMount() {
    var currentDate = new Date();
    var previousDate = subDays(currentDate, 7);

    var currentDateString = moment(currentDate).format("DD MMM, YYYY")
    var previousDateString = moment(previousDate).format("DD MMM, YYYY")
    var finalSelectionDate = previousDateString + ' - ' + currentDateString
    var finalDateArray = this.getIntervalDates(currentDate, previousDate).reverse();
   
    var newline = this.state.orderline
    newline.labels = finalDateArray;

    var newbar = this.state.salesbar
    newbar.labels = finalDateArray;

    this.setState({
      currentDate: currentDate,
      previousDate: previousDate,
      orderline: newline,
      salesbar: newbar,
      dateArray: finalDateArray,
    });

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererName: typeof response.data[0].catererName !== 'undefined' ? response.data[0].catererName : "",
            profilesrc: typeof response.data[0].profilesrc !== 'undefined' ? response.data[0].profilesrc : "https://s3-eu-west-1.amazonaws.com/foodiebeegeneralphoto/user_default.png",
            coversrc: typeof response.data[0].coversrc !== 'undefined' ? response.data[0].coversrc : "https://stmed.net/sites/default/files/food-wallpapers-28249-101905.jpg",
            catererAddress: typeof response.data[0].catererAddress !== 'undefined' ? response.data[0].catererAddress : "",
            rating: typeof response.data[0].rating !== 'undefined' ? response.data[0].rating : 0,
            numofreview: typeof response.data[0].numofreview !== 'undefined' ? response.data[0].numofreview : 0,
          }, () => {
          //  this.putInitialData(this.state.catererName)
            this.getOrderSales(currentDateString, previousDateString)
            this.getCustomer(currentDateString, previousDateString)
            this.getMenuItems()
            this.getReview(currentDateString, previousDateString)
          })
        } 
      })
      .catch((error) => {
      });
  }

  putInitialData = (catererName) => {
    if (catererName === 'Asian Wok') {
      var newline = this.state.orderline
      var linedata = [1, 15, 2, 4, 5, 10, 7, 2]
      newline.datasets[0].data = linedata
      newline.datasets[0].orderlast7days = 150
      newline.datasets[0].orderalltime = 400

      var newbar = this.state.salesbar
      var bardata = [15.00, 29.99, 45.50, 55.00, 57.45, 10.99, 7.99, 2.50]
      newbar.datasets[0].data = bardata
      newbar.datasets[0].saleslast7days = 15000
      newbar.datasets[0].salesalltime = 2578521
  
      var newpie = this.state.customerpie
      var piedata = [20, 44]
      newpie.datasets[0].data = piedata
      newpie.datasets[0].newcustomerlast7days = 150
      newpie.datasets[0].recurringcustomerlast7days = 200
      newpie.datasets[0].totalcustomers = 350
  
      var topsellingitems = [
        {
          title: 'Sandwich Combo',
          soldamount: 108,
        },
        {
          title: 'Bagel Tray',
          soldamount: 87,
        },
        {
          title: 'Traditional Irish Breakfast',
          soldamount: 76,
        },
        {
          title: 'Chicken Parmigiano',
          soldamount: 65,
        },
        {
          title: 'Lasagna',
          soldamount: 54,
        },
        {
          title: 'Meatball & Cheese Sub',
          soldamount: 27,
        },
      ]
      var review = [
        {
          customerFirstName: "Kieran",
          customerCity: 'Limerick, Ireland',
          customerComment: "Everyone was very happy. Hearty sandwiches. Very nice dessert sandwiches",
          createdAt: "5 days ago",
          customerRating: 5,
        },
        {
          customerFirstName: "Qiana",
          customerCity: 'Dublin, Ireland',
          customerComment: "The food smelled pretty good and staff seemed excited because they eat there on their own time. The only downside is they delivered 45 mins. early, which is better than being late. I guess it didn't matter much since we did sandwiches and not something that would be bad if it got cold (i.e., pasta or other hot entree).",
          createdAt: "7 days ago",
          customerRating: 4,
        },
        {
          customerFirstName: "Aldo",
          customerCity: 'Limerick, Ireland',
          customerComment: "Food is on time, great experience, food is delicious",
          createdAt: "8 days ago",
          customerRating: 5,
        },
        {
          customerFirstName: "Connie",
          customerCity: 'Limerick, Ireland',
          customerComment: "The food was delicious and the presentation looked great. Perfect portions. We will order again!",
          createdAt: "15 days ago",
          customerRating: 4,
        },
        {
          customerFirstName: "Chandra",
          customerCity: 'Limerick, Ireland',
          customerComment: "First time ordering from Italian Gourmet for this group. Everything was a big hit--even though they were a bit early.",
          createdAt: "1 month ago",
          customerRating: 5,
        },
      ]

      var rating = 4.7
      var numofreview = 150
  
      this.setState({
        orderline: newline,
        salesbar: newbar,
        customerpie: newpie,
        topsellingitems,
        review,
        rating,
        numofreview
      });
    }
  }

  getOrderSales = (currentDateString, previousDateString) => {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var orderqueryurl = apis.GETorder + "?lteDate=" + currentDateString + "&gteDate=" + previousDateString;
    var salesqueryurl = apis.GETorder + "?paymentStatus=succeeded" + "&lteDate=" + currentDateString + "&gteDate=" + previousDateString;
    var orderallqueryrurl = apis.GETorder;
    var salesallqueryrurl = apis.GETorder + "?paymentStatus=succeeded";

    var axiosarray = [
      axios.get(orderqueryurl, {withCredentials: true}, {headers: headers}),
      axios.get(salesqueryurl, {withCredentials: true}, {headers: headers}),
      axios.get(orderallqueryrurl, {withCredentials: true}, {headers: headers}),
      axios.get(salesallqueryrurl, {withCredentials: true}, {headers: headers})
    ]
    axios.all(axiosarray)
    .then(axios.spread((order_query_response, sales_query_response, order_allquery_response, sales_allquery_response) => {
      if (order_query_response.status === 200 && sales_query_response.status === 200 && order_allquery_response.status === 200 && sales_allquery_response.status === 200) {
        this.getOrderChartData(order_query_response.data, order_allquery_response.data.length)      
        this.getSalesChartData(sales_query_response.data, sales_allquery_response.data)    
      } 
    }))
    .catch((error) => {
    });
  }

  getMenuItems = () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETmenu + "?dashboard=true";

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            topsellingitems: response.data
          })
        } 
      })
      .catch((error) => {
      });
  }
  
  getCustomer = (currentDateString, previousDateString) => {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var queryurl = apis.GETorder_customer + "?lteDate=" + currentDateString + "&gteDate=" + previousDateString;
    var allqueryrurl = apis.GETorder_customer;

    var axiosarray = [
      axios.get(queryurl, {withCredentials: true}, {headers: headers}),
      axios.get(allqueryrurl, {withCredentials: true}, {headers: headers})
    ]
    axios.all(axiosarray)
    .then(axios.spread((query_response, allquery_response) => {
      if (query_response.status === 200 && allquery_response.status === 200) {
        
        this.getCustomersChartData(query_response.data, allquery_response.data.length)         
      } 
    }))
    .catch((error) => {
    });
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
            review: response.data,
          })
        } 
      })
      .catch((error) => {
        this.setState({
          empty: true 
        })
      });
  }

  getOrderChartData = (orderdata, allordercount) => {
    var linedata = [];
    var dateArray = this.state.dateArray

    for (let i = 0; i < dateArray.length; i++) {
      var count = 0
      for (let x = 0; x < orderdata.length; x++) {
        if (moment(orderdata[x].createdAt).format("DD MMM, YYYY") === dateArray[i]) {
          count = count + 1
        }
      }
      linedata.push(count)
    }

    var newline = this.state.orderline;
    newline.datasets[0].data = linedata;
    newline.datasets[0].orderlast7days = orderdata.length
    newline.datasets[0].orderalltime = allordercount

    this.setState({
      orderline: newline,
    })
  }

  getSalesChartData = (orderdata, allorderdata) => {
    var bardata = [];
    var dateArray = this.state.dateArray

    var last7sales = 0;
    var allsales = 0;

    for (let x = 0; x < allorderdata.length; x++) {
      allsales = allsales + allorderdata[x].totalOrderPrice
    }

    for (let i = 0; i < dateArray.length; i++) {
      var sales = 0
      for (let x = 0; x < orderdata.length; x++) {
        if (moment(orderdata[x].createdAt).format("DD MMM, YYYY") === dateArray[i]) {
          sales = sales + orderdata[x].totalOrderPrice
        }
      }
      bardata.push(sales)
      last7sales = last7sales + sales
    }

    var newbar = this.state.salesbar;
    newbar.datasets[0].data = bardata;
    newbar.datasets[0].saleslast7days = Number(last7sales).toFixed(2)
    newbar.datasets[0].salesalltime = Number(allsales).toFixed(2)

    this.setState({
      salesbar: newbar,
    })
  }

  getCustomersChartData = (customerdata, allcustomerscount) => {
    var newcustomer_val = 0;
    var recurringcustomer_val = 0;

    for (let x = 0; x < customerdata.length; x++) {
      if (customerdata[x].customerDetails[0].status === "new") {
        newcustomer_val = newcustomer_val + 1
      }
      else if (customerdata[x].customerDetails[0].status === "recurring") {
        recurringcustomer_val = recurringcustomer_val + 1
      }
    }

    var newpie = this.state.customerpie
    var piedata = []
    if (newcustomer_val === 0 && recurringcustomer_val === 0 ) {
      piedata = []
    }
    else {
      piedata = [newcustomer_val, recurringcustomer_val]
    }
    newpie.datasets[0].data = piedata
    newpie.datasets[0].newcustomerlast7days = newcustomer_val
    newpie.datasets[0].recurringcustomerlast7days = recurringcustomer_val
    newpie.datasets[0].totalcustomers = allcustomerscount

    this.setState({
      customerpie: newpie,
    })
  }

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

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  toggle(which) {
    this.setState({ [which]: !this.state[which] });
  }

  goToPage(path) {
    this.props.history.push(path)
  }

  renderLineChart() {
    return <Line height='300' data={this.state.orderline} options={options} />;
  }

  renderBarChart() {
    return <Bar height='300' data={this.state.salesbar} options={options} />;
  }

  renderPieChart() {
    return <Pie data={this.state.customerpie} />
  }

  renderMenuBarChart(topsellingitems) {

    var itemarray = [];
    var barColor;

    for(let i = 0; i < topsellingitems.length; i++){
      if (topsellingitems[i].soldamount > 70) {
        barColor = "success"
      }
      else if (topsellingitems[i].soldamount <= 70 && topsellingitems[i].soldamount > 30) {
        barColor = "warning"
      }
      else if (topsellingitems[i].soldamount <= 30 && topsellingitems[i].soldamount > 0) {
        barColor = "danger"
      }
      itemarray.push(
        <div className="progress-group mb-4">
          <div className="progress-group-header">
            <span className="progress-group-text">
              {topsellingitems[i].title}
            </span>
            <span className="ml-auto font-weight-bold">{topsellingitems[i].soldamount}</span>
          </div>
          <div className="progress-group-bars">
            <Progress className="progress-xs" color={barColor} value={topsellingitems[i].soldamount} />
          </div>
        </div>
      )
    } 

    return(
      <div>
        {itemarray.length > 0 ? itemarray : this.renderEmptySellingItems()}
      </div>
    )
  }

  renderChartTitle(title, last7dayscount, alltimecount) {
    var stateToChange;
    var pathToPage;
    if (title == 'Orders') {
      stateToChange = this.state.orderEdit
      pathToPage = '/caterer/reports/order'
    }
    else if (title == 'Sales') {
      stateToChange = this.state.salesEdit
      pathToPage = '/caterer/reports/sales'
    }
    return(
      <CardHeader style={{backgroundColor: 'white'}}>
        <Label style={ { marginLeft: 10, marginBottom: 10 }} className="h6">{title}</Label>
        { stateToChange ?
          <a
            style={{marginLeft: 10, cursor: 'pointer', opacity: 0.6}} 
            className="card-header-action float-right"
            onClick={() => this.goToPage(pathToPage)}
          >
            <i className="fa fa-external-link" />
          </a> : null}
        <div>
          <Label style={ { marginLeft: 10 }} className="h4">{last7dayscount}</Label>
          <Label style={ { marginLeft: 10 , opacity: 0.6}}>Last 7 days</Label>
          <Label style={ { marginLeft: 30 }} className="h4">{alltimecount}</Label>
          <Label style={ { marginLeft: 10 , opacity: 0.6}}>All time</Label>
        </div>
      </CardHeader>
    )
  }

  renderPieChartTitle(title, newcustomer, recurring_customer, totalcustomers) {
    return(
      <CardHeader style={{backgroundColor: 'white'}}>
        <Label style={ { marginLeft: 10, marginBottom: 10 }} className="h6">{title}</Label>
        { this.state.customerEdit ?
          <a
            style={{marginLeft: 10, cursor: 'pointer', opacity: 0.6}} 
            className="card-header-action float-right"
            onClick={() => this.goToPage('/caterer/reports/customer')}
          >
            <i className="fa fa-external-link" />
          </a> : null}
        <div>
          <Label style={ { marginLeft: 10 }} className="h4">{newcustomer}</Label>
          <Label style={ { marginLeft: 10 , opacity: 0.6}}>New Customer</Label>
          <Label style={ { marginLeft: 30 }} className="h4">{recurring_customer}</Label>
          <Label style={ { marginLeft: 10 , opacity: 0.6}}>Recurring Customer</Label>
          <Label style={ { marginLeft: 30 }} className="h4">{totalcustomers}</Label>
          <Label style={ { marginLeft: 10 , opacity: 0.6}}>Total Customer</Label>
        </div>
      </CardHeader>
    )
  }

  renderReviewTitle(title, overallrating, totalreview) {
    return(
      <CardHeader style={{backgroundColor: 'white'}}>
        <Label style={ { marginLeft: 10, marginBottom: 10 }} className="h6">{title}</Label>
        { this.state.reviewEdit ?
          <a
            style={{marginLeft: 10, cursor: 'pointer', opacity: 0.6}} 
            className="card-header-action float-right"
            onClick={() => this.goToPage('/caterer/reports/review')}
          >
            <i className="fa fa-external-link" />
          </a> : null}

          {this.state.numofreview === 0 ? 
            <div>
              <Label className="h5" style={{ marginLeft: 10, opacity: 0.6 }}>
                No Ratings Yet
              </Label> 
            </div>
            :
            <div>
              <Label style={ { marginLeft: 10, color: 'orange' }} className="h4">{overallrating}</Label>
              <Label style={ { marginLeft: 10 , opacity: 0.6}}>Overall Rating</Label>
              <Label style={ { marginLeft: 30 }} className="h4">{totalreview}</Label>
              <Label style={ { marginLeft: 10 , opacity: 0.6}}>Total Reviews</Label>
            </div>
          }

      </CardHeader>
    )
  }

  renderTableItems() {
    var itemarray = [];

    var tableitems = this.state.review;

    for (let i = 0; i < tableitems.length; i++) {
      itemarray.push(
        <tr>
          <td style={{width: '10%'}}>{tableitems[i].customerFirstName}</td>
          <td style={{width: '15%'}}>{tableitems[i].customerCity}</td>
          <td style={{width: '15%'}}>
            <StarRatingComponent
              name="rating"
              emptyStarColor="#D3D3D3"
              starCount={5}
              editing={false}
              value={tableitems[i].customerRating}
            />
          </td>
          <td style={{width: '45%'}}>{tableitems[i].customerComment}</td>
          <td style={{width: '15%'}}>{moment(tableitems[i].createdAt).format("DD MMM, YYYY")}</td>
        </tr>
      );
    }

    return <tbody>{itemarray}</tbody>;
  }

  renderReviewTable() {
    return (
      <div>
       <Table responsive className="mb-0 d-none d-sm-table">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Time</th>
          </tr>
        </thead>
        {this.state.review.length > 0 ? this.renderTableItems() : null}
      </Table>
      {this.state.review.length > 0 ? null : this.renderEmptyReview()}
      </div>
    );
  }

  renderEmptySellingItems() {
    return (
      <Row style={{ marginTop: 75, paddingBottom: 60 }}>
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
            You have 0 menu items now.
          </p>
        </Col>
        <Col style={{ textAlign: "center", marginTop: 10 }} xs="12">
          <Button
            color="primary"
            className="float-center"
            onClick={() => this.goToPage('/caterer/ordersmenu/menusetup')}
          >
            Add Item
          </Button>
        </Col>
      </Row>
    );
  }

  renderEmptyCustomer() {
    return (
      <Row style={{ marginTop: 75, paddingBottom: 75 }}>
        <Col style={{ textAlign: "center" }} xs="12">
          <img
            style={{
              objectFit: "cover",
              width: 70,
              height: 70,
              opacity: 0.9
            }}
            alt={""}
            src={
              "https://s3-eu-west-1.amazonaws.com/foodiebeegeneralphoto/empty_customer.png"
            }
          />
        </Col>
        <Col style={{ textAlign: "center" }} xs="12">
          <p
            style={{ fontSize: 18, letterSpacing: 2, marginTop: 20 }}
            className="big"
          >
            You have no customers yet.
          </p>
        </Col>
      </Row>
    );
  }

  renderEmptyReview() {
    return (
      <Row style={{ marginTop: 75, paddingBottom: 75 }}>
        <Col style={{ textAlign: "center" }} xs="12">
          <img
            style={{
              objectFit: "cover",
              width: 70,
              height: 70,
              opacity: 0.9
            }}
            alt={""}
            src={
              "https://s3-eu-west-1.amazonaws.com/foodiebeegeneralphoto/empty_review.png"
            }
          />
        </Col>
        <Col style={{ textAlign: "center" }} xs="12">
          <p
            style={{ fontSize: 18, letterSpacing: 2, marginTop: 20 }}
            className="big"
          >
            You have no reviews yet.
          </p>
        </Col>
      </Row>
    );
  }

  render() {

    return (
      <div className="animated fadeIn">

        <img style={ { objectFit:'cover', width: '100%', height: 300 }} src={this.state.coversrc}  />

        <div className="container">
          <Col xs="0" sm="1" md="3" lg="3" />

          <Col xs="12" sm="10" md="6" lg="6">

            <Card onMouseEnter={() => this.toggle('profileEdit')} onMouseLeave={() => this.toggle('profileEdit')} style={{ textAlign: "center", marginTop: -250 }} >
              <CardBody>
              
                <div style={{width: 80, height: 80, position: 'relative', margin: 'auto', overflow: 'hidden', borderRadius: '50%'}}>
                  <img style={{ objectFit:'cover', width: 'auto', height: '100%', display: 'inline' }} src={this.state.profilesrc}/>
                </div>
              
                <Label style={{ marginTop:10, marginLeft: 10 }} className="h4">{this.state.catererName}</Label>
                {this.state.profileEdit ?
                <a
                  style={{position: 'absolute', right: 20, top:20, cursor: 'pointer', opacity: 0.6}} 
                  className="card-header-action float-right"
                  onClick={() => this.goToPage('/caterer/basics/nameaddress')}
                >
                  <i className="fa fa-external-link" />
                </a> : null}
                <Row className="justify-content-center">
                  <StarRatingComponent
                    name="rate1"
                    emptyStarColor="#D3D3D3"
                    starCount={5}
                    editing={false}
                    value={this.state.rating}
                  />
                  {this.state.rating === 0 ? null : <b style={{ marginLeft: 5, color: "darkorange" }}>4.7</b> }
                  {this.state.numofreview === 0 ? 
                    <Label style={{ fontWeight: '500', marginLeft: 5, color: "darkorange" }}>
                      No Ratings Yet
                    </Label> 
                    :
                    <Label style={{ fontWeight: '500', marginLeft: 5, color: "darkorange" }}>
                      ({this.state.numofreview}) Reviews
                    </Label> 
                  }
                </Row>

                <Label style={{ marginTop: 10 }} className="h6">
                  {this.state.catererAddress}
                </Label>

              </CardBody>
            </Card>
          </Col>
          <Col xs="0" sm="1" md="3" lg="3" />
        </div>

        <Row style= {{marginTop: 25}} className="justify-content-center">
          <Col xs="12" md="6">
            <Card onMouseEnter={() => this.toggle('orderEdit')} onMouseLeave={() => this.toggle('orderEdit')}>
              {this.renderChartTitle('Orders', this.numberWithCommas(this.state.orderline.datasets[0].orderlast7days), this.numberWithCommas(this.state.orderline.datasets[0].orderalltime))}
              <CardBody>
                {this.renderLineChart()}
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" md="6">
            <Card onMouseEnter={() => this.toggle('salesEdit')} onMouseLeave={() => this.toggle('salesEdit')}>
              {this.renderChartTitle('Sales', '€' + this.numberWithCommas(this.state.salesbar.datasets[0].saleslast7days), '€' + this.numberWithCommas(this.state.salesbar.datasets[0].salesalltime))}
              <CardBody>
                {this.renderBarChart()}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row style= {{marginTop: 0}} className="justify-content-center">
          <Col xs="12" md="6">
            <Card onMouseEnter={() => this.toggle('menuitemEdit')} onMouseLeave={() => this.toggle('menuitemEdit')}>
              <CardHeader style={{backgroundColor: 'white'}}>
                <Label style={ { marginTop:10, marginLeft: 10}} className="h6">Top Selling Items</Label>
                { this.state.menuitemEdit ?
                  <a
                    style={{marginLeft: 10, cursor: 'pointer', opacity: 0.6}} 
                    className="card-header-action float-right"
                    onClick={() => this.goToPage('/caterer/reports/dishes')}
                  >
                    <i className="fa fa-external-link" />
                  </a> : null}
              </CardHeader>
              <CardBody>
                {this.renderMenuBarChart(this.state.topsellingitems)}
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" md="6">
            <Card onMouseEnter={() => this.toggle('customerEdit')} onMouseLeave={() => this.toggle('customerEdit')}>
              {this.renderPieChartTitle('Customer', this.state.customerpie.datasets[0].newcustomerlast7days, this.state.customerpie.datasets[0].recurringcustomerlast7days, this.state.customerpie.datasets[0].totalcustomers)}
              <CardBody>
                {this.state.customerpie.datasets[0].data.length > 0 ? this.renderPieChart() : this.renderEmptyCustomer()}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row style= {{marginTop: 0}} className="justify-content-center">
          <Col xs="12" >
            <Card onMouseEnter={() => this.toggle('reviewEdit')} onMouseLeave={() => this.toggle('reviewEdit')}>
              {this.renderReviewTitle('Reviews', this.state.rating, this.state.numofreview)}
              <CardBody>
                {this.renderReviewTable()}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
