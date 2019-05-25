import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormFeedback, Label, Button, Card, CardBody, CardGroup, Col, Container, Form, FormText, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import caterer_login_wallpaper from "../../../assets/img/caterer_login_wallpaper.jpg";
import axios from 'axios';
import apis from "../../../apis";
import PropTypes from 'prop-types';

class ResetPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirmpassword: "",
      error: false,
      emailsending: false,
      catererID: null,
      passwordnotmatch: false,
      updatePassword: null,
    };
  }

  async componentDidMount() {
   
    var windowurl = window.location.href.toString();
    var windowurlary = windowurl.split("/");
    var querytoken = windowurlary[windowurlary.length - 1];

    var url = apis.GETresetpassword + "?resetPasswordToken=" + querytoken;

    await axios.get(url, {})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererID: response.data.catererID
          })
        }
      })
      .catch((error) => {
        this.setState({
          error: true
        })
      });
  }


  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleConfirmPasswordChange(e) {
    this.setState({ confirmpassword: e.target.value });
  }

  sendClicked = () => {
    const { password, catererID, confirmpassword } = this.state;

    if (confirmpassword === password) {
      this.setState({
        emailsending: true
      })
  
      var headers = {
        'Content-Type': 'application/json',
      }
  
      var body = {
        catererPassword: password
      }
  
      var url = apis.PUTupdatepassword + "?_id=" + catererID;
  
      axios.put(url, body, {headers: headers})
        .then((response) => {
          if (response.status === 201) {
            this.setState({
              password: "",
              confirmpassword: "",
              emailsending: false,
              updatePassword: "Success"
            })
          } 
        })
        .catch((error) => {
          this.setState({
            password: "",
            confirmpassword: "",
            error: true,
            emailsending: false,
            updatePassword: "Failed"
          })
        });
    }
    else {
      this.setState({
        passwordnotmatch: true
      })
    }
  };

  backClicked = () => {
    this.props.history.push("/")
  };


  renderError() {
    return (
      <Form>
        <h2>Ooops!</h2>
        <p className="text-muted">
          Error resetting your password. Please send another resend link.
        </p>
        <Button color="primary" block onClick={() => this.backClicked()}>
          Back
        </Button>
      </Form>
    );
  }

  renderSuccess() {
    return (
      <Form>
        <h2>Success</h2>
        <p className="text-muted">Password has been successfully changed.</p>
        <Button color="success" block onClick={() => this.backClicked()}>
          Back
        </Button>
      </Form>
    );
  }
  
  render() {

    return (
      <div
        style={{
          backgroundImage: "url(" + caterer_login_wallpaper + ")",
          backgroundSize: "cover"
        }}
      >
        <div className="app justify-content-center align-items-center">
        <Container>
            <Row
              style={{ flex: 1, display: "flex" }}
              className="justify-content-center"
            >
              <Col md="9" lg="7" xl="6">
                <Card
                  style={{ boxShadow: "1px 1px 3px #9E9E9E" }}
                  className="p-4"
                >
                  <CardBody className="p-4">
                    <div style={{textAlign: 'center'}}>
                      <img
                        style={{
                          objectFit: "cover",
                          height: 70,
                          width: 180,
                          marginBottom: 20
                        }}
                        src={require("../../../assets/img/brandlogo_light.png")}
                      />
                    </div>
                    {this.state.error || this.state.updatePassword === 'Failed' ? (
                      this.renderError()
                    ) : 
                    this.state.updatePassword === 'Success' ? (
                      this.renderSuccess()
                    ) : 
                    (
                      <Form>
                        <h2>Reset Password</h2>
                        <p className="text-muted">
                          Enter your new password below.
                        </p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <a
                                style={{
                                  color: "gray",
                                  marginLeft: 2.5,
                                  marginRight: 2.5
                                }}
                                className="fa fa-lock"
                              />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            placeholder="Password"
                            autoComplete="password"
                            onChange={e => this.handlePasswordChange(e)}
                          />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <a
                                style={{
                                  color: "gray",
                                  marginLeft: 2.5,
                                  marginRight: 2.5
                                }}
                                className="fa fa-lock"
                              />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            placeholder="Confirm Password"
                            autoComplete="confirmpassword"
                            onChange={e => this.handleConfirmPasswordChange(e)}
                          />
                        </InputGroup>
                        <Button
                          color="success"
                          block
                          disabled={this.state.password === "" ? true : false}
                          onClick={() => this.sendClicked()}
                        >
                          Update
                        </Button>
                      </Form>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ResetPassword;
