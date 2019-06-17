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
  Progress ,
  Table,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sound from 'react-sound';

class ReceiveOrder extends Component {

  constructor(props) {
    super(props);

    this.togglePhoneOrder = this.togglePhoneOrder.bind(this);
    this.toggleEmailOrder = this.toggleEmailOrder.bind(this);

    this.state = {
      _id: "",
      phoneOrder: true,
      emailOrder: true,
      isPlaying: false,
      count: 0,
      timer: null,
      playStatus: Sound.status.STOPPED,
      maxValue: 22
    };

  }

  componentWillUnmount(){
    if (this.state.timer) {
      clearInterval(this.state.timer)
    }
  }

  togglePhoneOrder() {
    this.setState({
      phoneOrder: !this.state.phoneOrder
    }, () => {
      this.handleNext()
    })
  }

  toggleEmailOrder() {
    this.setState({
      emailOrder: !this.state.emailOrder
    }, () => {
      this.handleNext()
    })
  }

  handleNext = () => {
    const {phoneOrder, emailOrder, _id} = this.state
    
    var data = {
      phoneReceivable: phoneOrder,
      emailReceivable: emailOrder,
    }

    var headers = {
      'Content-Type': 'application/json',
      //'Authorization': jwtToken,
    }

    var url = apis.UPDATEcaterer;

    if (_id !== "") {
      url = url + +"?_id=" + _id;
    }

    axios.put(url, data, {headers: headers})
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

  playDemoClicked = () => {
    this.setState({
      isPlaying: !this.state.isPlaying,
      playStatus: Sound.status.PLAYING,
    }, () => {
      if (this.state.isPlaying) {
        const timer = setInterval(() => {
          var newcount = this.state.count + 0.5
          this.setState({
            count: newcount
          })
        }, 500);
        this.setState({ timer: timer })
      }
      else {
        this.setState({
          count: 0,
          playStatus: Sound.status.STOPPED
        })
        clearInterval(this.state.timer)
      }
    })
  }

  finishedPlaying = () => {
    this.setState({
      isPlaying: false,
      count: 0,
      playStatus: Sound.status.STOPPED
    })
    clearInterval(this.state.timer)
  }


  render() {

    const {phoneOrder, emailOrder} = this.state
    
    return (
      <div className="animated fadeIn">
        <Row >
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Receive order by phone</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-0">
                  <Col xs="8">
                    <Label style={{lineHeight: 1.7}}  htmlFor="ReceiveOrder">Receive orders by turning your restaurant phone into an order receiving machine.</Label>
                    <Label style={{lineHeight: 1.7, marginTop: 15, }}  htmlFor="ReceiveOrder">You will get an automatic alert call once order is placed.</Label>
                    <p style={{lineHeight: 2, marginTop: 10, color: '#20a8d8', fontSize: 16}} className="h6" htmlFor="ReceiveOrder">Play Demo</p>
                    <Table style={{marginBottom: 20}} bordered>
                      <tbody>
                        <tr>
                          <td
                            style={{ fontSize: 15, fontWeight: "600", textAlign: "start" }}
                          >
                           <img onClick={() => this.playDemoClicked()} style={{objectFit:'cover', cursor: 'pointer', width: 50, height: 50 }} src={this.state.isPlaying ? "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/stop.png" : "https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/play.png"}  />
                          </td>
                          <td style={{ color: 'black', fontWeight: "600", width: '100%' }}>
                            <Progress max={this.state.maxValue} style={{marginTop: 20}} value={this.state.count} />
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                    <Sound
                      url={"https://foodiebeegeneralphoto.s3-eu-west-1.amazonaws.com/foodiebee_order_recording_trimmed.mp3"}
                      playStatus={this.state.playStatus}
                      onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${bytesLoaded / bytesTotal * 100}% loaded`)}
                      onLoad={() => console.log('Loaded')}
                      onPlaying={({ position }) => console.log('Position', position)}
                      onPause={() => console.log('Paused')}
                      onResume={() => console.log('Resumed')}
                      onStop={() => console.log('Stopped')}
                      onFinishedPlaying={() => this.finishedPlaying()}
                    />
                    
                    <AppSwitch size="lg" onChange={this.togglePhoneOrder} className={'float-left'} variant={'3d'} color={'success'} checked={phoneOrder} label dataOn={'On'} dataOff={'Off'}/>   
                  
                  </Col>
                  <Col xs="4">
                    <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={require("../../../assets/img/receiveorderphone.jpg")}  />
                  </Col>
                  
                    
                  
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Receive order by email</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-0">
                  <Col xs="7">
                    <Label style={{lineHeight: 1.7}} htmlFor="ReceiveOrder">Receive orders via your email address.</Label>
                    <Label style={{lineHeight: 1.7, marginTop: 15, marginBottom: 50}}  htmlFor="ReceiveOrder">We will send you an email of the orders once customer has placed their orders online.</Label>
                    <AppSwitch size="lg" onChange={this.toggleEmailOrder} className={'float-left'} variant={'3d'} color={'success'} checked={emailOrder} label dataOn={'On'} dataOff={'Off'}/>   
                  </Col>
                  <Col xs="5">
                    <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={require("../../../assets/img/receiveorderemail.jpg")}  />
                  </Col>
                </FormGroup>
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

export default ReceiveOrder;
