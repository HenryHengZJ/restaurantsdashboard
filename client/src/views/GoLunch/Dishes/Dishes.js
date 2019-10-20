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

class Dishes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fetchedmenu: [],
      menu: [],
    };
  }

  componentDidMount() {
    this.getCatererLunchMenu()
  }

  getCatererLunchMenu= () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETlunchmenu;

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
      r[a.category] = r[a.category] || [];
      r[a.category].push(a);
      return r;
    }, Object.create(null));

    for (var key in result) {
     
      var object = {
        category: key,
        menuitem: result[key]
      };

      finalresult.push(object);
    }

    this.setState({
      menu: finalresult,
      loading: false,
    })
  };

  renderMenuItems() {
    
    var menu = this.state.menu

    var itemarray = [];

    for(let i = 0; i < menu.length; i++){

      itemarray.push(
        <div >
          <div >
            <p style={{fontWeight: '600', color: "black", fontSize: 17, paddingTop: i === 0 ? 0 : 20}}>
              {menu[i].category.toUpperCase()}
            </p>
          </div>
          {this.renderMenuBarChart(menu[i].menuitem)}
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
