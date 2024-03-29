import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler} from 'reactstrap';
import './styles.css'
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};


class NavBar extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar style={{padding: 0, margin: 0, backgroundColor: 'rgba(211,211,211,0.3)', boxShadow: '0px 0px 3px #9E9E9E'}} light expand="md">
          <NavbarBrand style={{padding: 0, margin: 0,}} href="/">
            <img style={{objectFit: 'cover', height: 50, width: 160, marginLeft: 20, marginTop: 10}} src={require('../../assets/img/brandlogo_light.png')}/>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink style={{ fontWeight: '600', fontSize: 15, paddingLeft: 20, paddingRight: 20}} href="">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ fontWeight: '600', fontSize: 15, paddingLeft: 20, paddingRight: 20}} href= "" >Services</NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ fontWeight: '600', fontSize: 15, paddingLeft: 20, paddingRight: 20}} href= "" target="_blank">Who we are</NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ fontWeight: '600', fontSize: 15, paddingLeft: 20, paddingRight: 20}} href= "" target="_blank">Contact</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={e => this.props.signIn(e)} style={{ cursor: 'pointer', fontWeight: '600', fontSize: 15, paddingLeft: 20, paddingRight: 20}} target="_blank">Sign In</NavLink>
              </NavItem>
              
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
};

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;

export default NavBar;
