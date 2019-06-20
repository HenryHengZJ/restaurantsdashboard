import React, { Component } from "react";
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
  Row
} from "reactstrap";
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);

    this.state = {
      catererEmail: "",
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
      isChangePasswordClicked: false,
      invalidPassword: false,
      isPasswordFormatWrong: false,
    };
  }

  componentDidMount() {
    this.getCatererDetail()
  }

  getCatererDetail = () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererEmail: typeof response.data[0].catererEmail !== 'undefined' ? response.data[0].catererEmail : "",
          })
        } 
      })
      .catch((error) => {
      });
  }

  handleEmailChange(e) {
    this.setState({
      catererEmail: e.target.value
    });
  }

  handleOldPasswordChange(e) {
    this.setState({
      oldpassword: e.target.value,
    });
  }

  handleNewPasswordChange(e) {
    this.setState({
      newpassword: e.target.value,
      isPasswordFormatWrong: false
    });
  }

  handleConfirmPasswordChange(e) {
    this.setState({
      confirmpassword: e.target.value
    });
  }

  saveChangesClicked = () => {

    const {catererEmail} = this.state

    var data = {
      catererEmail: catererEmail,
    }

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.UPDATEcaterer;

    axios.put(url, data, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.getCatererDetail();
        }
      })
      .catch((error) => {
        //alert("error updating! " + error)
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
  };

  validatePassword (password) {
    const regexp = /^(?=.{7,13}$)(?=\w{7,13})(?=.*\d)/;
    return regexp.test(String(password).toLowerCase());
  }

  updatePassword = () => {

    const {oldpassword, newpassword, confirmpassword} = this.state

    if (!this.validatePassword(newpassword)) {
      this.setState({
        isPasswordFormatWrong: true
      });
    }
    else {
      if (newpassword === confirmpassword) {

        var data = {
          originalpassword: oldpassword,
          newpassword: newpassword
        }

        var headers = {
          'Content-Type': 'application/json',
        }

        var url = apis.UPDATEcatererpassword;

        axios.put(url, data, {withCredentials: true}, {headers: headers})
          .then((response) => {
            if (response.status === 201) {
              toast(<SuccessInfo/>, {
                position: toast.POSITION.BOTTOM_RIGHT
              });
              this.setState({
                invalidPassword: false,
                isChangePasswordClicked: false
              }, () => {
                this.getCatererDetail();
              })
            }
          })
          .catch((error) => {
            toast(<ErrorInfo/>, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
            this.setState({
              invalidPassword: false
            })
          });
      }
      else {
        this.setState({
          invalidPassword: true
        })
      }
    }

  };

  passwordChangesClicked = () => {
    this.setState({
      isChangePasswordClicked: true
    });
  };

  backClicked = () => {
    this.setState({
      isChangePasswordClicked: false
    });
  };

  renderChangePassword() {
    return (
      <Card>
        <CardHeader>
          <strong>Change Password</strong>
        </CardHeader>
        <CardBody>
          <Form action="" method="post" className="form-horizontal">
            <FormGroup row>
              <Col md="3">
                <Label>Old Password</Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  type="password"
                  placeholder="Enter Old Password"
                  autoComplete="old-password"
                  value={this.state.oldpassword}
                  onChange={e => {
                    this.handleOldPasswordChange(e);
                  }}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label>New Password</Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  type="password"
                  placeholder="Enter New Password"
                  autoComplete="new-password"
                  value={this.state.newpassword}
                  onChange={e => {
                    this.handleNewPasswordChange(e);
                  }}
                />
               {this.state.isPasswordFormatWrong ? <Label style={{fontSize:13, color: 'red', marginBottom: 20}} >* Password should be alphanumerical and within length of 7 to 13</Label> : null}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label>Confirm Password</Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  autoComplete="confirm-password"
                  value={this.state.confirmpassword}
                  onChange={e => {
                    this.handleConfirmPasswordChange(e);
                  }}
                />
              </Col>
            </FormGroup>
            {this.state.invalidPassword ? <Label style={{color: 'red', marginBottom: 20, fontSize: 13}}>* Passwords do not match</Label> : null }
          </Form>
        </CardBody>
        <CardFooter style={{backgroundColor: 'white'}}>
      
          <Button
            className="float-left"
            type="reset"
            color="primary"
            outline
            onClick={() => this.backClicked()}
          >
            Back
          </Button>
                
          <Button
            onClick={() => this.updatePassword()}
            className="float-right"
            type="submit"
            color="primary"
          >
            Update Password
          </Button>
        </CardFooter>
      </Card>
    );
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            {this.state.isChangePasswordClicked ? (
              this.renderChangePassword()
            ) : (
              <Card>
                <CardHeader>
                  <strong>Profile</strong>
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" className="form-horizontal">
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-email">Email</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input style={{color: 'black'}}
                          type="email"
                          id="hf-email"
                          name="hf-email"
                          placeholder="Enter Email..."
                          autoComplete="email"
                          value={this.state.catererEmail}
                          onChange={e => {
                            this.handleEmailChange(e);
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-password">Password</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Button
                          onClick={() => this.passwordChangesClicked()}
                          className="text-left"
                          color="ghost-primary"
                          color="primary"
                        >
                          Change Password
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter style={{backgroundColor: 'white'}}>
                  <Button
                    onClick={() => this.saveChangesClicked()}
                    className="float-right"
                    type="submit"
                    color="primary"
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>
            )}
          </Col>
          <ToastContainer hideProgressBar/>
        </Row>
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

export default Profile;
