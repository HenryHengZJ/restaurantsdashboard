import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Label, Button, Card, CardBody, CardGroup, Col, Container, Form, FormText, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import caterer_login_wallpaper from "../../../assets/img/caterer_login_wallpaper.jpg";
import axios from 'axios';
import apis from "../../../apis";

class CatererLogin extends Component {

  constructor(props) {
    super(props);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.enterPressed = this.enterPressed.bind(this)

    this.state = {
      useremail: "",
      userpassword: "",
      isMobile: false,
      invalidUser: false,
    };
  }

  componentDidMount() {
    if (window.innerWidth < 900) {
      this.setState({
        isMobile: true
      });
    }

    window.addEventListener(
      "resize",
      () => {
        this.setState({
          isMobile: window.innerWidth < 900
        });
      },
      false
    );
  }

  handleEmailChange(e) {
    this.setState({ useremail: e.target.value, invalidUser: false });
  }

  handlePasswordChange(e) {
    this.setState({ userpassword: e.target.value, invalidUser: false });
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if(code === 13) { //13 is the enter keycode
       this.login(event)
    } 
}

  login = e => {
    e.preventDefault();

    const {useremail, userpassword} = this.state;

    var data = {
      email: useremail,
      password: userpassword
    }

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.POSTcatererlogin;

    axios.post(url, data, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.props.history.push('/caterer')
        }
        else {
          this.setState({
            invalidUser: true
          })
        }
      })
      .catch((error) => {
        this.setState({
          invalidUser: true
        })
      });
    
  };

  openEmail = () => {
    window.location.href = `mailto:support@foodiebee.com`;
  }

  signUp = () => {
    window.open('https://foodiebee.herokuapp.com/caterersignup', '_blank');
  }

  render() {

    const { isMobile, invalidUser } = this.state;
  
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
              style={{ marginTop: 20, flex: 1, display: "flex" }}
              className="justify-content-center"
            >
              
                <Col
                  style={{
                    textAlign: isMobile ? "center" : "start",
                    marginTop: 50,
                    color: "white"
                  }}
                  xs={isMobile ? "11" : "6"}
                >
                  <img
                      style={{
                        objectFit: "cover",
                        height: 70,
                        width: 180,
                        marginBottom: 20
                      }}
                      src={require("../../../assets/img/brandlogo_dark.png")}
                    />
                  <h2 style={{ fontSize: 40 }}>Boost your business</h2>
                  <h6 style={{ lineHeight:2, fontSize: 18, letterSpacing: 2, marginTop: 30 }}>
                    Orders management, marketting channels, reviews and feedback.
                    There are much more benefits when you join us.
                  </h6>
                </Col>

                <Col style={{ marginTop: 50 }} xs={isMobile ? "11" : "6"}>
                <Card
                  style={{ boxShadow: "1px 1px 3px #9E9E9E" }}
                  className="p-4"
                >
                  <CardBody className="text-center">
                    
                    <Form>
                      <h2>Caterer Login</h2>
                      <p
                        style={{ marginBottom: 20 }}
                        className="text-muted text-center"
                      >
                        Don't have an account?&nbsp;
                        <Button color="link" onClick={() => this.signUp()} style={{ fontWeight: '500',color: "#20a8d8" }} >
                          <p style={{padding: 0, marginTop: 10}}>Sign Up</p>
                        </Button>
                      </p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>@</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          value={this.state.useremail}
                          onChange={e => this.handleEmailChange(e)}
                          type="text"
                          placeholder="Email"
                          autoComplete="email"
                          onKeyPress={this.enterPressed.bind(this)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
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
                          value={this.state.userpassword}
                          onChange={e => this.handlePasswordChange(e)}
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          onKeyPress={this.enterPressed.bind(this)}
                        />
                      </InputGroup>
                      {invalidUser ? <Label style={{color: 'red', marginBottom: 20, fontSize: 13}}>Invalid email / password</Label> : null }
                      <Row>
                        <Col xs="6" md="6">
                          <Button
                            style={{ backgroundColor: "#20a8d8" }}
                            onClick={e => this.login(e)}
                            color="primary"
                            className="px-4"
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" md="6">
                          <Button
                            style={{
                              boxShadow: "none",
                              background: "none",
                              fontWeight: "500"
                            }}
                            color="link"
                            className="px-4"
                          >
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    <p
                      style={{ marginTop: 50, marginBottom: 10 }}
                      className="text-muted text-center"
                    >
                      Have a question?&nbsp;
                      <Button color="link" onClick={() => this.openEmail()} style={{ fontWeight: '500',color: "#20a8d8" }} >
                        <p style={{padding: 0, marginTop: 10}}>support@foodiebee.com</p>
                      </Button>
                    </p>
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

export default CatererLogin;
