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
  Pagination, 
  PaginationItem, 
  PaginationLink,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import './Cuisine.css'; 
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let prev  = 0;
let next  = 0;
let last  = 0;
let first = 0;


class Cuisine extends Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
   
    this.state = {
      _id: "",
      selectedmenu: [],
      cuisinemenu: [
        {
          src: require('../../../assets/img/american.jpg'),          
          checked: false,
          caption: 'American',
        },
        {
          src: require('../../../assets/img/asian.jpg'),               
          checked: false,
          caption: 'Asian',
        },
        {
          src: require('../../../assets/img/burger.jpg'),          
          checked: false,
          caption: 'Burger',
        },
        {
          src: require('../../../assets/img/carribean.jpg'),          
          checked: false,
          caption: 'Carribean',
        },
        {
          src: require('../../../assets/img/chinese.jpg'),          
          checked: false,
          caption: 'Chinese',
        },
        {
          src: require('../../../assets/img/dessert.jpg'),          
          checked: false,
          caption: 'Dessert',
        },
        {
          src: require('../../../assets/img/drinks.jpg'),
          checked: false,
          caption: 'Drinks',
        },
        {
          src: require('../../../assets/img/english.jpg'),          
          checked: false,
          caption: 'English',
        },
        {
          src: require('../../../assets/img/french.jpg'),          
          checked: false,
          caption: 'French',
        },
        {
          src: require('../../../assets/img/greek.jpg'),          
          checked: false,
          caption: 'Greek',
        },
        {
          src: require('../../../assets/img/halal.jpg'),          
          checked: false,
          caption: 'Halal',
        },
        {
          src: require('../../../assets/img/indian.jpg'),          
          checked: false,
          caption: 'Indian',
        },
        {
          src: require('../../../assets/img/irish.jpg'),          
          checked: false,
          caption: 'Irish',
        },
        {
          src: require('../../../assets/img/italian.jpg'),          
          checked: false,
          caption: 'Italian',
        },
        {
          src: require('../../../assets/img/japanese.jpg'),          
          checked: false,
          caption: 'Japanese',
        },
        {
          src: require('../../../assets/img/mexican.jpg'),          
          checked: false,
          caption: 'Mexican',
        },
        {
          src: require('../../../assets/img/middleeastern.jpg'),          
          checked: false,
          caption: 'Middle Eastern',
        },
        {
          src: require('../../../assets/img/pizza.jpg'),          
          checked: false,
          caption: 'Pizza',
        },
        {
          src: require('../../../assets/img/salad.jpg'),          
          checked: false,
          caption: 'Salad',
        },
        {
          src: require('../../../assets/img/sandwich.jpg'),          
          checked: false,
          caption: 'Sandwich',
        },
        {
          src: require('../../../assets/img/thai.jpg'),          
          checked: false,
          caption: 'Thai',
        },
        {
          src: require('../../../assets/img/vegetarian.jpg'),          
          checked: false,
          caption: 'Vegetarian Friendly',
        },
      ],
      currentPage: 1,
      menuPerPage: 6,
      isOpen: false,
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
          if (response.data[0].catererCuisine.length > 0) {
            this.setInitialInput(response.data[0].catererCuisine)
          }
        } 
      })
      .catch((error) => {
      });
  }

  setInitialInput = (catererCuisine) => {
    var selectedmenu = [];
    var cuisinemenu = this.state.cuisinemenu.slice()
 
    for (let x = 0; x < catererCuisine.length; x++) {
      for (let i = 0; i < cuisinemenu.length; i++) {
        if (cuisinemenu[i].caption === catererCuisine[x]) {
          cuisinemenu[i].checked = true
          var selectedMenuItem = {
            src: cuisinemenu[i].src,     
            checked: true,
            caption: cuisinemenu[i].caption
          }
          selectedmenu.push(selectedMenuItem)
        }
      }
    }

    this.setState({
      cuisinemenu: cuisinemenu,
      selectedmenu: selectedmenu,
      isOpen: selectedmenu.length > 0 ? true : false
    })
   
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      currentPage: Number(event.target.id),
    });
  }

  
  handleProceed = () => {
    this.props.history.push('/caterer/basics/occasion')
  }

  handleNext() {
    this.setState({
      isSaving: true,
    })

    const {selectedmenu, _id} = this.state
    var cuisines = [];
    for (let i = 0; i < selectedmenu.length; i++) {
      cuisines.push(selectedmenu[i].caption);
    }
   // alert(JSON.stringify(cuisines))

    var data = {
      catererCuisine: cuisines,
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

  handleCardClick(cuisinemenu) {

    var newselectedmenu = this.state.selectedmenu
    var newcuisinemenu = this.state.cuisinemenu

    var cuisinemenuindex = newcuisinemenu.findIndex(x => x.caption==cuisinemenu.caption);
    var selectedmenuindex = newselectedmenu.findIndex(x => x.caption==cuisinemenu.caption);

    //Check if item selected
    if (newcuisinemenu[cuisinemenuindex].checked) {
      //Remove selected cuisine
      newselectedmenu.splice(selectedmenuindex, 1)
      //Uncheck cuisine
      newcuisinemenu[cuisinemenuindex].checked = false
    }
    else {
      //Add selected cuisine
      var addItem = {
        src: cuisinemenu.src,
        checked: cuisinemenu.checked,
        caption: cuisinemenu.caption,
      }
      newselectedmenu.push(addItem)
      //Check cuisine
      newcuisinemenu[cuisinemenuindex].checked = true
    }
    
    this.setState({
      selectedmenu: newselectedmenu,
      cuisinemenu: newcuisinemenu,
      isOpen: newselectedmenu.length > 0 ? true : false
    })

  }

  handleSelectedCardClick(index, selectedcuisinemenu) {

    var newselectedmenu = this.state.selectedmenu
    var newcuisinemenu = this.state.cuisinemenu

    //Uncheck cuisine
    var cuisinemenuindex = newcuisinemenu.findIndex(x => x.caption==selectedcuisinemenu.caption);
    newcuisinemenu[cuisinemenuindex].checked = false
    
    //Remove selected cuisine
    newselectedmenu.splice(index, 1)
    
    this.setState({
      selectedmenu: newselectedmenu,
      cuisinemenu: newcuisinemenu,
      isOpen: newselectedmenu.length > 0 ? true : false
    });

  }

  
  render() {

    let { cuisinemenu, currentPage, menuPerPage, isOpen, selectedmenu } = this.state;

    // Logic for displaying current cuisine menu
    let indexOfLastCuisine = currentPage * menuPerPage;
    let indexOfFirstCuisine = indexOfLastCuisine - menuPerPage;
    let currentTodos = cuisinemenu.slice(indexOfFirstCuisine, indexOfLastCuisine);
    let selectedTodos = selectedmenu.slice();
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(cuisinemenu.length/menuPerPage);
    next  = (last === currentPage) ?currentPage: currentPage +1;

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>Restaurant Cuisine</strong>
              </CardHeader>
              <CardBody>
                <Collapse isOpen={isOpen}>
                  <Label style={{paddingTop: 10, paddingBottom: 10}} className="h6">Your Cuisine</Label>
                  <Row>
                    {
                      selectedTodos.map((selectedmenu,index) =>{
                        return (
                          <Col xs="12" sm="6" md="6" lg="4">
                              <Card style={{cursor: 'pointer'}} onMouseOver="" onClick={() => this.handleSelectedCardClick(index, selectedmenu)}>
                                <CardHeader style={{paddingLeft:30}}>
                                  <Input className="form-check-input" type="checkbox" checked/>
                                  {selectedmenu.caption}
                                  <div className="card-header-actions">
                                    <a className="card-header-action btn btn-close" ><i className="icon-close"></i></a>
                                  </div>
                                </CardHeader>
                                
                                <CardBody style={{padding: 0, height: 120}}>
                                  <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={selectedmenu.src}  />
                                </CardBody>
                              </Card>
                              
                          </Col>
                        )
                      })
                    }
                  </Row>
                </Collapse>

                <Label style={{paddingTop: 10, paddingBottom: 10}} className="h6" >Select Cuisine</Label>

                <Row>
                  {
                    currentTodos.map((cuisinemenu,index) =>{
                      return (
                        <Col xs="12" sm="6" md="6" lg="4">
                            <Card style={{cursor: 'pointer'}} onMouseOver="" onClick={() => this.handleCardClick(cuisinemenu)}>
                              <CardHeader style={{paddingLeft:30}}>
                                <Input className="form-check-input" type="checkbox" value={cuisinemenu.checked} checked={cuisinemenu.checked}/>
                                {cuisinemenu.caption}
                                <div className="card-header-actions">
                                  <a className="card-header-action btn btn-close" ><i className="icon-close"></i></a>
                                </div>
                              </CardHeader>
                              
                              <CardBody style={{padding: 0, height: 120}}>
                                <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={cuisinemenu.src}  />
                              </CardBody>
                            </Card>
                            
                        </Col>
                      )
                    })
                  }
                </Row>

                <Pagination style={{justifyContent: 'center', alignSelf:'center'}}>
                  
                  <PaginationItem>
                  { prev === 0 ? null :
                      <PaginationLink onClick={this.handleClick} id={prev} href={prev}>Prev</PaginationLink>
                  }
                  </PaginationItem>
                    {
                      pageNumbers.map((number,i) =>
                      <Pagination key= {i}>
                      <PaginationItem active = {pageNumbers[currentPage-1] === (number) ? true : false} >
                      <PaginationLink onClick={this.handleClick} href={number} key={number} id={number}>
                      {number}
                      </PaginationLink>
                      </PaginationItem>
                      </Pagination>
                    )}

                  <PaginationItem>
                  {
                    currentPage === last ? null :
                    <PaginationLink onClick={this.handleClick} id={pageNumbers[currentPage]} href={pageNumbers[currentPage]}>Next</PaginationLink>
                  }
                  </PaginationItem>

                </Pagination>
                      

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

export default Cuisine;
