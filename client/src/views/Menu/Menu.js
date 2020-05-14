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
import color from "../../assets/color"

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
      fetchedmenu: [
        {
          title: "Ebi Furai",
          category: 'Side Dishes',
          descrip: "Deep fried king prawns coated in seasonal breadcrumbs served with sweet Japanese sauce",
          markitem: [],
          priceperunit: 5.9,
        },
        {
          title: "Yasai Gyoza",
          category: 'Side Dishes',
          descrip: "Finely chopped seasonal vegetables dumpling steamed and then pan fried, served with traditional gyoza sauce",
          markitem: [],
          priceperunit: 6.8,
        },
        {
          title: "Yakitori",
          category: 'Side Dishes',
          descrip: "Chicken and spring onion grilled on skewer served with yakitori sauce",
          markitem: [],
          priceperunit: 6.9,
        },
        {
          title: "Sake / Salmon Nigiri",
          category: 'Sushi Nigiri',
          descrip: "Rice ball served with a slice of filling (2 pcs)",
          markitem: [],
          priceperunit: 4,
        },
        {
          title: "Suzuki / Sea Bass Nigiri",
          category: 'Sushi Nigiri',
          descrip: "Rice ball served with a slice of filling. (2 pcs)",
          markitem: [],
          priceperunit: 5,
        },
        {
          title: "Ebi / Prawn Nigiri",
          category: 'Sushi Nigiri',
          descrip: "Rice ball served with a slice of filling. (2 pcs)",
          markitem: [],
          priceperunit: 4,
        },
        {
          title: "Yasai Tempura Set",
          category: 'Tempura Set',
          descrip: "Sweet potato, aubergine, shitake mushroom, asparagus, carrot, lotus roots, green paper and onion coated in a light crispy batter. Served with steamed rice, miso soup",
          markitem: [],
          priceperunit: 12.9,
        },
        {
          title: "Seafood Tempura",
          category: 'Tempura Set',
          descrip: "Fresh mix seafood coated in a light crispy batter served with steamed rice, miso soup",
          markitem: [],
          priceperunit: 13.9,
        },
        {
          title: "Tempura Moriawase",
          category: 'Tempura Set',
          descrip: "Assorted mix vegetable and fresh seafood coated in a light crispy batter served with steam rice, miso soup",
          markitem: [],
          priceperunit: 13.9,
        },
        {
          title: "Teppan Chicken Teriyaki",
          category: 'Teppan Teriyaki',
          descrip: "Grilled 8oz of chicken breast served with stir fried vegetables and sweet teriyaki sauce",
          markitem: [],
          priceperunit: 13.9,
        },
        {
          title: "Teppan Salmon Teriyaki",
          category: 'Teppan Teriyaki',
          descrip: "Grilled fresh supreme of salmon served with stir fried vegetables and sweet teriyaki sauce",
          markitem: [],
          priceperunit: 15.9,
        },
        {
          title: "Teppan Beef Teriyaki",
          category: 'Teppan Teriyaki',
          descrip: "Grilled 9oz prime Irish strip loin steak served with stir fried vegetables and sweet teriyaki sauce",
          markitem: [],
          priceperunit: 15.9,
        },
      ],
      menu: [],
      menutitle: [],
      selectedMenuTitle: "",
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
    
    this.restructureMenu();

  }

  
  restructureMenu = () => {
    var finalresult = [];

    var result = this.state.fetchedmenu.reduce(function(r, a) {
      r[a.category] = r[a.category] || [];
      r[a.category].push(a);
      return r;
    }, Object.create(null));

    for (var key in result) {
     
      var parentObject = {
        menutitle: key,
        menuitem: result[key],
      };

      finalresult.push(parentObject);
    }
  
    this.setState({
      menu: finalresult,
      loading: false,
    },() => {
      this.listmenu()
    })
  }

  listmenu = () => {
    var menu = this.state.menu
    var menutitleArray = [];
    for (let i = 0; i < menu.length; i++) { 
      var menutitle = menu[i].menutitle
      menutitleArray.push(menutitle)
    }
      
    var filtered_data = this.state.menu[0].menuitem

    this.setState({
      menutitle: menutitleArray,
      selectedMenuTitle: menutitleArray[0],
      filtered_data,
    })
  }

  categoryClicked = index => {

    var menuindex = this.state.menu.findIndex(x => x.menutitle == this.state.menutitle[index]);

    var filtered_data = this.state.menu[menuindex].menuitem

    this.setState({
      selectedMenuTitle: this.state.menutitle[index],
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

  menuItemClicked = (index) => {

    var menuindex = this.state.menu.findIndex(x => x.menutitle == this.state.selectedMenuTitle);
    if (menuindex >= 0 && index >= 0) {

      this.setState({
        selectedMenuItem: this.state.menu[menuindex].menuitem[index],
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
              menuItemModal: !this.state.menuItemModal,
              isSaving: false,
            }, () => {
              toast(<ErrorInfo/>, {
                position: toast.POSITION.BOTTOM_RIGHT
              });
            })
          });
      }
      else {

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
    })
  }


  //Render functions///////////////////////////////////////////////////////////////////////
  
  renderCategory() {
    var itemsarray = [];
    var items = this.state.menutitle;
    for (let i = 0; i < items.length; i++) {
      itemsarray.push(
        <Card
          key={i}
          className="card-1"
          onClick={() => this.categoryClicked(i)}
          style={{
            cursor: "pointer",
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
            borderColor: this.state.selectedMenuTitle === items[i] ? color.primaryLight : null,
            borderStyle: "solid",
            borderWidth: this.state.selectedMenuTitle === items[i] ? 2 : null
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
                    style={{ cursor: "pointer", color: color.primaryLight }}
                  >
                    {items[i]}
                  </p>
                </div>

              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }

    return (
      <Row style={{ marginTop: 10 }}>
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
                onClick={() => this.menuItemClicked(i)}
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
                            color: color.primaryLight,
                            cursor: "pointer",
                            overflow: "hidden"
                          }}
                        >
                          {items[i].title}
                        </h5>
                      </Dotdotdot>
                    </div>
                  </div>

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

  
  renderEmptyCategoryItems() {
    return (
      <Row>
        {this.renderEmptyItem()}
      </Row>
    );
  }

  renderForm() {

    var selectedItemTitle = this.state.selectedMenuItem.title;
    var selectedItemDescrip = this.state.selectedMenuItem.descrip;
    var selectedItemPrice = this.state.selectedMenuItem.priceperunit;
    var selectedMarkItemAs = this.state.selectedMenuItem.markitem;
  
    return (
    
        <Form action="" method="post" className="form-horizontal">
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
              <h6>Price</h6>
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
                    <p style={{fontSize: 18, fontWeight: 600, color: "black", marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 20}}>Categories</p>
                    {this.renderCategory(this.state.data)}
                  </Col>
                  <Col
                    style={{ paddingTop: 30, paddingLeft: 40, paddingRight: 20 }}
                    xs="12"
                    md="9"
                  >
                    <Row>
                      <Col style={{ textAlign: "start" }} xs="12">
                        <h4>
                          {this.state.selectedMenuTitle}
                        </h4>
                      </Col>
                      <Col style={{ marginTop: 20 }} xs="12">
                        {this.state.loading
                          ? this.renderLoadingItems()
                          : this.state.empty 
                          ? this.renderEmptyCategoryItems()
                          :  this.renderCategoryItems()
                          }
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
