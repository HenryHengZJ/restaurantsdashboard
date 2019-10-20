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

class DeliveryHours extends Component {

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
      mondaychecked: null,
      tuesdaystartingtime: '',
      tuesdayclosingtime: '',
      tuesdaychecked: null,
      wednesdaystartingtime: '',
      wednesdayclosingtime: '',
      wednesdaychecked: null,
      thursdaystartingtime: '',
      thursdayclosingtime: '',
      thursdaychecked: null,
      fridaystartingtime: '',
      fridayclosingtime: '',
      fridaychecked: null,
      saturdaystartingtime: '',
      saturdayclosingtime: '',
      saturdaychecked: null,
      sundaystartingtime: '',
      sundayclosingtime: '',
      sundaychecked: null,
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

          if (response.data[0].deliveryhours.length > 0) {
            var deliveryhours = response.data[0].deliveryhours
            for (let i = 0; i < deliveryhours.length; i++) {
              if (deliveryhours[i].day === 'Monday') {
                this.setState({
                  mondaystartingtime: this.reformatInput(deliveryhours[i].starttime.toString()),
                  mondayclosingtime:  this.reformatInput(deliveryhours[i].closetime.toString()),
                  mondaychecked: deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? false : true
                })
              }
              else if (deliveryhours[i].day === 'Tuesday') {
                this.setState({
                  tuesdaystartingtime: this.reformatInput(deliveryhours[i].starttime.toString()),
                  tuesdayclosingtime:  this.reformatInput(deliveryhours[i].closetime.toString()),
                  tuesdaychecked: deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? false : true
                })
              }
              else if (deliveryhours[i].day === 'Wednesday') {
                this.setState({
                  wednesdaystartingtime: this.reformatInput(deliveryhours[i].starttime.toString()),
                  wednesdayclosingtime:  this.reformatInput(deliveryhours[i].closetime.toString()),
                  wednesdaychecked: deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? false : true
                })
              }
              else if (deliveryhours[i].day === 'Thursday') {
                this.setState({
                  thursdaystartingtime: this.reformatInput(deliveryhours[i].starttime.toString()),
                  thursdayclosingtime:  this.reformatInput(deliveryhours[i].closetime.toString()),
                  thursdaychecked: deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? false : true
                })
              }
              else if (deliveryhours[i].day === 'Friday') {
                this.setState({
                  fridaystartingtime: this.reformatInput(deliveryhours[i].starttime.toString()),
                  fridayclosingtime:  this.reformatInput(deliveryhours[i].closetime.toString()),
                  fridaychecked: deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? false : true
                })
              }
              else if (deliveryhours[i].day === 'Saturday') {
                this.setState({
                  saturdaystartingtime: this.reformatInput(deliveryhours[i].starttime.toString()),
                  saturdayclosingtime: this.reformatInput(deliveryhours[i].closetime.toString()),
                  saturdaychecked: deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? false : true
                })
              }
              else if (deliveryhours[i].day === 'Sunday') {
                this.setState({
                  sundaystartingtime: this.reformatInput(deliveryhours[i].starttime.toString()),
                  sundayclosingtime:  this.reformatInput(deliveryhours[i].closetime.toString()),
                  sundaychecked: deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? false : true
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

    const {_id, mondaychecked, mondaystartingtime, mondayclosingtime, tuesdaychecked, tuesdaystartingtime, tuesdayclosingtime, wednesdaychecked, wednesdaystartingtime, wednesdayclosingtime,
      thursdaychecked, thursdaystartingtime, thursdayclosingtime, fridaychecked, fridaystartingtime, fridayclosingtime, saturdaychecked, saturdaystartingtime, saturdayclosingtime, sundaychecked, sundaystartingtime, sundayclosingtime} = this.state

    var data = {
      deliveryhours:  [
        {
          day: "Monday",
          starttime: !mondaychecked? 0 : this.state.mondaystartingtime.includes(":") ? Number(this.state.mondaystartingtime.replace(":", "")) : this.state.mondaystartingtime,
          closetime: !mondaychecked? 0 : this.state.mondayclosingtime.includes(":") ? Number(this.state.mondayclosingtime.replace(":", "")) : this.state.mondayclosingtime,
          timerange: [Number(this.state.mondaystartingtime.replace(":", "")), Number(this.state.mondayclosingtime.replace(":", ""))]
        },
        {
          day: "Tuesday",
          starttime: !tuesdaychecked? 0 : this.state.tuesdaystartingtime.includes(":") ? Number(this.state.tuesdaystartingtime.replace(":", "")) : this.state.tuesdaystartingtime,
          closetime: !tuesdaychecked? 0 : this.state.tuesdayclosingtime.includes(":") ? Number(this.state.tuesdayclosingtime.replace(":", "")) : this.state.tuesdayclosingtime,
          timerange: [Number(this.state.tuesdaystartingtime.replace(":", "")), Number(this.state.tuesdayclosingtime.replace(":", ""))]
        },
        {
          day: "Wednesday",
          starttime: !wednesdaychecked? 0 : this.state.wednesdaystartingtime.includes(":") ? Number(this.state.wednesdaystartingtime.replace(":", "")) : this.state.wednesdaystartingtime,
          closetime: !wednesdaychecked? 0 : this.state.wednesdayclosingtime.includes(":") ? Number(this.state.wednesdayclosingtime.replace(":", "")) : this.state.wednesdayclosingtime,
          timerange: [Number(this.state.wednesdaystartingtime.replace(":", "")), Number(this.state.wednesdayclosingtime.replace(":", ""))]
        },
        {
          day: "Thursday",
          starttime: !thursdaychecked? 0 : this.state.thursdaystartingtime.includes(":") ? Number(this.state.thursdaystartingtime.replace(":", "")) : this.state.thursdaystartingtime,
          closetime: !thursdaychecked? 0 : this.state.thursdayclosingtime.includes(":") ? Number(this.state.thursdayclosingtime.replace(":", "")) : this.state.thursdayclosingtime,
          timerange: [Number(this.state.thursdaystartingtime.replace(":", "")), Number(this.state.thursdayclosingtime.replace(":", ""))]
        },
        {
          day: "Friday",
          starttime: !fridaychecked? 0 : this.state.fridaystartingtime.includes(":") ? Number(this.state.fridaystartingtime.replace(":", "")) : this.state.fridaystartingtime,
          closetime: !fridaychecked? 0 : this.state.fridayclosingtime.includes(":") ? Number(this.state.fridayclosingtime.replace(":", "")) : this.state.fridayclosingtime,
          timerange: [Number(this.state.fridaystartingtime.replace(":", "")), Number(this.state.fridayclosingtime.replace(":", ""))]
        },
        {
          day: "Saturday",
          starttime: !saturdaychecked? 0 : this.state.saturdaystartingtime.includes(":") ? Number(this.state.saturdaystartingtime.replace(":", "")) : this.state.saturdaystartingtime,
          closetime: !saturdaychecked? 0 : this.state.saturdayclosingtime.includes(":") ? Number(this.state.saturdayclosingtime.replace(":", "")) : this.state.saturdayclosingtime,
          timerange: [Number(this.state.saturdaystartingtime.replace(":", "")), Number(this.state.saturdayclosingtime.replace(":", ""))]
        },
        {
          day: "Sunday",
          starttime: !sundaychecked? 0 : this.state.sundaystartingtime.includes(":") ? Number(this.state.sundaystartingtime.replace(":", "")) : this.state.sundaystartingtime,
          closetime: !sundaychecked? 0 : this.state.sundayclosingtime.includes(":") ? Number(this.state.sundayclosingtime.replace(":", "")) : this.state.sundayclosingtime,
          timerange: [Number(this.state.sundaystartingtime.replace(":", "")), Number(this.state.sundayclosingtime.replace(":", ""))]
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

  switchMonday = () => {
    this.setState({mondaychecked: !this.state.mondaychecked});
  }

  switchTuesday = () => {
    this.setState({tuesdaychecked: !this.state.tuesdaychecked});
  }

  switchWednesday = () => {
    this.setState({wednesdaychecked: !this.state.wednesdaychecked});
  }

  switchThursday = () => {
    this.setState({thursdaychecked: !this.state.thursdaychecked});
  }

  switchFriday = () => {
    this.setState({fridaychecked: !this.state.fridaychecked});
  }

  switchSaturday = () => {
    this.setState({saturdaychecked: !this.state.saturdaychecked});
  }

  switchSunday = () => {
    this.setState({sundaychecked: !this.state.sundaychecked});
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
          <Col xs="12" md="9">
            <Card >
              <CardHeader>
                <strong>Delivery Hours</strong>
              </CardHeader>
              <CardBody>

                <Label htmlFor="deliveryhours">Please select times for your restaurant delivery hours</Label>
                
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
                            disabled={!this.state.mondaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={mondaystartingtime} onChange={this.onMondayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            disabled={!this.state.mondaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={mondayclosingtime} onChange={this.onMondayClosingTimeChange} />
                          <div style={{marginLeft:10}}>
                            <AppSwitch onChange={() => this.switchMonday()} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.mondaychecked} label dataOn={'On'} dataOff={'Off'}/>   
                          </div>
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
                            disabled={!this.state.tuesdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={tuesdaystartingtime} onChange={this.onTuesdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            disabled={!this.state.tuesdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={tuesdayclosingtime} onChange={this.onTuesdayClosingTimeChange} />
                          <div style={{marginLeft:10}}>
                            <AppSwitch onChange={() => this.switchTuesday()} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.tuesdaychecked} label dataOn={'On'} dataOff={'Off'}/>   
                          </div>
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
                            disabled={!this.state.wednesdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={wednesdaystartingtime} onChange={this.onWednesdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            disabled={!this.state.wednesdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={wednesdayclosingtime} onChange={this.onWednesdayClosingTimeChange} />
                          <div style={{marginLeft:10}}>
                            <AppSwitch onChange={() => this.switchWednesday()} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.wednesdaychecked} label dataOn={'On'} dataOff={'Off'}/>   
                          </div>
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
                            disabled={!this.state.thursdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={thursdaystartingtime} onChange={this.onThursdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            disabled={!this.state.thursdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={thursdayclosingtime} onChange={this.onThursdayClosingTimeChange} />
                          <div style={{marginLeft:10}}>
                            <AppSwitch onChange={() => this.switchThursday()} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.thursdaychecked} label dataOn={'On'} dataOff={'Off'}/>                   
                          </div>
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
                            disabled={!this.state.fridaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={fridaystartingtime} onChange={this.onFridayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            disabled={!this.state.fridaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={fridayclosingtime} onChange={this.onFridayClosingTimeChange} />
                          <div style={{marginLeft:10}}>
                            <AppSwitch onChange={() => this.switchFriday()} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.fridaychecked} label dataOn={'On'} dataOff={'Off'}/>                   
                          </div>
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
                            disabled={!this.state.saturdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={saturdaystartingtime} onChange={this.onSaturdayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            disabled={!this.state.saturdaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={saturdayclosingtime} onChange={this.onSaturdayClosingTimeChange} />
                          <div style={{marginLeft:10}}>
                            <AppSwitch onChange={() => this.switchSaturday()} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.saturdaychecked} label dataOn={'On'} dataOff={'Off'}/>                   
                          </div>
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
                            disabled={!this.state.sundaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={sundaystartingtime} onChange={this.onSundayStartingTimeChange} />
                          <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignSelf: 'center'}}>-</Label>
                          <TimeField 
                            disabled={!this.state.sundaychecked} style={{textAlign: 'center', width: 80, padding: '5px 8px'}} value={sundayclosingtime} onChange={this.onSundayClosingTimeChange} />
                          <div style={{marginLeft:10}}>
                            <AppSwitch onChange={() => this.switchSunday()} className={'mx-1 float-right'} variant={'3d'} color={'success'} checked={this.state.sundaychecked} label dataOn={'On'} dataOff={'Off'}/>                   
                          </div>
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

export default DeliveryHours;
