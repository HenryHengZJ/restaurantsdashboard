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
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import TimeField from 'react-simple-timefield';
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class OpeningHours extends Component {

  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);
    this.onMondayStartingTimeChange = this.onMondayStartingTimeChange.bind(this);
    this.onTuesdayStartingTimeChange = this.onTuesdayStartingTimeChange.bind(this);
    this.onWednesdayStartingTimeChange = this.onWednesdayStartingTimeChange.bind(this);
    this.onThursdayStartingTimeChange = this.onThursdayStartingTimeChange.bind(this);
    this.onFridayStartingTimeChange = this.onFridayStartingTimeChange.bind(this);
    this.onSaturdayStartingTimeChange = this.onSaturdayStartingTimeChange.bind(this);
    this.onSundayStartingTimeChange = this.onSundayStartingTimeChange.bind(this);

    this.onMondayClosingTimeChange = this.onMondayClosingTimeChange.bind(this);
    this.onTuesdayClosingTimeChange = this.onTuesdayClosingTimeChange.bind(this);
    this.onWednesdayClosingTimeChange = this.onWednesdayClosingTimeChange.bind(this);
    this.onThursdayClosingTimeChange = this.onThursdayClosingTimeChange.bind(this);
    this.onFridayClosingTimeChange = this.onFridayClosingTimeChange.bind(this);
    this.onSaturdayClosingTimeChange = this.onSaturdayClosingTimeChange.bind(this);
    this.onSundayClosingTimeChange = this.onSundayClosingTimeChange.bind(this);

    this.state = {
      _id: "",
      mondaystartingtime: '',
      mondayclosingtime: '',
      tuesdaystartingtime: '',
      tuesdayclosingtime: '',
      wednesdaystartingtime: '',
      wednesdayclosingtime: '',
      thursdaystartingtime: '',
      thursdayclosingtime: '',
      fridaystartingtime: '',
      fridayclosingtime: '',
      saturdaystartingtime: '',
      saturdayclosingtime: '',
      sundaystartingtime: '',
      sundayclosingtime: '',
      isProceedButtonVisible: false,
      isSaving: false,
    };
  }

  componentDidMount() {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {

          if (response.data[0].openinghours.length > 0) {
            var openinghours = response.data[0].openinghours
            for (let i = 0; i < openinghours.length; i++) {
              if (openinghours[i].day === 'Monday') {
                this.setState({
                  mondaystartingtime: this.reformatInput(openinghours[i].starttime.toString()),
                  mondayclosingtime:  this.reformatInput(openinghours[i].closetime.toString())
                })
              }
              else if (openinghours[i].day === 'Tuesday') {
                this.setState({
                  tuesdaystartingtime: this.reformatInput(openinghours[i].starttime.toString()),
                  tuesdayclosingtime:  this.reformatInput(openinghours[i].closetime.toString())
                })
              }
              else if (openinghours[i].day === 'Wednesday') {
                this.setState({
                  wednesdaystartingtime: this.reformatInput(openinghours[i].starttime.toString()),
                  wednesdayclosingtime:  this.reformatInput(openinghours[i].closetime.toString())
                })
              }
              else if (openinghours[i].day === 'Thursday') {
                this.setState({
                  thursdaystartingtime: this.reformatInput(openinghours[i].starttime.toString()),
                  thursdayclosingtime:  this.reformatInput(openinghours[i].closetime.toString())
                })
              }
              else if (openinghours[i].day === 'Friday') {
                this.setState({
                  fridaystartingtime: this.reformatInput(openinghours[i].starttime.toString()),
                  fridayclosingtime:  this.reformatInput(openinghours[i].closetime.toString())
                })
              }
              else if (openinghours[i].day === 'Saturday') {
                this.setState({
                  saturdaystartingtime: this.reformatInput(openinghours[i].starttime.toString()),
                  saturdayclosingtime: this.reformatInput(openinghours[i].closetime.toString())
                })
              }
              else if (openinghours[i].day === 'Sunday') {
                this.setState({
                  sundaystartingtime: this.reformatInput(openinghours[i].starttime.toString()),
                  sundayclosingtime:  this.reformatInput(openinghours[i].closetime.toString())
                })
              }
            }
          }
          else {
            this.setState({
              mondaystartingtime: '08:00',
              mondayclosingtime: '22:00',
              tuesdaystartingtime: '08:00',
              tuesdayclosingtime: '22:00',
              wednesdaystartingtime: '08:00',
              wednesdayclosingtime: '22:00',
              thursdaystartingtime: '08:00',
              thursdayclosingtime: '22:00',
              fridaystartingtime: '08:00',
              fridayclosingtime: '22:00',
              saturdaystartingtime: '08:00',
              saturdayclosingtime: '22:00',
              sundaystartingtime: '08:00',
              sundayclosingtime: '22:00',
            })
          }
        } 
      })
      .catch((error) => {
      });
  }

  reformatInput = (time) => {
    if (time.length > 3 ) {
      time = time.slice(0, 2) + ":" + time.slice(2, 4)
      
    }
    else {
      time = "0" + time.slice(0, 1) + ":" + time.slice(1, 3)
    }
    return time
  }

  handleProceed = () => {
    this.props.history.push('/caterer/services/orderlater')
  }

  
  handleNext() {
    this.setState({
      isSaving: true,
    })

    const {_id, mondaystartingtime, mondayclosingtime, tuesdaystartingtime, tuesdayclosingtime, wednesdaystartingtime, wednesdayclosingtime,
      thursdaystartingtime, thursdayclosingtime, fridaystartingtime, fridayclosingtime, saturdaystartingtime, saturdayclosingtime, sundaystartingtime, sundayclosingtime} = this.state

    var data = {
      openinghours:  [
        {
          day: "Monday",
          starttime: this.state.mondaystartingtime.includes(":") ? Number(this.state.mondaystartingtime.replace(":", "")) : this.state.mondaystartingtime,
          closetime: this.state.mondayclosingtime.includes(":") ? Number(this.state.mondayclosingtime.replace(":", "")) : this.state.mondayclosingtime,
        },
        {
          day: "Tuesday",
          starttime: this.state.tuesdaystartingtime.includes(":") ? Number(this.state.tuesdaystartingtime.replace(":", "")) : this.state.tuesdaystartingtime,
          closetime: this.state.tuesdayclosingtime.includes(":") ? Number(this.state.tuesdayclosingtime.replace(":", "")) : this.state.tuesdayclosingtime,
        },
        {
          day: "Wednesday",
          starttime: this.state.wednesdaystartingtime.includes(":") ? Number(this.state.wednesdaystartingtime.replace(":", "")) : this.state.wednesdaystartingtime,
          closetime: this.state.wednesdayclosingtime.includes(":") ? Number(this.state.wednesdayclosingtime.replace(":", "")) : this.state.wednesdayclosingtime,
        },
        {
          day: "Thursday",
          starttime: this.state.thursdaystartingtime.includes(":") ? Number(this.state.thursdaystartingtime.replace(":", "")) : this.state.thursdaystartingtime,
          closetime: this.state.thursdayclosingtime.includes(":") ? Number(this.state.thursdayclosingtime.replace(":", "")) : this.state.thursdayclosingtime,
        },
        {
          day: "Friday",
          starttime: this.state.fridaystartingtime.includes(":") ? Number(this.state.fridaystartingtime.replace(":", "")) : this.state.fridaystartingtime,
          closetime: this.state.fridayclosingtime.includes(":") ? Number(this.state.fridayclosingtime.replace(":", "")) : this.state.fridayclosingtime,
        },
        {
          day: "Saturday",
          starttime: this.state.saturdaystartingtime.includes(":") ? Number(this.state.saturdaystartingtime.replace(":", "")) : this.state.saturdaystartingtime,
          closetime: this.state.saturdayclosingtime.includes(":") ? Number(this.state.saturdayclosingtime.replace(":", "")) : this.state.saturdayclosingtime,
        },
        {
          day: "Sunday",
          starttime: this.state.sundaystartingtime.includes(":") ? Number(this.state.sundaystartingtime.replace(":", "")) : this.state.sundaystartingtime,
          closetime: this.state.sundayclosingtime.includes(":") ? Number(this.state.sundayclosingtime.replace(":", "")) : this.state.sundayclosingtime,
        },
      ]
    }

    var headers = {
      'Content-Type': 'application/json',
      //'Authorization': jwtToken,
    }

    var url = apis.UPDATEcaterer;

    axios.put(url, data, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            isProceedButtonVisible: true,
            isSaving: false,
          })
        }
      })
      .catch((error) => {
        //alert("error updating! " + error)
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          isSaving: false,
        })
      });
  }

  onMondayStartingTimeChange(mondaystartingtime) {
    this.setState({mondaystartingtime});
  }

  onTuesdayStartingTimeChange(tuesdaystartingtime) {
    this.setState({tuesdaystartingtime});
  }

  onWednesdayStartingTimeChange(wednesdaystartingtime) {
    this.setState({wednesdaystartingtime});
  }

  onThursdayStartingTimeChange(thursdaystartingtime) {
    this.setState({thursdaystartingtime});
  }

  onFridayStartingTimeChange(fridaystartingtime) {
    this.setState({fridaystartingtime});
  }

  onSaturdayStartingTimeChange(saturdaystartingtime) {
    this.setState({saturdaystartingtime});
  }

  onSundayStartingTimeChange(sundaystartingtime) {
    this.setState({sundaystartingtime});
  }


  onMondayClosingTimeChange(mondayclosingtime) {
    this.setState({mondayclosingtime});
  }

  onTuesdayClosingTimeChange(tuesdayclosingtime) {
    this.setState({tuesdayclosingtime});
  }

  onWednesdayClosingTimeChange(wednesdayclosingtime) {
    this.setState({wednesdayclosingtime});
  }

  onThursdayClosingTimeChange(thursdayclosingtime) {
    this.setState({thursdayclosingtime});
  }

  onFridayClosingTimeChange(fridayclosingtime) {
    this.setState({fridayclosingtime});
  }

  onSaturdayClosingTimeChange(saturdayclosingtime) {
    this.setState({saturdayclosingtime});
  }

  onSundayClosingTimeChange(sundayclosingtime) {
    this.setState({sundayclosingtime});
  }


  render() {

    const {mondaystartingtime, mondayclosingtime, tuesdaystartingtime, tuesdayclosingtime, wednesdaystartingtime, wednesdayclosingtime,
       thursdaystartingtime, thursdayclosingtime, fridaystartingtime, fridayclosingtime, saturdaystartingtime, saturdayclosingtime, sundaystartingtime, sundayclosingtime} = this.state
    
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Opening Hours</strong>
              </CardHeader>
              <CardBody>

                <Label htmlFor="OpeningHours">Please select times for your restaurant opening hours</Label>
                
                <table className="w-100" style={{marginTop: 20}}>
                  <thead>
                    <tr>
                      <td>
                        <Label className="h6" style={{color: "black", justifyContent: 'center'}}>Day</Label>
                      </td>
                      <td>
                        <Label className="h6" style={{marginLeft: 10, color: "black", justifyContent: 'center'}}>Time</Label>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Label style={{justifyContent: 'center'}}>Monday</Label>
                      </td>
                      <td>
                        <Row style={{margin: 10}}>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={mondaystartingtime} onChange={this.onMondayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={mondayclosingtime} onChange={this.onMondayClosingTimeChange} />
                        </Row>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <Label style={{justifyContent: 'center'}}>Tuesday</Label>
                      </td>
                      <td>
                        <Row style={{margin: 10}}>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={tuesdaystartingtime} onChange={this.onTuesdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={tuesdayclosingtime} onChange={this.onTuesdayClosingTimeChange} />
                        </Row>
                      </td>
                    </tr>

                     <tr>
                      <td>
                        <Label style={{justifyContent: 'center'}}>Wednesday</Label>
                      </td>
                      <td>
                        <Row style={{margin: 10}}>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={wednesdaystartingtime} onChange={this.onWednesdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={wednesdayclosingtime} onChange={this.onWednesdayClosingTimeChange} />
                        </Row>
                      </td>
                    </tr>

                     <tr>
                      <td>
                        <Label style={{justifyContent: 'center'}}>Thursday</Label>
                      </td>
                      <td>
                        <Row style={{margin: 10}}>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={thursdaystartingtime} onChange={this.onThursdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={thursdayclosingtime} onChange={this.onThursdayClosingTimeChange} />
                        </Row>
                      </td>
                    </tr>

                     <tr>
                      <td>
                        <Label style={{justifyContent: 'center'}}>Friday</Label>
                      </td>
                      <td>
                        <Row style={{margin: 10}}>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={fridaystartingtime} onChange={this.onFridayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={fridayclosingtime} onChange={this.onFridayClosingTimeChange} />
                        </Row>
                      </td>
                    </tr>

                     <tr>
                      <td>
                        <Label style={{justifyContent: 'center'}}>Saturday</Label>
                      </td>
                      <td>
                        <Row style={{margin: 10}}>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={saturdaystartingtime} onChange={this.onSaturdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={saturdayclosingtime} onChange={this.onSaturdayClosingTimeChange} />
                        </Row>
                      </td>
                    </tr>

                     <tr>
                      <td>
                        <Label style={{justifyContent: 'center'}}>Sunday</Label>
                      </td>
                      <td>
                        <Row style={{margin: 10}}>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={sundaystartingtime} onChange={this.onSundayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={sundayclosingtime} onChange={this.onSundayClosingTimeChange} />
                        </Row>
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
                
                <div className="form-actions">
                  {this.state.isProceedButtonVisible ? 
                    <Button style={{marginTop: 20, marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button style={{marginTop: 20}} onClick={this.handleNext} className="float-right" type="submit" color="primary">{this.state.isSaving ? "Saving..." : "Save" }</Button>
                </div>
               
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer hideProgressBar/>
      </div>
    );
  }
}

const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Saved</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error saving data. Please try again</b>
   
  </div>
)

export default OpeningHours;
