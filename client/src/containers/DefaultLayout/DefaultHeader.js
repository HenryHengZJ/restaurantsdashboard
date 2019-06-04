import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import apis from "../../apis";

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      catererName: "",
      profilesrc: "",
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
          this.setState({
            catererName: typeof response.data[0].catererName !== 'undefined' ? response.data[0].catererName : "Restaurant",
            profilesrc: typeof response.data[0].profilesrc !== 'undefined' ? response.data[0].profilesrc : "https://s3-eu-west-1.amazonaws.com/foodiebeegeneralphoto/user_default.png",
          })
        } 
      })
      .catch((error) => {
      });
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand>
          <img style={{objectFit: 'cover', height: 50, width: 160, marginLeft: 20, marginTop: 10}} src={require('../../assets/img/brandlogo_light.png')}/>

        </AppNavbarBrand>
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        
        <Nav className="ml-auto" navbar>
     

          <NavItem className="d-md-down-none">
            <Label style={{marginTop: 5, marginLeft: 10, marginRight: 10}} className="h5">{this.state.catererName}</Label>
          </NavItem>
          
          <AppHeaderDropdown style={{marginRight: 20}} direction="down">
            <DropdownToggle nav>
              <img style={{width: 40, height: 40, position: 'relative', overflow: 'hidden', borderRadius: '50%'}} src={this.state.profilesrc} className="img-avatar" alt="" />
              <i className="fa fa-chevron-down fa-1x" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem onClick={e => this.props.onProfileClicked(e)}><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem onClick={e => this.props.onTermsConditionClicked(e)}><i className="fa fa-shield"></i> Terms & Conditions</DropdownItem>
              <DropdownItem onClick={e => this.props.onPrivacyPolicyClicked(e)}><i className="fa fa-lock"></i> Privacy Policy</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-sign-out"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
