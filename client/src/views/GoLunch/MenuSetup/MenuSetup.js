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
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import ContentLoader, { Facebook } from "react-content-loader";
import 'react-toastify/dist/ReactToastify.css';
import classnames from "classnames";
import "./MenuSetup.css";
import Dotdotdot from "react-dotdotdot";
import Checkbox from "@material-ui/core/Checkbox";
import CurrencyInput from "react-currency-input";
import { ObjectID } from 'bson';
import CatererDetail from '../../Pages/CatererDetail'

const glutenfreeIcon = require("../../../assets/img/glutenfree1.png");
const hotIcon = require("../../../assets/img/fire.png");
const spicyIcon = require("../../../assets/img/pepper.png");
const vegeIcon = require("../../../assets/img/lettuce.png");
const healthyIcon = require("../../../assets/img/fruit.png");
const halalicon = require("../../../assets/img/halalsign.png");
const closeIcon = require("../../../assets/img/close.png");
const dropDownIcon = require("../../../assets/img/dropdown.png");
const dropUpIcon = require("../../../assets/img/dropup.png");
const saladIcon = require("../../../assets/img/salad.png");
const mainlunchIcon = require("../../../assets/img/mainlunch.png");
const commissionIcon = require("../../../assets/img/commission.png");
const small_commissionIcon = require("../../../assets/img/small_commission.png");
const primeIcon = require("../../../assets/img/prime_badge.png");
const food_blackwhitePic = require("../../../assets/img/food_blackwhite.jpg");

class MenuSetup extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleLiteInfoModal = this.toggleLiteInfoModal.bind(this);
    this.toggleMainInfoModal = this.toggleMainInfoModal.bind(this);
    this.togglePreviewModal = this.togglePreviewModal.bind(this);
    this.toggleNewItemModal = this.toggleNewItemModal.bind(this);
    this.toggleDeleteItemModal = this.toggleDeleteItemModal.bind(this);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescripChange = this.handleDescripChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);

    this.myRef = React.createRef()   // Create a ref object 
    this.inputOpenFileRef = React.createRef()

    this.state = {
      isSaving: false,
      loading: true,
      isMobile: false,
      file: '',
      imagePreviewUrl: '',
      activeTab: "LITE",
      menutitle: [
        "LITE",
        "MAIN",
      ],
      markitem: [
        "Hot",
        "Spicy",
        "Halal",
        "Gluten Free",
        "Vegetarian",
        "Healthy"
      ],
      fetchedmenu: [],
      menu: [],
      menuModalOpen: false,
      previewModalOpen: false,
      deleteModalOpen: false,
      updateItem: false,
      deleteMenuID: "",
      selectedItemTitle: "",
      isTitleEmpty: false,
      selectedItemDescrip: "",
      isDescripEmpty: false,
      selectedItemPrice: 0,
      isPriceEmpty: false,
      selectedMarkItemAs: [],
      selectedItemId: "",
      selectedCategoryName: "",
      deleteItemFunctionName: "",
      liteInfoModalOpen: false,
      mainInfoModalOpen: false,
    };
  }

  componentDidMount() {

    this.getCatererLunchMenu();
    
    if (window.innerWidth < 450) {
      this.setState({
        isMobile: true
      });
    }

    window.addEventListener(
      "resize",
      () => {
        this.setState({
          isMobile: window.innerWidth < 450
        });
      },
      false
    );
  }

  getCatererLunchMenu= () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETlunchmenu;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            fetchedmenu: response.data,
          },() => {
            this.restructureMenu();
          })
        } 
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
      });
  }

  restructureMenu = () => {
    var finalresult = [];

    var result = this.state.fetchedmenu.reduce(function(r, a) {
      r[a.category] = r[a.category] || [];
      r[a.category].push(a);
      return r;
    }, Object.create(null));

    for (var key in result) {
     
      var object = {
        category: key,
        menuitem: result[key]
      };

      finalresult.push(object);
    }

    this.setState({
      menu: finalresult,
      loading: false,
    })
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  //Toggle Modal///////////////////////////////////////////////////////////////////////

  toggleLiteInfoModal() {
    this.setState({
      liteInfoModalOpen: !this.state.liteInfoModalOpen,
    });
  }

  toggleMainInfoModal() {
    this.setState({
      mainInfoModalOpen: !this.state.mainInfoModalOpen,
    });
  }

  togglePreviewModal() {
    this.setState({
      previewModalOpen: !this.state.previewModalOpen,
    });
  }

  toggleNewItemModal() {
    this.setState({
      menuModalOpen: !this.state.menuModalOpen,
      updateItem: false,
      file: "",
      imagePreviewUrl: ""
    });
  }

  toggleDeleteItemModal() {
    this.setState({
      deleteModalOpen: !this.state.deleteModalOpen,
      deleteItemFunctionName: ''
    });
  }

  //Button Click Event///////////////////////////////////////////////////////////////////////

  navItemClicked = activeTab => {
    this.setState({
      activeTab: activeTab
    });
  };

  menuItemClicked = (parentIndex, childIndex) => {
    this.setState(
      {
        menuModalOpen: !this.state.menuModalOpen,
        updateItem: true,
        selectedItemId: this.state.menu[parentIndex].menuitem[childIndex]._id,
        selectedItemTitle: this.state.menu[parentIndex].menuitem[childIndex].title,
        selectedItemDescrip: this.state.menu[parentIndex].menuitem[childIndex].descrip,
        selectedItemPrice: this.state.menu[parentIndex].menuitem[childIndex].priceperunit,
        selectedCategoryName: this.state.menu[parentIndex].menuitem[childIndex].category,
        selectedMarkItemAs:
          typeof this.state.menu[parentIndex].menuitem[childIndex].markitem == "undefined"
            ? []
            : this.state.menu[parentIndex].menuitem[childIndex].markitem,
        imagePreviewUrl: 
          typeof this.state.menu[parentIndex].menuitem[childIndex].src == "undefined"
            ? ""
            : this.state.menu[parentIndex].menuitem[childIndex].src,
        file: "",
      },
      () => {this.clearFormFeedback()}
    );
  };

  addNewItemClicked = (parentIndex) => {
    this.setState(
      {
        menuModalOpen: !this.state.menuModalOpen,
        updateItem: false,
        selectedItemId: "",
        selectedItemTitle: "",
        selectedItemDescrip: "",
        selectedItemPrice: 0,
        selectedCategoryName: this.state.menu[parentIndex].category,
        selectedMarkItemAs:[],
        file: "",
        imagePreviewUrl: "",
      }, () => {this.clearFormFeedback()}
    )
  }

  clearFormFeedback = () => {
    this.setState(
      {
        isTitleEmpty: false,
        isDescripEmpty: false,
        isPriceEmpty: false,
      }
    )
  }

  deleteMenuItem = (_id) => {
    this.setState({
      deleteMenuID: _id,
      deleteModalOpen: !this.state.deleteModalOpen,
      deleteItemFunctionName: "deleteMenuItem"
    })
  }

  //Other functions///////////////////////////////////////////////////////////////////////

  scrollToMyRef = () => {
    this.myRef.current.scrollIntoView({ behavior: 'smooth' })
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

  checkInput = () => {
    const {
      selectedItemTitle,
      selectedItemDescrip,
      selectedItemPrice,
      selectedMarkItemAs,
      selectedItemId,
      selectedCategoryName,
      updateItem,
      file,
    } = this.state;

    if (selectedItemTitle === "") {
      this.setState({
        isTitleEmpty: true
      });
    } else if (selectedItemDescrip === "") {
      this.setState({
        isDescripEmpty: true
      });
    }
    else {
      if (updateItem) {

        this.setState({
          isSaving: true
        })

        //Update Item
        var slicedMenu = this.state.fetchedmenu.slice();
        var index = slicedMenu.findIndex(x => x._id == selectedItemId);
        var menuItemJson = JSON.parse(JSON.stringify(slicedMenu[index]));
      
        let formData = new FormData();    //formdata object
        formData.append('title', selectedItemTitle);
        formData.append('descrip', selectedItemDescrip);
        formData.append('priceperunit', selectedItemPrice);
        if (file !== "") {
          formData.append('files', file);
        }
        
        if (selectedMarkItemAs.length > 0) {
          formData.append('markitem', JSON.stringify(selectedMarkItemAs));
        }

        var headers = {
          'Content-Type': 'application/json',
        }

        var url = apis.UPDATElunchmenu + "?_id=" + menuItemJson._id;

        axios.put(url, formData, {withCredentials: true}, {headers: headers})
          .then((response) => {
            if (response.status === 201) {
              this.setState({
                menuModalOpen: !this.state.menuModalOpen,
                isSaving: false,
              }, () => {
                toast(<SuccessInfo/>, {
                  position: toast.POSITION.BOTTOM_RIGHT
                });
                  this.getCatererLunchMenu();
              })
            } 
          })
          .catch((error) => {
            this.setState({
              menuModalOpen: !this.state.menuModalOpen
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
        formData.append('category', selectedCategoryName);
        formData.append('descrip', selectedItemDescrip);
        formData.append('priceperunit', selectedItemPrice);
        if (file !== "") {
          formData.append('files', file);
        }

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
                menuModalOpen: !this.state.menuModalOpen,
                isSaving: false,
              }, () => {
                toast(<SuccessInfo/>, {
                  position: toast.POSITION.BOTTOM_RIGHT
                });
                this.getCatererLunchMenu()
              })
            } 
          })
          .catch((error) => {
            this.setState({
              menuModalOpen: !this.state.menuModalOpen
            }, () => {
              toast(<ErrorInfo/>, {
                position: toast.POSITION.BOTTOM_RIGHT
              });
            })
          });
      }
    }
  };

  gotoPublish = () => {
    this.props.history.push("/caterer/publish/publish")
  }

  //Handle Input Change//////////////////////////////////////////////////////////////////////

  
  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  removePhoto = () => {
    this.setState({
      file: "",
      imagePreviewUrl: ""
    });
  }

  handleCheckBoxChange = (e, markeditem) => {
    var selectedMarkItemAs = this.state.selectedMarkItemAs.slice();
    var index = selectedMarkItemAs.findIndex(x => x == markeditem);

    //If selectedmarkitem exist
    if (index >= 0) {
      selectedMarkItemAs.splice(index, 1);
    }
    //If selectedmarkitem not exist
    else {
      selectedMarkItemAs.push(markeditem);
    }

    this.setState({
      selectedMarkItemAs: selectedMarkItemAs
    });
  };

  handleTitleChange(e) {
    this.setState({
      selectedItemTitle: e.target.value
    });
  }

  handleDescripChange(e) {
    this.setState({
      selectedItemDescrip: e.target.value
    });
  }

  handlePriceChange(e, value) {
    this.setState({
      selectedItemPrice: Number(value).toFixed(2)
    });
  }

  //Render functions///////////////////////////////////////////////////////////////////////

  renderNavItem(menutitle) {
    return (
      <NavItem style={{width: '50%'}}>
        <NavLink
          onClick={() => this.navItemClicked(menutitle)}
          style={{
            paddingRight: 20,
            paddingLeft: 20,
            fontWeight: "600",
            fontSize: 18,
            letterSpacing: 1.5,
            color: this.state.activeTab === menutitle ? "#20a8d8" : "black",
            textAlign: 'center',
          }}
          href="#"
        >
          {" "}
          {menutitle}
        </NavLink>
        <div
          style={{
            height: 2,
            width: "100%",
            backgroundColor:
              this.state.activeTab === menutitle ? "#20a8d8" : "transparent"
          }}
        />
      </NavItem>
    );
  }

  renderNav() {
    var totaltabsarray = [];
    for (let i = 0; i < this.state.menutitle.length; i++) {
      totaltabsarray.push(this.renderNavItem(this.state.menutitle[i]));
    }
    return (
      <Nav style={{ padding: 20, backgroundColor: 'white', width: '100%' }} className="float-left" pills>
        {totaltabsarray}
      </Nav>
    );
  }

  renderTabPane() {
    var tabarray = [];

    var menutitle = this.state.menutitle;

    for (let i = 0; i < menutitle.length; i++) {
      tabarray.push(
        <TabPane tabId={menutitle[i]}>
          <Row>
            <Col xs="12">
              <Button
                block = {this.state.isMobile? true :false}
                style={{ fontSize: 17, fontWeight: "600", marginBottom:20, backgroundColor: "#FF5722", color: 'white' }}
                onClick={() => this.gotoPublish()}
                className="float-left"
              >
                <i className="fa fa-rocket fa-1x" aria-hidden="true" />
                &nbsp; Publish
              </Button>
            </Col>
            <Col xs="12">
              {i === 0 ? 
              <span style={{color: 'black', fontSize: 15, fontWeight: '500', opacity: 0.7, letterSpacing: 0.8}}>
                <img style={{ marginRight: 10, height: 20, width: 20, objectFit: "cover" }} src="https://img.icons8.com/ios/50/000000/info.png" alt=""/>
                Lite menus typically range between €6 to €9. Example menus are: Salads, Sandwiches, Wok Dishes.
                <Button color="link" onClick={this.toggleLiteInfoModal} style={{ marginLeft:10, padding:0, paddingBottom:5, fontSize:15, letterSpacing: 0.8, fontWeight: '500', color: "#0b77db" }} >
                  Learn more
                </Button>
              </span>
              :
              <span style={{color: 'black', fontSize: 15, fontWeight: '500', opacity: 0.7, letterSpacing: 0.8}}>
                <img style={{ marginRight: 10, height: 20, width: 20, objectFit: "cover" }} src="https://img.icons8.com/ios/50/000000/info.png" alt=""/>
                Main menus normally range between €10 to €14. 
                <Button color="link" onClick={this.toggleMainInfoModal} style={{ marginLeft:10, padding:0, paddingBottom:5, fontSize:15, letterSpacing: 0.8, fontWeight: '500', color: "#0b77db" }} >
                  Learn more
                </Button>
              </span>
              }
            </Col>
            <Col style={{marginTop: 20}} xs="12">{this.state.loading ? this.renderLoadingItems() : this.state.menu.length > 0 ? this.renderCategoryItems(this.state.menu[i].menuitem, i) : null}</Col>
          </Row>
        </TabPane>
      );
    }

    return (
      <TabContent
        style={{
          borderWidth: 0,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 0
        }}
        activeTab={this.state.activeTab}
      >
        {tabarray}
      </TabContent>
    );
  }


  renderCategoryItems(items, parentIndex) {
    var itemsarray = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].title !== "") {
        itemsarray.push(
          <Col xs="12" sm="6" md="6" lg="4">
            <Card className="card-1">
              <CardBody
                style={{
                  cursor: "pointer",
                  marginTop: 0,
                  marginBottom: 10,
                  padding: 0,
                  height: "100%"
                }}
                onClick={() => this.menuItemClicked(parentIndex,i)}
              >
                <Col>
                  <div class="row">
                    {items[i].src ?
                      <Col style={{padding:0}} xs="12">
                        <div style={{ objectFit:'cover', width: 'auto', height: 150, }}>
                          <img style={{ objectFit:'cover', width: '100%', height: '100%', }} src={items[i].src}/>
                        </div>
                      </Col>
                      :
                      null
                    }
            
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
                  <div class="row">
                    {typeof items[i].markitem === "undefined"
                      ? null
                      : this.renderMarkAsIcon(items[i].markitem)}
                  </div>
     
                  <div style={{ marginTop: 10 }}>
                    <Dotdotdot clamp={2}>
                      <p style={{ cursor: "pointer", overflow: "hidden" }}>
                        {items[i].descrip}
                      </p>
                    </Dotdotdot>
                  </div>
                  <div class="row" style={{ marginTop: 10, }}>
                    <Label
                      style={{
                        cursor: "pointer",
                        marginLeft: 15, 
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
        {this.renderEmptyItem(parentIndex)}
      </Row>
    );
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

  renderEmptyItem(parentIndex) {
    return (
      <Col xs="12" sm="6" md="6" lg="4">
        <Card
          style={{ cursor: "pointer", borderStyle: "dashed", borderWidth: 2 }}
          onMouseOver=""
          onClick={() => this.addNewItemClicked(parentIndex)}
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
                <div class="col" style={{ textAlign: "center" }}>
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

  renderForm() {
    var selectedItemTitle = this.state.selectedItemTitle;
    var selectedItemDescrip = this.state.selectedItemDescrip;
    var selectedItemPrice = this.state.selectedItemPrice;
    var selectedMarkItemAs = this.state.selectedMarkItemAs;
    const { imagePreviewUrl } = this.state;
  
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
            <FormFeedback>Please input only jpg / png format</FormFeedback>
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
        <Col xs="6">
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

  //Render Modal///////////////////////////////////////////////////////////////////////
  
  renderLiteLunchInfoModal() {

    return (
      <Modal    
        toggle={this.toggleLiteInfoModal}
        isOpen={this.state.liteInfoModalOpen} >

        <ModalHeader toggle={this.toggleLiteInfoModal}>
          Lite Lunch
        </ModalHeader>
        <ModalBody style={{paddingTop: 0, marginTop: 0, paddingLeft: 0, paddingRight: 20}}>
 
          <Table borderless style={{ marginLeft: 10, marginRight: 10, marginTop: 20}}>
            <tbody>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={saladIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>Lite lunch menus are typically range between €6 to €9.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={commissionIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>FoodieBee charge a <b style={{color: 'green'}}>15%</b> commission on each order.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={primeIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>Prime subscribed customers will enjoy the lunch at €6 once per day except for weekends.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={small_commissionIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>FoodieBee will only charge <b style={{color: 'green'}}>5%</b> commission on each order by Prime subscribed customers.</p></td>
              </tr>
            </tbody>
          </Table>

          <div style={{textAlign: 'center', color: 'white',}}>
            <Button onClick={this.toggleLiteInfoModal} style={{fontSize: 15, height: 50, marginTop: 10, marginBottom: 10,}} className="bg-primary" color="primary">Got It</Button>
          </div>

        </ModalBody>
      </Modal>
    )
  }

  renderMainLunchInfoModal() {

    return (
      <Modal    
        toggle={this.toggleMainInfoModal}
        isOpen={this.state.mainInfoModalOpen} >

        <ModalHeader toggle={this.toggleMainInfoModal}>
          Main Lunch
        </ModalHeader>
        <ModalBody style={{paddingTop: 0, marginTop: 0, paddingLeft: 0, paddingRight: 20}}>
 
          <Table borderless style={{ marginLeft: 10, marginRight: 10, marginTop: 20}}>
            <tbody>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={mainlunchIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>Main lunch menus are typically range between €10 to €14.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={commissionIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>FoodieBee charge a <b style={{color: 'green'}}>15%</b> commission on each order.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={primeIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>Prime subscribed customers will enjoy the lunch at €10 once per day except for weekends.</p></td>
              </tr>
              <tr>
                <td><img style={ { objectFit:'cover', marginTop:5, width: 35, height: 35 }} src={small_commissionIcon} alt=""/></td>
                <td style={{fontSize: 15}}><p style={{opacity: 0.8}}>FoodieBee will only charge <b style={{color: 'green'}}>5%</b> commission on each order by Prime subscribed customers.</p></td>
              </tr>
            </tbody>
          </Table>

          <div style={{textAlign: 'center', color: 'white',}}>
            <Button onClick={this.toggleMainInfoModal} style={{fontSize: 15, height: 50, marginTop: 10, marginBottom: 10,}} className="bg-primary" color="primary">Got It</Button>
          </div>

        </ModalBody>
      </Modal>
    )
  }

  renderAddNewItemModal() {
    return (
      <Modal isOpen={this.state.menuModalOpen} toggle={this.toggleNewItemModal}>
        <ModalHeader toggle={this.toggleNewItemModal}>{this.state.updateItem ? "Edit Item" : "Add New Item"}</ModalHeader>
        <ModalBody>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => this.checkInput()} color="primary" disabled={this.state.isSaving ? true : false}>
            {this.state.updateItem ? this.state.isSaving ? "Saving" : "Save" : this.state.isSaving ? "Adding..." : "Add"}
          </Button>
          <Button color="danger" onClick={() => this.deleteMenuItem(this.state.selectedItemId)} disabled={this.state.isSaving ? true : false}>
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  renderDeleteItemModal() {
    var title ;
    var descrip;

    if (this.state.deleteItemFunctionName === 'deleteMenuItem') {
      title = "Delete Item";
      descrip = "Are you sure you want to delete this item from menu? Deleted items are not able to recovered."
    }
    
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

  deleteButtonPressed = () => {

    var deleteItemFunctionName = this.state.deleteItemFunctionName;

    var headers = {
      'Content-Type': 'application/json',
    }

    var del_menu_url = "";
    var del_menu_published_url = "";

    if (deleteItemFunctionName === 'deleteMenuItem') {
      del_menu_url = apis.DELETElunchmenu + "?_id=" + this.state.deleteMenuID;
      del_menu_published_url = apis.DELETElunchmenuPublished + "?_id=" + this.state.deleteMenuID;

      axios.all([
        axios.delete(del_menu_url),
        axios.delete(del_menu_published_url)
      ])
      .then(axios.spread((response,response_pub) => {
        if (response.status === 200 && response_pub.status === 200) {
          toast(<SuccessDelete/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            deleteModalOpen: false,
            menuModalOpen: false,
          }, () => {
              this.getCatererLunchMenu()
          })
        }
        else {
          this.setState({
            deleteModalOpen: false,
            menuModalOpen: false,
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

  render() {
    return (
      <div style={{ backgroundColor: "transparent" }} className="animated fadeIn">
        <Row style={{ marginBottom: 30 }}>
          <Col xs="12">{this.renderNav()}</Col>
          <Col xs="12">{this.renderTabPane()}</Col>
        </Row>

        <div ref={this.myRef} style={{backgroundColor: 'transparent', height:1, width: '100%'}}></div>

        {this.renderAddNewItemModal()}

        {this.renderDeleteItemModal()}

        {this.renderLiteLunchInfoModal()}

        {this.renderMainLunchInfoModal()}

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

const SuccessDelete = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Deleted</b>
   
  </div>
)

const ErrorDelete = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error deleting data. Please try again</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error saving data. Please try again</b>
   
  </div>
)

export default MenuSetup;
