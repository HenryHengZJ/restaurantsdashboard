import React, { Component } from "react";
import {
  Badge,
  Form,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Collapse,
  FormGroup,
  FormText,
  FormFeedback,
  CardBody,
  Card,
  CardHeader,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Table
} from "reactstrap";
import moment from "moment";
import "./Menu.css";
import axios from 'axios';
import apis from "../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dotdotdot from "react-dotdotdot";
import ContentLoader, { Facebook } from "react-content-loader";
import Checkbox from "@material-ui/core/Checkbox";
import CurrencyInput from "react-currency-input";

const glutenfreeIcon = require("../../assets/img/glutenfree1.png");
const hotIcon = require("../../assets/img/fire.png");
const spicyIcon = require("../../assets/img/pepper.png");
const vegeIcon = require("../../assets/img/lettuce.png");
const healthyIcon = require("../../assets/img/fruit.png");
const halalicon = require("../../assets/img/halalsign.png");
const closeIcon = require("../../assets/img/close.png");
const dropDownIcon = require("../../assets/img/dropdown.png");
const dropUpIcon = require("../../assets/img/dropup.png");
const saladIcon = require("../../assets/img/salad.png");
const mainlunchIcon = require("../../assets/img/mainlunch.png");
const commissionIcon = require("../../assets/img/commission.png");
const small_commissionIcon = require("../../assets/img/small_commission.png");
const primeIcon = require("../../assets/img/prime_badge.png");
const food_blackwhitePic = require("../../assets/img/food_blackwhite.jpg");

class Menu extends Component {
  constructor(props) {
    super(props);

    this.inputOpenFileRef = React.createRef()
    this.toggleInfoModal = this.toggleInfoModal.bind(this);
    this.toggleDeleteItemModal = this.toggleDeleteItemModal.bind(this);

    this.state = {
      infoModalOpen: false,
      loadingModal: false,
      deleteModalOpen: false,
      deleteMenuID: "",
      empty: false,
      updateItem: false,
      menuItemModal: false,
      selectedMenuItem: null,
      markitem: [
        "Hot",
        "Spicy",
        "Halal",
        "Gluten Free",
        "Vegetarian",
        "Healthy"
      ],
      discountedpricelist: [6, 10],
      file: "",
      data: [],
      filtered_data: [],
      activeMenuItem: null,
      dayList: [],
      selectedDay: "",
      loading: false,
      isSaving: false,
      isImgInValid: null,
      isTitleEmpty: false,
      isDescripEmpty: false,
      isPricePerUnitInvalid: false,
      isPrimePriceInvalid: false,
    };
  }

  componentDidMount() {

    var dayList = [];
    var selectedDay = "";

    var todayDate = new Date();
    var mondayOfTheWeek = this.getMonday(todayDate);

    var dayOfTheWeek = null;

    if (todayDate.getDay() === 0 || todayDate.getDay() === 6) {
      //detect if weekends, if yes, get next monday
      mondayOfTheWeek = new Date(
        mondayOfTheWeek.setDate(mondayOfTheWeek.getDate() + 7)
      );

      dayOfTheWeek = mondayOfTheWeek;

      for (let i = 0; i < 5; i++) {
        dayList.push(dayOfTheWeek.toString());

        if (i === 0) {
          selectedDay = dayOfTheWeek.toString();
        }

        dayOfTheWeek = new Date(
          dayOfTheWeek.setDate(dayOfTheWeek.getDate() + 1)
        );
      }
    } else {
      dayOfTheWeek = mondayOfTheWeek;

      for (let i = 0; i < 5; i++) {
        dayList.push(dayOfTheWeek.toString());

        if (dayOfTheWeek.getTime() - todayDate.getTime() === 0) {
          selectedDay = dayOfTheWeek.toString();
        }

        dayOfTheWeek = new Date(
          dayOfTheWeek.setDate(dayOfTheWeek.getDate() + 1)
        );
      }
    }

    this.setState({
      dayList: dayList,
      selectedDay,
    },() => {
      this.getMenu()
    })

  }
  
  getMonday = d => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  dayClicked = index => {
    var activeDay = moment(this.state.dayList[index]).format("dddd");

    var filtered_data = this.state.data
      .slice()
      .filter(datachild => datachild.activeDay === activeDay);
    this.setState({
      selectedDay: this.state.dayList[index],
      filtered_data: filtered_data
    });
  };

  getMenu = () => {
  
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETlunchmenu;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            data: response.data,
            empty: response.data.length === 0 ? true : false,
          }, () => {
            var filtered_data = this.state.data
            .slice()
            .filter(datachild => datachild.activeDay ===  moment(this.state.selectedDay).format("dddd"));
            this.setState({
              filtered_data: filtered_data,
            })
          })
        } 
      })
      .catch((error) => {
        this.setState({
          empty: true 
        })
      });
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  menuItemClicked = (_id) => {
    var itemindex = this.state.data.findIndex(x => x._id == _id);
    var data = this.state.data.slice()

    var selectedMenuItem = data[itemindex]
    
    if (itemindex >= 0) {
      this.setState({
        selectedMenuItem,
        updateItem: true,
        file:"",        
        isTitleEmpty: false,
        isDescripEmpty: false,
        isImgInValid: null,
        isPricePerUnitInvalid: false,
        isPrimePriceInvalid: false,
      }, () => {
        this.toggleMenuItemModal()
      })
    }
  }

  addNewItemClicked = () => {
    var selectedMenuItem = {
      markitem: [],
      descrip: "",
      title: "",
      discountedprice: 6,
      priceperunit: 0,
      src: "",
      activeDay: moment(this.state.selectedDay).format("dddd"),
      selected: true,
    }
    this.setState({
      updateItem: false,
      selectedMenuItem,
      file: "",
      isTitleEmpty: false,
      isDescripEmpty: false,
      isImgInValid: null,
      isPricePerUnitInvalid: false,
      isPrimePriceInvalid: false,
    }, () => {
      this.toggleMenuItemModal()
    })
  }

  toggleMenuItemModal = () => {
    this.setState({
      menuItemModal: !this.state.menuItemModal,
    })
  }

  toggleInfoModal() {
    this.setState({
      infoModalOpen: !this.state.infoModalOpen,
    });
  }

  toggleDeleteItemModal() {
    this.setState({
      deleteModalOpen: !this.state.deleteModalOpen,
    });
  }
  
  findIcon = iconname => {
    var iconPath;
    if (iconname == "Hot") {
      iconPath = hotIcon;
    } else if (iconname == "Spicy") {
      iconPath = spicyIcon;
    } else if (iconname == "Halal") {
      iconPath = halalicon;
    } else if (iconname == "Gluten Free") {
      iconPath = glutenfreeIcon;
    } else if (iconname == "Vegetarian") {
      iconPath = vegeIcon;
    } else if (iconname == "Healthy") {
      iconPath = healthyIcon;
    }
    return iconPath;
  };

  makeDefault = (toMakeDefaultID) => {

    this.setState({
      isSaving: true
    })

    var arrayofID = []

    for (let i = 0; i < this.state.filtered_data.length; i++) {
      if (this.state.filtered_data[i]._id !== toMakeDefaultID) {
        arrayofID.push(this.state.filtered_data[i]._id)
      }
    }

    var headers = {
      'Content-Type': 'application/json',
    }

    var body = {
      defaultID: toMakeDefaultID,
      arrayofID: JSON.stringify(arrayofID)
    }

    var url = apis.UPDATE_default_lunchmenu;

    axios.put(url, body, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          this.setState({
            menuItemModal: false,
            isSaving: false,
          }, () => {
            toast(<SuccessInfo/>, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
              this.getMenu();
          })
        } 
      })
      .catch((error) => {
        this.setState({
          menuItemModal: false
        }, () => {
          toast(<ErrorInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        })
      });

  }

  checkInput = () => {
    const {
      selectedMenuItem,
      updateItem,
      file,
      isPricePerUnitInvalid,
      isPrimePriceInvalid,
    } = this.state;

    var selectedItemTitle = selectedMenuItem.title
    var selectedItemDescrip = selectedMenuItem.descrip
    var selectedItemId = selectedMenuItem._id
    var selectedItemPrice = selectedMenuItem.priceperunit
    var selectedDiscountedPrice = selectedMenuItem.discountedprice
    var selectedMarkItemAs = selectedMenuItem.markitem
    var selectedSrc = selectedMenuItem.src

    if (selectedItemTitle === "") {
      this.setState({
        isTitleEmpty: true
      });
    } 
    else if (selectedItemDescrip === "") {
      this.setState({
        isDescripEmpty: true
      });
    } 
    else if (isPricePerUnitInvalid || isPrimePriceInvalid ) {
      return;
    } 
    else {
      if (updateItem) {

        //Check Image
        if (file === "" && selectedSrc === "") {
          this.setState({
            isImgInValid: true
          });
          return;
        } 

        if (file !== "") {
          if (file.type === "image/png" || file.type === "image/PNG" || file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/JPG") {
          } 
          else {
            this.setState({
              isImgInValid: true
            });
            return;
          }
        }


        //Check Price
        if (parseFloat(selectedItemPrice) < 6) {
          this.setState({
            isPricePerUnitInvalid: true
          })
          return;
        }

        this.setState({
          isSaving: true
        })

        //Update Item

        let formData = new FormData();    //formdata object
        formData.append('title', selectedItemTitle);
        formData.append('descrip', selectedItemDescrip);
        formData.append('priceperunit', selectedItemPrice);
        formData.append('discountedprice', selectedDiscountedPrice);
        formData.append('activeDay', moment(this.state.selectedDay).format("dddd"));
        if (file !== "") {
          formData.append('files', file);
        }
        
        if (selectedMarkItemAs.length > 0) {
          formData.append('markitem', JSON.stringify(selectedMarkItemAs));
        }

        var headers = {
          'Content-Type': 'application/json',
        }

        var url = apis.UPDATElunchmenu + "?_id=" + selectedItemId;

        axios.put(url, formData, {withCredentials: true}, {headers: headers})
          .then((response) => {
            if (response.status === 201) {
              this.setState({
                menuItemModal: !this.state.menuItemModal,
                isSaving: false,
              }, () => {
                toast(<SuccessInfo/>, {
                  position: toast.POSITION.BOTTOM_RIGHT
                });
                  this.getMenu();
              })
            } 
          })
          .catch((error) => {
            this.setState({
              menuItemModal: !this.state.menuItemModal
            }, () => {
              toast(<ErrorInfo/>, {
                position: toast.POSITION.BOTTOM_RIGHT
              });
            })
          });
      }
      else {

        //Check Image
        if (file === "") {
          this.setState({
            isImgInValid: true
          });
          return;
        }

        if (file.type === "image/png" || file.type === "image/PNG" || file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/JPG") {
        } 
        else {
          this.setState({
            isImgInValid: true
          });
          return;
        }

        //Check Price
        if (parseFloat(selectedItemPrice) < 6) {
          this.setState({
            isPricePerUnitInvalid: true
          })
          return;
        }

        this.setState({
          isSaving: true
        })

        //Add item
        let formData = new FormData();    //formdata object
        formData.append('title', selectedItemTitle);
        formData.append('descrip', selectedItemDescrip);
        formData.append('priceperunit', selectedItemPrice);
        formData.append('discountedprice', selectedDiscountedPrice);
        formData.append('files', file);   
        formData.append('activeDay', moment(this.state.selectedDay).format("dddd"));

        if (selectedMarkItemAs.length > 0) {
          formData.append('markitem', JSON.stringify(selectedMarkItemAs));
        }

        var headers = {
          'Content-Type': 'application/json',
        }

        var url = apis.ADDlunchmenu ;

        axios.post(url, formData, {withCredentials: true}, {headers: headers})
          .then((response) => {
            if (response.status === 200) {
              this.setState({
                menuItemModal: !this.state.menuItemModal,
                isSaving: false,
              }, () => {
                console.log(response.data)
                this.makeDefault(response.data._id)
              })
            } 
          })
          .catch((error) => {
            this.setState({
              menuItemModal: !this.state.menuItemModal
            }, () => {
              toast(<ErrorInfo/>, {
                position: toast.POSITION.BOTTOM_RIGHT
              });
            })
          });
      }
    }
  };

  deleteMenuItem = (_id) => {
    this.setState({
      deleteMenuID: _id,
      deleteModalOpen: !this.state.deleteModalOpen,
    })
  }

  deleteButtonPressed = () => {

    var headers = {
      'Content-Type': 'application/json',
    }

    var del_menu_url = "";

    del_menu_url = apis.DELETElunchmenu + "?_id=" + this.state.deleteMenuID;
  
    axios.all([
      axios.delete(del_menu_url),
    ])
    .then(axios.spread((response) => {
      if (response.status === 200) {
        toast(<SuccessDelete/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          deleteModalOpen: false,
          menuItemModal: false,
        }, () => {
          this.getMenu()
        })
      }
      else {
        this.setState({
          deleteModalOpen: false,
          menuItemModal: false,
        })
        toast(<ErrorDelete/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } 
    }))
    .catch((error) => {
      this.setState({
        deleteModalOpen: false,
        menuModalOpen: false,
      })
      toast(<ErrorDelete/>, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    });
  }
  

  //Handle Input Change//////////////////////////////////////////////////////////////////////

  
  handleImageChange(e) {
    e.preventDefault();
    var selectedMenuItem = JSON.parse(JSON.stringify(this.state.selectedMenuItem));
    let reader = new FileReader();
    let file = e.target.files[0];

    console.log(file)

    reader.onloadend = () => {
  
      selectedMenuItem.src = reader.result

      this.setState({
        selectedMenuItem,
        file
      })
    }

    reader.readAsDataURL(file)
  }

  removePhoto = () => {
    var selectedMenuItem = JSON.parse(JSON.stringify(this.state.selectedMenuItem));
    selectedMenuItem.src = ""

    this.setState({
      selectedMenuItem,
      file: "",
    });
  }

  handleCheckBoxChange = (e, markitem) => {

    var selectedMenuItem = JSON.parse(JSON.stringify(this.state.selectedMenuItem));
    var selectedMarkItemAs = selectedMenuItem.markitem
    var index = selectedMarkItemAs.findIndex(x => x == markitem);

    //If selectedmarkitem exist
    if (index >= 0) {
      selectedMarkItemAs.splice(index, 1);
    }
    //If selectedmarkitem not exist
    else {
      selectedMarkItemAs.push(markitem);
    }

    selectedMenuItem.markitem = selectedMarkItemAs

    this.setState({
      selectedMenuItem,
    });
  };

  handleTitleChange(e) {

    var selectedMenuItem = JSON.parse(JSON.stringify(this.state.selectedMenuItem));
    selectedMenuItem.title = e.target.value
  
    this.setState({
      selectedMenuItem,
    });
  }

  handleDescripChange(e) {

    var selectedMenuItem = JSON.parse(JSON.stringify(this.state.selectedMenuItem));
    selectedMenuItem.descrip = e.target.value

    this.setState({
      selectedMenuItem,
    });
  }

  handlePriceChange(e, value) {

    var selectedMenuItem = JSON.parse(JSON.stringify(this.state.selectedMenuItem));
    selectedMenuItem.priceperunit = Number(value).toFixed(2)

    this.setState({
      selectedMenuItem,
    },() => {
      if (parseFloat(value) === parseFloat(selectedMenuItem.discountedprice)) {
        this.setState({
          isPricePerUnitInvalid: true
        })
      }
      else if (parseFloat(value) < parseFloat(selectedMenuItem.discountedprice)) {
        this.setState({
          isPricePerUnitInvalid: true
        })
      }
      else {
        this.setState({
          isPricePerUnitInvalid: false
        })
      }
    })
  }

  handlePrimePriceChange(e) {

    var selectedMenuItem = JSON.parse(JSON.stringify(this.state.selectedMenuItem));
    selectedMenuItem.discountedprice = parseInt(e.target.value)
    var isPrimePriceInvalid = false

    if (parseFloat(e.target.value) === parseFloat(selectedMenuItem.priceperunit)) {
      isPrimePriceInvalid = true
    }
    else if (parseFloat(e.target.value) > parseFloat(selectedMenuItem.priceperunit)) {
      isPrimePriceInvalid = true
    }

    this.setState({
      selectedMenuItem,
      isPrimePriceInvalid
    })
    
  }

  //Render functions///////////////////////////////////////////////////////////////////////
  
  renderDate() {
    var itemsarray = [];
    var items = this.state.dayList;
    for (let i = 0; i < items.length; i++) {
      itemsarray.push(
        <Card
          key={i}
          className="card-1"
          onClick={() => this.dayClicked(i)}
          style={{
            cursor: "pointer",
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
            borderColor: this.state.selectedDay === items[i] ? "#20a8d8" : null,
            borderStyle: "solid",
            borderWidth: this.state.selectedDay === items[i] ? 2 : null
          }}
        >
          <CardBody
            style={{
              cursor: "pointer",
              paddingTop: 0,
              paddingBottom: 0,
              paddingRight: 15,
              height: "100%"
            }}
          >
            <Row>
              <Col style={{ marginTop: 15, marginBottom: 10 }} xs="12">
                <div>
                  <p
                    className="h5"
                    style={{ cursor: "pointer", color: "#20a8d8" }}
                  >
                    {moment(items[i]).format("dddd")}
                  </p>
                </div>
                <div style={{ marginTop: 10 }}>
                  <p style={{ cursor: "pointer" }}>
                    {moment(items[i]).format("DD MMM YYYY")}
                  </p>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }

    return (
      <Row style={{ marginTop: 40 }}>
        <Col xs="12">{itemsarray}</Col>
      </Row>
    );
  }

  renderCategoryItems() {
    var itemsarray = [];

    var items = this.state.filtered_data;

    for (let i = 0; i < items.length; i++) {
      if (items[i].title !== "") {
        itemsarray.push(
          <Col style={{paddingRight: 20, paddingLeft: 0}} key={i} xs="12" sm="6" md="6" lg="4">
            <Card className="card-1">
              <CardBody
                style={{
                  cursor: "pointer",
                  marginTop: 0,
                  marginBottom: 10,
                  padding: 0,
                  height: "100%"
                }}
                onClick={() => this.menuItemClicked(items[i]._id)}
              >
                <Col>
                  <div className="row">
                    {items[i].src ? (
                      <Col style={{ padding: 0 }} xs="12">
                        <div
                          style={{
                            objectFit: "cover",
                            width: "auto",
                            height: 150
                          }}
                        >
                          <img
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%"
                            }}
                            src={items[i].src}
                            alt=""
                          />
                        </div>
                      </Col>
                    ) : null}

                    <div>
                      <Dotdotdot clamp={1}>
                        <h5
                          style={{
                            textAlign: "start",
                            marginTop: 20,
                            marginLeft: 15,
                            marginRight: 15,
                            color: "#20a8d8",
                            cursor: "pointer",
                            overflow: "hidden"
                          }}
                        >
                          {items[i].title}
                        </h5>
                      </Dotdotdot>
                    </div>
                  </div>

                  {items[i].selected ?
                    <div >
                      <Badge
                        color="success"
                      >
                        DEFAULT
                      </Badge>
                      <Badge
                        style={{marginLeft: 10}}
                        color="secondary"
                      >
                        {items[i].soldamount} SOLD 
                      </Badge>
                    </div>
                    :
                    <Badge
                      color="secondary"
                    >
                      {items[i].soldamount} SOLD 
                    </Badge> 
                  }

                  <div style={{ marginTop: 10 }}>
                    <Dotdotdot clamp={2}>
                      <p style={{ cursor: "pointer", overflow: "hidden" }}>
                        {items[i].descrip}
                      </p>
                    </Dotdotdot>
                  </div>

                  <div style={{ marginTop: 0, marginBottom: 10 }}>
                    <Label
                      style={{
                        cursor: "pointer",
                        marginTop: 5,
                        fontWeight: "600"
                      }}
                      className="h5 float-left"
                    >
                      €{Number(items[i].priceperunit).toFixed(2)}
                    </Label>
                    <div
                      style={{
                        cursor: "pointer",
                        marginLeft: 10,
                        color: "#FF5722"
                      }}
                      className="h5 float-right"
                    >
                      <Button
                        style={{
                          cursor: "pointer",
                          marginRight: 5,
                          opacity: 1.0,
                          padding: 5,
                          fontWeight: "600",
                          fontSize: 11,
                          borderWidth: 0,
                          backgroundColor: "#FF5722",
                          color: "white"
                        }}
                        disabled
                      >
                        PRIME
                      </Button>
                      <Label style={{ cursor: "pointer", fontSize: 22 }}>
                        €{items[i].discountedprice}
                      </Label>
                    </div>
                  </div>
                </Col>
              </CardBody>
            </Card>
          </Col>
        );
      }
    }

    return (
      <Row>
        {itemsarray}
        {this.renderEmptyItem()}
      </Row>
    );
  }

  
  renderForm() {

    var selectedItemTitle = this.state.selectedMenuItem.title;
    var selectedItemDescrip = this.state.selectedMenuItem.descrip;
    var selectedItemPrice = this.state.selectedMenuItem.priceperunit;
    var selectedDiscountedPrice = this.state.selectedMenuItem.discountedprice;
    var selectedMarkItemAs = this.state.selectedMenuItem.markitem;
    var imagePreviewUrl = this.state.selectedMenuItem.src;

    return (
    
        <Form action="" method="post" className="form-horizontal">
          <FormGroup>
            <Label style={{fontWeight: '600', color: 'black'}}>Image</Label>
            <div>
              <input
                id="fileInput"
                type="file"
                ref={this.inputOpenFileRef}
                onChange={(e)=>this.handleImageChange(e)}
              />
            </div>
            {imagePreviewUrl === "" ?
            <div onClick={() => this.inputOpenFileRef.current.click()} style={{ cursor:'pointer', marginTop:20, width: "100%", height: 200, display:'flex', alignItems: 'center', backgroundColor: 'rgba(211,211,211,0.7)'}}>
                <img
                style={{ margin: 'auto', objectFit: "cover", width: 70, height: 70 }}
                src={"https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png"}
              />
              </div>
              :
            <img
              style={{cursor:'pointer', marginTop:20, objectFit: "cover", width: "100%", height: 200 }}
              onClick={() => this.inputOpenFileRef.current.click()}
              src={imagePreviewUrl !== "" ? imagePreviewUrl : "https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png"}
            />
              }
            {imagePreviewUrl !== "" ?<Button
              style={{ borderRadius: 0, opacity: 0.9 }}
              color="danger"
              block
              onClick={() => this.removePhoto()}
            >
              Remove
            </Button> : null }
            {this.state.isImgInValid === true? <Label style={{color: 'red', fontSize: 13, opacity: 0.7}}>* Please input only jpg / png format</Label> : null}
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <h6>Title</h6>
            </Col>
            <Col xs="12" md="9">
              <Input
                onChange={e => this.handleTitleChange(e)}
                value={selectedItemTitle}
                style={{ color: "black" }}
                type="text"
                placeholder="Title of the the dish"
                invalid={this.state.isTitleEmpty ? true : false}
              />
              <FormFeedback className="help-block">
                Please enter title of your dish
              </FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <h6>Description</h6>
            </Col>
            <Col xs="12" md="9">
              <Input
                onChange={e => this.handleDescripChange(e)}
                value={selectedItemDescrip}
                style={{ color: "black" }}
                type="textarea"
                rows="3"
                placeholder="Description of the dish"
                invalid={this.state.isDescripEmpty ? true : false}
              />
              <FormFeedback className="help-block">
                Please enter description of your dish
              </FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <h6>Price / Unit</h6>
            </Col>
            <Col xs="12" md="9">
              <InputGroup style={{padding: 0}} className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>€</InputGroupText>
                </InputGroupAddon>
                <CurrencyInput
                  style={{
                    borderWidth: 1,
                    borderColor: "rgba(211,211,211,0.3)",
                    paddingLeft: 10,
                    color: "black",
                    width: 100
                  }}
                  value={selectedItemPrice}
                  onChange={(e, value) => this.handlePriceChange(e, value)}
                  placeholder="0.00"
                  required
                />
              </InputGroup>
              {this.state.isPricePerUnitInvalid ? <Label style={{color: 'red', fontSize: 11, opacity:0.6}}>Price has to be more than €6</Label> : null }
            </Col> 
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <div style={{ marginLeft: 0,}} className="row">
                <h6>Prime Price </h6>
                <img onClick={this.toggleInfoModal} style={{ cursor: 'pointer', marginLeft: 5, height: 20, width: 20, objectFit: "cover" }} src="https://img.icons8.com/ios/50/000000/info.png" alt=""/>
              </div>
            </Col>
            <Col xs="12" md="9">
              <InputGroup style={{padding: 0}} className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>€</InputGroupText>
                </InputGroupAddon>
                <Input
                  onChange={e => this.handlePrimePriceChange(e)}
                  value={selectedDiscountedPrice}
                  style={{ color: "black", width: '50%' }}
                  type="select"
                  placeholder="6"
                  invalid={this.state.isPrimePriceInvalid ? true : false}
                >
                  {this.state.discountedpricelist.map(price => (
                    <option
                      style={{ color: "black" }}
                      key={price}
                      value={price}
                    >
                      {price}
                    </option>
                  ))}
                </Input>
                <FormFeedback className="help-block">
                  Prime Price must be smaller than price / unit.
                </FormFeedback>
              </InputGroup>
            </Col>
          </FormGroup>
          <h6
            style={{
              fontWeight: "600",
              color: "black",
              marginBottom: 10,
              marginTop: 30
            }}
          >
            Mark Item As
          </h6>
          {this.renderFormMarkItem(selectedMarkItemAs)}
        </Form>
     
    );
  }

  renderFormMarkItem(markeditem) {
    var itemsarray = [];
    var markitem = this.state.markitem;
    for (let i = 0; i < markitem.length; i++) {
      itemsarray.push(
        <Col key={i} xs="6">
          <FormGroup
            style={{ paddingLeft: 0, marginTop: 10 }}
            check
            className="checkbox"
          >
            <Checkbox
              checked={markeditem.includes(markitem[i])}
              onChange={e => this.handleCheckBoxChange(e, markitem[i])}
              value={markitem[i]}
              style={{ padding: 0, marginRight: 10 }}
            />
            <Label check className="form-check-label">
              {markitem[i]}
            </Label>
            <img
              style={{
                marginLeft: 5,
                marginRight: 20,
                height: 25,
                width: 25,
                objectFit: "cover"
              }}
              src={this.findIcon(markitem[i])}
              alt=""
            />
          </FormGroup>
        </Col>
      );
    }

    return <Row>{itemsarray}</Row>;
  }
  
  renderMarkAsIcon(markas) {
    var iconarray = [];
    for (let i = 0; i < markas.length; i++) {
      iconarray.push(
        <img
          style={{
            marginLeft: 5,
            marginBottom: 5,
            height: 20,
            width: 20,
            objectFit: "cover"
          }}
          key={i}
          src={this.findIcon(markas[i])}
          alt=""
        />
      );
    }
    return (
      <Col
        style={{
          textAlign: "start",
          flex: 1
        }}
      >
        {iconarray}
      </Col>
    );
  }

  renderAddNewItemModal() {
    return (
      <Modal isOpen={this.state.menuItemModal} toggle={this.toggleMenuItemModal}>
        <ModalHeader toggle={this.toggleMenuItemModal}>{this.state.updateItem ? "Edit Item" : "Add New Item"}</ModalHeader>
        <ModalBody>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          {this.state.updateItem ?
          <Button className="float-left" onClick={() => this.makeDefault(this.state.selectedMenuItem._id)} color="primary" disabled={!this.state.updateItem ? true : this.state.isSaving ? true : false }>
            Make Default
          </Button>
          :
          null}
          <Button onClick={() => this.checkInput()} color="success" disabled={this.state.isSaving ? true : false}>
            {this.state.updateItem ? this.state.isSaving ? "Saving" : "Save" : this.state.isSaving ? "Adding..." : "Add"}
          </Button>
          <Button color="danger" onClick={() => this.deleteMenuItem(this.state.selectedMenuItem._id)} disabled={this.state.selectedMenuItem.selected ? true : this.state.isSaving ? true : false}>
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  
  renderEmptyItem() {
    return (
      <Col style={{paddingRight: 20, paddingLeft: 0}} xs="12" sm="6" md="6" lg="4">
        <Card
          style={{ cursor: "pointer", borderStyle: "dashed", borderWidth: 2 }}
          onClick={() => this.addNewItemClicked()}
        >
          <CardBody
            style={{ marginTop: 0, marginBottom: 10, padding: 0, height: 'auto' }}
          >
            <Row>
              <Col xs="12">
                <div style={{ objectFit:'cover', width: 'auto', height: 150, }}>
                  <img style={{ objectFit:'cover', width: '100%', height: '100%', }} src={food_blackwhitePic}/>
                </div>
              </Col>

              <Col xs="12">
                <div className="col" style={{ textAlign: "center" }}>
                  <i
                    style={{ color: "#c8ced3", marginTop: 20 }}
                    className="fa icon-plus fa-3x text-center"
                  />
                  <p style={{ marginTop: 20 }}>Add New Item</p>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    );
  }

  renderLoadingItems() {
    var itemsarray = [];

    for (let i = 0; i < 6; i++) {
      itemsarray.push(
        <Col key={i} xs="12" sm="6" md="6" lg="4">
          <ContentLoader height="250">
            <rect x="0" y="0" rx="6" ry="6" width="100%" height="220" />
          </ContentLoader>
        </Col>
      );
    }

    return (
      <Row
        style={{
          marginTop: 10
        }}
      >
        {itemsarray}
      </Row>
    );
  }
  
  
  renderInfoModal() {

    return (
      <Modal    
        toggle={this.toggleInfoModal}
        isOpen={this.state.infoModalOpen} >

        <ModalHeader toggle={this.toggleInfoModal}>
          Main Lunch
        </ModalHeader>
        <ModalBody style={{paddingTop: 0, marginTop: 0, paddingLeft: 0, paddingRight: 20}}>
 
          <Table borderless style={{ marginLeft: 10, marginRight: 10, marginTop: 20}}>
            <tbody>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={primeIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>Prime subscribed customers will enjoy the lunch at <b style={{color: 'orange'}}>Prime Price</b> once per day except for weekends and holidays.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={small_commissionIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>FoodieBee will only charge <b style={{color: 'green'}}>5%</b> commission on each order by Prime subscribed customers.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={mainlunchIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>Normal customers will pay at the original price.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={commissionIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>FoodieBee charge a <b style={{color: 'green'}}>10%</b> commission on each order.</p></td>
              </tr>
            </tbody>
          </Table>

          <div style={{textAlign: 'center', color: 'white',}}>
            <Button onClick={this.toggleInfoModal} style={{fontSize: 15, height: 50, marginTop: 10, marginBottom: 10,}} className="bg-primary" color="primary">Got It</Button>
          </div>

        </ModalBody>
      </Modal>
    )
  }

  renderDeleteItemModal() {
    var title ;
    var descrip;

    title = "Delete Item";
    descrip = "Are you sure you want to delete this item from menu? Deleted items are not able to recovered."

    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        isOpen={this.state.deleteModalOpen} 
        toggle={this.toggleDeleteItemModal}
      >
        <ModalHeader toggle={this.toggleDeleteItemModal} closeButton>
            {title}
        </ModalHeader>
        <ModalBody>
          <p>
            {descrip}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => this.deleteButtonPressed()}>Delete</Button>
          <Button color="secondary" onClick={this.toggleDeleteItemModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody style={{padding: 0}}>
                <Row>
                  <Col
                    style={{
                      backgroundColor: "rgba(211,211,211,0.3)",
                    }}
                    xs="12"
                    md="3"
                  >
                    {this.renderDate(this.state.data)}
                  </Col>
                  <Col
                    style={{ paddingTop: 30, paddingLeft: 40, paddingRight: 20 }}
                    xs="12"
                    md="9"
                  >
                    <Row>
                      <Col style={{ textAlign: "start" }} xs="12">
                        <h4>
                          {moment(this.state.selectedDay).format("dddd, DD MMM YYYY")}
                        </h4>
                      </Col>
                      <Col style={{ marginTop: 20 }} xs="12">
                        {this.state.loading
                          ? this.renderLoadingItems()
                          : this.state.data.length > 0
                          ? this.renderCategoryItems()
                          : null}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {this.state.selectedMenuItem ? this.renderAddNewItemModal() : null}

        {this.renderInfoModal()}

        {this.renderDeleteItemModal()}

        <ToastContainer hideProgressBar/>
      </div>
    );
  }
}

const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Saved</b>
   
  </div>
)

const SuccessDelete = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Deleted</b>
   
  </div>
)

const ErrorDelete = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error deleting data. Please try again</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error saving data. Please try again</b>
   
  </div>
)

export default Menu;
