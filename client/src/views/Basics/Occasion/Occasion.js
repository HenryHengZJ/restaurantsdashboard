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
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let prev  = 0;
let next  = 0;
let last  = 0;
let first = 0;


class Occasion extends Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    
    this.state = {
      _id: "",
      selectedoccasion: [],
      occasionmenu: [
        {
          src: require('../../../assets/img/breakfast.jpg'),          
          checked: false,
          caption: 'Breakfast',
        },
        {
          src: require('../../../assets/img/brunch.jpg'),          
          checked: false,
          caption: 'Brunch',
        },
        {
          src: require('../../../assets/img/buffet.jpg'),          
          checked: false,
          caption: 'Buffet',
        },
        {
          src: require('../../../assets/img/christmasparty.jpg'),          
          checked: false,
          caption: 'Christmas Party',
        },
        {
          src: require('../../../assets/img/dinner.jpg'),          
          checked: false,
          caption: 'Dinner',
        },
        {
          src: require('../../../assets/img/event.jpg'),          
          checked: false,
          caption: 'Event',
        },
        ///////////////////////////////
        {
          src: require('../../../assets/img/fingerfood.jpg'),          
          checked: false,
          caption: 'Finger Food',
        },
        {
          src: require('../../../assets/img/lunch.jpg'),          
          checked: false,
          caption: 'Lunch',
        },

        {
          src: require('../../../assets/img/meeting.jpg'),          
          checked: false,
          caption: 'Meeting',
        },
        {
          src: require('../../../assets/img/officedaily.jpg'),          
          checked: false,
          caption: 'Office Daily',
        },
        {
          src: require('../../../assets/img/wedding.jpg'),          
          checked: false,
          caption: 'Wedding',
        },
        {
          src: require('../../../assets/img/snacks.jpg'),          
          checked: false,
          caption: 'Snacks',
        },
      ],
      currentPage: 1,
      menuPerPage: 6,
      isOpen: false,
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
          if (response.data[0].catererOccasion.length > 0) {
            this.setInitialInput(response.data[0].catererOccasion)
          }
        } 
      })
      .catch((error) => {
      });
  }

  setInitialInput = (catererOccasion) => {
    var selectedoccasion = [];
    var occasionmenu = this.state.occasionmenu.slice()
 
    for (let x = 0; x < catererOccasion.length; x++) {
      for (let i = 0; i < occasionmenu.length; i++) {
        if (occasionmenu[i].caption === catererOccasion[x]) {
          occasionmenu[i].checked = true
          var selectedoccasionItem = {
            src: occasionmenu[i].src,     
            checked: true,
            caption: occasionmenu[i].caption
          }
          selectedoccasion.push(selectedoccasionItem)
        }
      }
    }

    this.setState({
      occasionmenu: occasionmenu,
      selectedoccasion: selectedoccasion,
      isOpen: selectedoccasion.length > 0 ? true : false
    })
   
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      currentPage: Number(event.target.id),
    });
  }

    
  handleProceed = () => {
    this.props.history.push('/caterer/basics/validateemail')
  }

  handleNext() {
    this.setState({
      isSaving: true,
    })

    const {selectedoccasion, _id} = this.state
    var occasions = [];
    for (let i = 0; i < selectedoccasion.length; i++) {
      occasions.push(selectedoccasion[i].caption);
    }
    //alert(JSON.stringify(occasions))
    var data = {
      catererOccasion: occasions,
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

  handleCardClick(occasionmenu) {

    var newselectedmenu = this.state.selectedoccasion
    var newoccasionmenu = this.state.occasionmenu
    
    var occasionmenuindex = newoccasionmenu.findIndex(x => x.caption==occasionmenu.caption);
    var selectedmenuindex = newselectedmenu.findIndex(x => x.caption==occasionmenu.caption);
   
    //Check if item selected
    if (newoccasionmenu[occasionmenuindex].checked) {
      //Remove selected Occasion
      newselectedmenu.splice(selectedmenuindex, 1)
      //Uncheck Occasion
      newoccasionmenu[occasionmenuindex].checked = false
    }
    else {
      //Add selected Occasion
      var addItem = {
        src: occasionmenu.src,
        checked: occasionmenu.checked,
        caption: occasionmenu.caption,
      }
      newselectedmenu.push(addItem)
      //Check Occasion
      newoccasionmenu[occasionmenuindex].checked = true
    }
    
    this.setState({
      selectedoccasion: newselectedmenu,
      occasionmenu: newoccasionmenu,
      isOpen: newselectedmenu.length > 0 ? true : false
    });

  }

  handleSelectedCardClick(index, selectedcuisinemenu) {

    var newselectedmenu = this.state.selectedoccasion
    var newoccasionmenu = this.state.occasionmenu

    //Uncheck Occasion
    var occasionmenuindex = newoccasionmenu.findIndex(x => x.caption==selectedcuisinemenu.caption);
    newoccasionmenu[occasionmenuindex].checked = false
    
    //Remove selected Occasion
    newselectedmenu.splice(index, 1)
    
    this.setState({
      selectedoccasion: newselectedmenu,
      occasionmenu: newoccasionmenu,
      isOpen: newselectedmenu.length > 0 ? true : false
    });

  }

  render() {

    let { occasionmenu, currentPage, menuPerPage, isOpen, selectedoccasion } = this.state;

    // Logic for displaying current Occasion menu
    let indexOfLastOccasion = currentPage * menuPerPage;
    let indexOfFirstOccasion = indexOfLastOccasion - menuPerPage;
    let currentTodos = occasionmenu.slice(indexOfFirstOccasion, indexOfLastOccasion);
    let selectedTodos = selectedoccasion.slice();
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(occasionmenu.length/menuPerPage);
    next  = (last === currentPage) ?currentPage: currentPage +1;

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="9">
            <Card >
              <CardHeader>
                <strong>Restaurant Occasion</strong>
              </CardHeader>
              <CardBody>
                <Collapse isOpen={isOpen}>
                  <Label style={{paddingTop: 10, paddingBottom: 10}} className="h6">Your Occasion</Label>
                  <Row>
                    {
                      selectedTodos.map((selectedoccasion,index) =>{
                        return (
                          <Col xs="12" sm="6" md="6" lg="4">
                              <Card style={{cursor: 'pointer'}} onMouseOver="" onClick={() => this.handleSelectedCardClick(index, selectedoccasion)} data-arg1='1234'>
                                <CardHeader style={{paddingLeft:30}}>
                                  <Input className="form-check-input" type="checkbox" checked />
                                  {selectedoccasion.caption}
                                  <div className="card-header-actions">
                                    <a className="card-header-action btn btn-close" ><i className="icon-close"></i></a>
                                  </div>
                                </CardHeader>
                                
                                <CardBody style={{padding: 0, height: 120}}>
                                  <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={selectedoccasion.src}  />
                                </CardBody>
                              </Card>
                              
                          </Col>
                        )
                      })
                    }
                  </Row>
                </Collapse>

                <Label style={{paddingTop: 10, paddingBottom: 10}} className="h6" >Select Occasion</Label>

                <Row>
                  {
                    currentTodos.map((occasionmenu,index) =>{
                      return (
                        <Col xs="12" sm="6" md="6" lg="4">
                            <Card style={{cursor: 'pointer'}} onMouseOver="" onClick={() => this.handleCardClick(occasionmenu)} data-arg1='1234'>
                              <CardHeader style={{paddingLeft:30}}>
                                <Input className="form-check-input" type="checkbox" value={occasionmenu.checked} checked={occasionmenu.checked}/>
                                {occasionmenu.caption}
                                <div className="card-header-actions">
                                  <a className="card-header-action btn btn-close" ><i className="icon-close"></i></a>
                                </div>
                              </CardHeader>
                              
                              <CardBody style={{padding: 0, height: 120}}>
                                <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={occasionmenu.src}  />
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

export default Occasion;
