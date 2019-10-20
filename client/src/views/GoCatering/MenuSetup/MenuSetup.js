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
  InputGroupText
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

class MenuSetup extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleNewCategoryModal = this.toggleNewCategoryModal.bind(this);
    this.togglePreviewModal = this.togglePreviewModal.bind(this);
    this.toggleNewItemModal = this.toggleNewItemModal.bind(this);
    this.toggleDeleteItemModal = this.toggleDeleteItemModal.bind(this);
    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
    this.addNewMenuCategory = this.addNewMenuCategory.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescripChange = this.handleDescripChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleMinQuantityChange = this.handleMinQuantityChange.bind(this);
    this.handleServeChange = this.handleServeChange.bind(this);
    this.handleSelectionCategoryChange = this.handleSelectionCategoryChange.bind(
      this
    );
    this.handleSelectionMaxNumChange = this.handleSelectionMaxNumChange.bind(
      this
    );
    this.handleSelectionItemTitleChange = this.handleSelectionItemTitleChange.bind(
      this
    );
    this.handleSelectionItemPriceChange = this.handleSelectionItemPriceChange.bind(
      this
    );

    this.myRef = React.createRef()   // Create a ref object 
    this.inputOpenFileRef = React.createRef()

    this.state = {
      isSaving: false,
      loading: true,
      isMobile: false,
      file: '',
      imagePreviewUrl: '',
      activeTab: "Appetizer",
      menutitle: [
        "Appetizer",
        "Breakfast",
        "Sandwiches",
        "Salads",
        "Entrees",
        "Main",
        "Pizza",
        "Sides",
        "Desserts",
        "Beverages"
      ],
      markitem: [
        "Hot",
        "Spicy",
        "Halal",
        "Gluten Free",
        "Vegetarian",
        "Healthy"
      ],
      servecount: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100
      ],
      fetchedmenu: [
        /*{
          _id: "1",
          title: "Hot Dog",
          categoryname: "Appetizer",
          categorytag: "Appetizer",
          descrip:
            "Tomato sauce, oregano, mozzarella and fresh basil. Home made hot dog with extra cheese plus toppings such as garlic dips",
          dishtype: "single",
          serveperunit: 1,
          minimumquantity: 1,
          markitem: ["Hot", "Spicy"],
          priceperunit: 4.5,
          selection: [
            {
              selectioncategory: "Starter",
              selectionmaxnum: 2,
              selectionitem: [
                {
                  selectionitemtitle: "Pork Rib",
                  selectionitemprice: 2.0
                },
                {
                  selectionitemtitle: "Sring Roll",
                  selectionitemprice: 1.0
                },
                {
                  selectionitemtitle: "Fried Ball",
                  selectionitemprice: 1.0
                },
                {
                  selectionitemtitle: "Hot n Sour Soup",
                  selectionitemprice: 1.5
                }
              ]
            },
            {
              selectioncategory: "Bread",
              selectionmaxnum: 1,
              selectionitem: [
                {
                  selectionitemtitle: "Pita Bread",
                  selectionitemprice: 0.0
                },
                {
                  selectionitemtitle: "Tortilla Bread",
                  selectionitemprice: 0.0
                }
              ]
            }
          ]
        },
        {
          _id: "2",
          title: "Breakfast Prosciutto",
          categoryname: "Appetizer",
          categorytag: "Appetizer",
          descrip: "Tomato sauce, mozzarella, prosciutto",
          dishtype: "bulk",
          serveperunit: 6,
          minimumquantity: 1,
          markitem: ["Halal", "Healthy"],
          priceperunit: 28.0,
          selection: [
            {
              selectioncategory: "Roll",
              selectionmaxnum: 1,
              selectionitem: [
                {
                  selectionitemtitle: "Baguette",
                  selectionitemprice: 1.0
                },
                {
                  selectionitemtitle: "Sandwich",
                  selectionitemprice: 1.0
                }
              ]
            }
          ]
        },
        {
          _id: "3",
          title: "Meatball with Swedish Pork Rib",
          categoryname: "Appetizer",
          categorytag: "Appetizer",
          descrip: "Tomato sauce, mozzarella, prosciutto",
          dishtype: "bulk",
          serveperunit: 4,
          minimumquantity: 1,
          markitem: [],
          priceperunit: 15.0,
          selection: []
        },
        {
          _id: "4",
          title: "Fried Rice Ball",
          categoryname: "Appetizer",
          categorytag: "Appetizer",
          descrip: "Golden fried rice ball with tomato sauce dip",
          dishtype: "bulk",
          serveperunit: 4,
          minimumquantity: 1,
          markitem: ["Vegetarian", "Hot"],
          priceperunit: 15.0,
          selection: []
        },
        {
          _id: "5",
          title: "Tortilla Wrap",
          categoryname: "Morning wraps",
          categorytag: "Appetizer",
          descrip: "Tomato sauce, oregano, mozzarella and fresh basil",
          dishtype: "bulk",
          serveperunit: 4,
          minimumquantity: 2,
          markitem: ["Hot"],
          priceperunit: 12.0,
          selection: []
        },
        {
          _id: "6",
          title: "Mexican Burrito",
          categoryname: "Morning wraps",
          categorytag: "Appetizer",
          descrip: "Tomato sauce, mozzarella, prosciutto",
          dishtype: "single",
          serveperunit: 1,
          minimumquantity: 4,
          markitem: ["Spicy", "Hot"],
          priceperunit: 5.0,
          selection: []
        },
        {
          _id: "7",
          title: "Cheese Egg",
          categoryname: "Supa Breakfast",
          categorytag: "Breakfast",
          descrip:
            "Tomato sauce, oregano, mozzarella and fresh basil. Home made hot dog with extra cheese plus toppings such as garlic dips",
          dishtype: "bulk",
          serveperunit: 4,
          minimumquantity: 1,
          markitem: ["Hot", "Spicy"],
          priceperunit: 10.0,
          selection: []
        },
        {
          _id: "8",
          title: "English Breakfast with Tea",
          categoryname: "Supa Breakfast",
          categorytag: "Breakfast",
          descrip: "Tomato sauce, mozzarella, prosciutto",
          dishtype: "bulk",
          serveperunit: 6,
          minimumquantity: 1,
          markitem: ["Hot", "Healthy"],
          priceperunit: 22.0,
          selection: []
        }*/
      ],
      menu: [
        /*{
          menutitle: "Appetizer",
          menuitem: [
            {
              categoryname: "Appetizer",
              items: [
                {
                  title: "Hot Dog",
                  descrip:
                    "Tomato sauce, oregano, mozzarella and fresh basil. Home made hot dog with extra cheese plus toppings such as garlic dips",
                  dishtype: "single",
                  serveperunit: 1,
                  minimumquantity: 1,
                  markitem: ["Hot", "Spicy"],
                  priceperunit: 4.50,
                  selection: [
                    {
                      selectioncategory: "Starter",
                      selectionmaxnum: 2,
                      selectionitem: [
                        {
                          selectionitemtitle: "Pork Rib",
                          selectionitemprice: 2.00
                        },
                        {
                          selectionitemtitle: "Sring Roll",
                          selectionitemprice: 1.00
                        },
                        {
                          selectionitemtitle: "Fried Ball",
                          selectionitemprice: 1.00
                        },
                        {
                          selectionitemtitle: "Hot n Sour Soup",
                          selectionitemprice: 1.50
                        }
                      ]
                    },
                    {
                      selectioncategory: "Bread",
                      selectionmaxnum: 1,
                      selectionitem: [
                        {
                          selectionitemtitle: "Pita Bread",
                          selectionitemprice: 0.00
                        },
                        {
                          selectionitemtitle: "Tortilla Bread",
                          selectionitemprice: 0.00
                        }
                      ]
                    }
                  ],
                },
                {
                  title: "Breakfast Prosciutto",
                  descrip: "Tomato sauce, mozzarella, prosciutto",
                  dishtype: "bulk",
                  serveperunit: 6,
                  minimumquantity: 1,
                  markitem: ["Halal", "Healthy"],
                  priceperunit: 28.00,
                 
                },
                {
                  title: "Meatball with Swedish Pork Rib",
                  descrip: "Tomato sauce, mozzarella, prosciutto",
                  dishtype: "bulk",
                  serveperunit: 4,
                  minimumquantity: 1,
                  markitem: [],
                  priceperunit: 15.00,
                  selection: [],
                },
                {
                  title: "Fried Rice Ball",
                  descrip: "Golden fried rice ball with tomato sauce dip",
                  dishtype: "bulk",
                  serveperunit: 4,
                  minimumquantity: 1,
                  markitem: ["Vegetarian", "Hot"],
                  priceperunit: 15.00,
                  selection: [],
                }
              ]
            },
            {
              categoryname: "Morning Wraps",
              items: [
                {
                  title: "Tortilla Wraps",
                  descrip: "Tomato sauce, oregano, mozzarella and fresh basil",
                  dishtype: "bulk",
                  serveperunit: 4,
                  minimumquantity: 2,
                  markitem: ["Hot"],
                  priceperunit: 12.00,
                  selection: [],
                },
                {
                  title: "Mexican Bagel",
                  descrip: "Tomato sauce, mozzarella, prosciutto",
                  dishtype: "single",
                  serveperunit: 1,
                  minimumquantity: 4,
                  markitem: ["Spicy", "Hot"],
                  priceperunit: 5.00,
                  selection: [],
                }
              ]
            }
          ]
        },
        {
          menutitle: "Breakfast",
          menuitem: [
            {
              categoryname: "Supa Breakfast",
              items: [
                {
                  title: "Cheese Egg",
                  descrip:
                    "Tomato sauce, oregano, mozzarella and fresh basil. Home made hot dog with extra cheese plus toppings such as garlic dips",
                  dishtype: "bulk",
                  serveperunit: 4,
                  minimumquantity: 1,
                  markitem: ["Hot", "Spicy"],
                  priceperunit: 10.00,
                  selection: [],
                },
                {
                  title: "English Breakfast with Tea",
                  descrip: "Tomato sauce, mozzarella, prosciutto",
                  dishtype: "bulk",
                  serveperunit: 6,
                  minimumquantity: 1,
                  markitem: ["Hot", "Healthy"],
                  priceperunit: 22.00,
                  selection: [],
                }
              ]
            }
          ]
        }*/
      ],
      menuModalOpen: false,
      previewModalOpen: false,
      categoryModal: false,
      updateCategory: false,
      selectionModal: false,
      deleteModalOpen: false,
      updateItem: false,
      newMenuCategoryName: "",
      oldMenuCategoryName: "",
      deleteMenuCategoryName: "",
      deleteMenuID: "",
      selectedDishType: "",
      selectedItemTitle: "",
      isTitleEmpty: false,
      selectedItemDescrip: "",
      isDescripEmpty: false,
      selectedItemPrice: 0,
      isPriceEmpty: false,
      selectedItemServe: 1,
      isServeEmpty: false,
      selectedItemMinimumQuantity: 1,
      isMinimumQuantityEmpty: false,
      selectedItemSelection: [],
      isItemSelectionEmpty: false,
      selectedMarkItemAs: [],
      selectedItemId: "",
      selectedCategoryName: "",
      selectedCategoryTag: "",
      toBeReplaceItemArray: [],
      deleteItemFunctionName: "",
    };
  }

  componentDidMount() {

    this.getCatererMenu();
    
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


  getCatererMenu= () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETmenu;

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
      r[a.categorytag] = r[a.categorytag] || [];
      r[a.categorytag].push(a);
      return r;
    }, Object.create(null));

    for (var key in result) {
      var result2 = result[key].reduce(function(r, a) {
        r[a.categoryname] = r[a.categoryname] || [];
        r[a.categoryname].push(a);
        return r;
      }, Object.create(null));

      var parentObject = {
        menutitle: key,
        menuitem: []
      };

      for (var key2 in result2) {
        var childObject = {
          categoryname: key2,
          items: result2[key2]
        };
        parentObject["menuitem"].push(childObject);
      }

      finalresult.push(parentObject);
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

  toggleSelection = index => {
    var selectedSelectionArray = this.state.selectedItemSelection.slice();
    var selectedSelectionJson = JSON.parse(
      JSON.stringify(selectedSelectionArray[index])
    );

    if (typeof selectedSelectionJson.selectionisOpen === "undefined") {
      selectedSelectionJson.selectionisOpen = true;
    } else {
      selectedSelectionJson.selectionisOpen = !selectedSelectionJson.selectionisOpen;
    }

    selectedSelectionArray.splice(index, 1, selectedSelectionJson);

    this.setState({
      selectedItemSelection: selectedSelectionArray
    });
  };

  //Toggle Modal///////////////////////////////////////////////////////////////////////

  toggleNewCategoryModal() {
    this.setState({
      categoryModal: !this.state.categoryModal,
      newMenuCategoryName: "",
      oldMenuCategoryName: "",
      updateCategory: false
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
      toBeReplaceItemArray: [],
      deleteItemFunctionName: ''
    });
  }

  //Button Click Event///////////////////////////////////////////////////////////////////////

  navItemClicked = activeTab => {
    this.setState({
      activeTab: activeTab
    });
  };

  selectDishType = selectedDishType => {
    this.setState({
      selectedDishType: selectedDishType
    });
  };

  menuItemClicked = _id => {

    var itemindex = this.state.fetchedmenu.findIndex(x => x._id == _id);

    if (itemindex >= 0) {
      this.setState(
        {
          menuModalOpen: !this.state.menuModalOpen,
          updateItem: true,
          selectedItemId: this.state.fetchedmenu[itemindex]._id,
          selectedDishType: this.state.fetchedmenu[itemindex].dishtype,
          selectedItemTitle: this.state.fetchedmenu[itemindex].title,
          selectedItemDescrip: this.state.fetchedmenu[itemindex].descrip,
          selectedItemPrice: this.state.fetchedmenu[itemindex].priceperunit,
          selectedItemServe: this.state.fetchedmenu[itemindex].serveperunit,
          selectedItemMinimumQuantity: this.state.fetchedmenu[itemindex].minimumquantity,
          selectedCategoryName: this.state.fetchedmenu[itemindex].categoryname,
          selectedCategoryTag: this.state.fetchedmenu[itemindex].categorytag,
          selectedItemSelection:
            typeof this.state.fetchedmenu[itemindex].selection == "undefined"
              ? []
              : this.state.fetchedmenu[itemindex].selection,
          selectedMarkItemAs:
            typeof this.state.fetchedmenu[itemindex].markitem == "undefined"
              ? []
              : this.state.fetchedmenu[itemindex].markitem,
          imagePreviewUrl: 
            typeof this.state.fetchedmenu[itemindex].src == "undefined"
              ? ""
              : this.state.fetchedmenu[itemindex].src,
        },
        () => {this.clearFormFeedback()}
      );
    }
  };

  addNewItemClicked = (menutitle, categoryname) => {
    this.setState(
      {
        menuModalOpen: !this.state.menuModalOpen,
        updateItem: false,
        selectedItemId: "",
        selectedDishType: "",
        selectedItemTitle: "",
        selectedItemDescrip: "",
        selectedItemPrice: 0,
        selectedItemServe: 1,
        selectedItemMinimumQuantity: 1,
        selectedCategoryName: categoryname,
        selectedCategoryTag: menutitle,
        selectedItemSelection: [],
        selectedMarkItemAs:[],
      }, () => {this.clearFormFeedback()}
    )
  }

  clearFormFeedback = () => {
    this.setState(
      {
        isTitleEmpty: false,
        isDescripEmpty: false,
        isPriceEmpty: false,
        isServeEmpty: false,
        isMinimumQuantityEmpty: false,
        isItemSelectionEmpty: false,
      }
    )
  }

  saveMenuCategoryName = () => {

    this.setState({
      isSaving: true
    })

    var newcategoryname = this.state.newMenuCategoryName;
    var oldcategoryname = this.state.oldMenuCategoryName;

    var headers = {
      'Content-Type': 'application/json',
    }

    var updateData = {
      categoryname: newcategoryname
    }

    var url = apis.BULKUPDATEmenu + "?categoryname=" + oldcategoryname;

    axios.put(url, updateData, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          this.setState({
            categoryModal: false,
            isSaving: false
          }, () => {
              this.getCatererMenu()
          })
        } 
      })
      .catch((error) => {
      });
  }

  editMenuCategoryName = (categoryname) => {
    this.setState({
      categoryModal: !this.state.categoryModal,
      newMenuCategoryName: categoryname,
      oldMenuCategoryName: categoryname,
      updateCategory: true
    })
  }

  addNewMenuCategory() {

    var menuarray = this.state.menu;
    var menuindex = menuarray.findIndex(
      x => x.menutitle == this.state.activeTab
    );

    var addItem = {
      categoryname: this.state.newMenuCategoryName,
      items: []
    };

    if (menuindex >= 0) {
      menuarray[menuindex].menuitem.push(addItem);
    } else {
      var addMenu = {
        menutitle: this.state.activeTab,
        menuitem: [addItem]
      };
      menuarray.push(addMenu);
    }

    this.setState({
      menu: menuarray,
      categoryModal: !this.state.categoryModal
    },() => {
      setTimeout(function() { 
        //Start the timer
        this.scrollToMyRef()
      }.bind(this), 500)
    })
  }

  deleteMenuCategory = (categoryname) => {
    this.setState({
      deleteMenuCategoryName: categoryname,
      deleteModalOpen: !this.state.deleteModalOpen,
      deleteItemFunctionName: "deleteMenuCategory"
    })
  }

  deleteMenuItem = (_id) => {
    this.setState({
      deleteMenuID: _id,
      deleteModalOpen: !this.state.deleteModalOpen,
      deleteItemFunctionName: "deleteMenuItem"
    })
  }

  addNewSelectionCategory = () => {
    var selectedItemSelection = this.state.selectedItemSelection.slice();
    var newitem = {
      selectionitemtitle: "",
      selectionitemprice: 0
    };
    var newSelectionItem = {
      selectioncategory: "",
      selectionmaxnum: 1,
      selectionisOpen: true,
      selectionitem: [newitem]
    };
    //If selection existed
    if (selectedItemSelection !== null) {
      selectedItemSelection.push(newSelectionItem);
    } else if (selectedItemSelection === null) {
      selectedItemSelection = [newSelectionItem];
    }

    this.setState({
      selectedItemSelection: selectedItemSelection
    });
  };

  deleteSelectionCategory = index => {
    var selectedItemSelection = this.state.selectedItemSelection.slice();
    selectedItemSelection.splice(index, 1);

    this.setState({
      toBeReplaceItemArray: selectedItemSelection,
      deleteModalOpen: !this.state.deleteModalOpen,
      deleteItemFunctionName: "deleteSelectionCategory"
    });
  };

  addNewSelectionItem = outerindex => {
    var selectedItemSelection = this.state.selectedItemSelection.slice();
    var selectedSelectionJson = JSON.parse(
      JSON.stringify(selectedItemSelection[outerindex])
    );

    var newitem = {
      selectionitemtitle: "",
      selectionitemprice: 0
    };

    selectedSelectionJson.selectionitem.push(newitem);
    selectedItemSelection.splice(outerindex, 1, selectedSelectionJson);

    this.setState({
      selectedItemSelection: selectedItemSelection
    });
  };

  deleteSelectionItem = (outerindex, innerindex) => {
    var selectedItemSelection = this.state.selectedItemSelection.slice();
    var selectedSelectionJson = JSON.parse(
      JSON.stringify(selectedItemSelection[outerindex])
    );

    selectedSelectionJson.selectionitem.splice(innerindex, 1);
    selectedItemSelection.splice(outerindex, 1, selectedSelectionJson);

    this.setState({
      toBeReplaceItemArray: selectedItemSelection,
      deleteModalOpen: !this.state.deleteModalOpen,
      deleteItemFunctionName: "deleteSelectionItem"
    });
  };

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
      selectedDishType,
      selectedItemTitle,
      selectedItemDescrip,
      selectedItemPrice,
      selectedItemServe,
      selectedItemMinimumQuantity,
      selectedItemSelection,
      selectedMarkItemAs,
      selectedItemId,
      selectedCategoryName,
      selectedCategoryTag,
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
    } else if (this.checkSelection() === true) {
      this.setState({
        isItemSelectionEmpty: true
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
        formData.append('dishtype', selectedDishType);
        formData.append('serveperunit', selectedItemServe);
        formData.append('minimumquantity', selectedItemMinimumQuantity);
        formData.append('priceperunit', selectedItemPrice);
        if (file !== "") {
          formData.append('files', file);
        }
        if (selectedItemSelection.length > 0) {
          formData.append('selection', JSON.stringify(selectedItemSelection));
        }

        if (selectedMarkItemAs.length > 0) {
          formData.append('markitem', JSON.stringify(selectedMarkItemAs));
        }

        var headers = {
          'Content-Type': 'application/json',
        }

        var url = apis.UPDATEmenu + "?_id=" + menuItemJson._id;

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
                  this.getCatererMenu();
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
        formData.append('categoryname', selectedCategoryName);
        formData.append('categorytag', selectedCategoryTag);
        formData.append('descrip', selectedItemDescrip);
        formData.append('dishtype', selectedDishType);
        formData.append('serveperunit', selectedItemServe);
        formData.append('minimumquantity', selectedItemMinimumQuantity);
        formData.append('priceperunit', selectedItemPrice);
        if (file !== "") {
          formData.append('files', file);
        }
        if (selectedItemSelection.length > 0) {
          formData.append('selection', JSON.stringify(selectedItemSelection));
        }

        if (selectedMarkItemAs.length > 0) {
          formData.append('markitem', JSON.stringify(selectedMarkItemAs));
        }

        var headers = {
          'Content-Type': 'application/json',
        }

        var url = apis.ADDmenu ;

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
                this.getCatererMenu()
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
  
  checkSelection = () => {
    const { selectedItemSelection } = this.state;
    var selectedSelectionArray = selectedItemSelection.slice();

    for (let i = 0; i < selectedSelectionArray.length; i++) {
      if (selectedSelectionArray[i].selectioncategory === "") {
        return true;
      }
      var selectedSelectionItemArray = selectedSelectionArray[
        i
      ].selectionitem.slice();
      for (let x = 0; x < selectedSelectionItemArray.length; x++) {
        if (selectedSelectionItemArray[x].selectionitemtitle === "") {
          return true;
        }
      }
    }
    return false;
  };

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

  handleCategoryNameChange(e) {
    this.setState({ newMenuCategoryName: e.target.value });
  }

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

  handleMinQuantityChange(e) {
    this.setState({
      selectedItemMinimumQuantity: e.target.value
    });
  }

  handleServeChange(e) {
    this.setState({
      selectedItemServe: e.target.value
    });
  }

  handleSelectionCategoryChange(e, index) {
    var selectedSelectionArray = this.state.selectedItemSelection.slice();
    var selectedSelectionJson = JSON.parse(
      JSON.stringify(selectedSelectionArray[index])
    );

    if (typeof selectedSelectionJson.selectioncategory === "undefined") {
      selectedSelectionJson.selectioncategory = e.target.value;
    } else {
      selectedSelectionJson.selectioncategory = e.target.value;
    }

    selectedSelectionArray.splice(index, 1, selectedSelectionJson);

    this.setState({
      selectedItemSelection: selectedSelectionArray
    });
  }

  handleSelectionMaxNumChange(e, index) {
    var selectedSelectionArray = this.state.selectedItemSelection.slice();
    var selectedSelectionJson = JSON.parse(
      JSON.stringify(selectedSelectionArray[index])
    );

    if (typeof selectedSelectionJson.selectionmaxnum === "undefined") {
      selectedSelectionJson.selectionmaxnum = e.target.value;
    } else {
      selectedSelectionJson.selectionmaxnum = e.target.value;
    }

    selectedSelectionArray.splice(index, 1, selectedSelectionJson);

    this.setState({
      selectedItemSelection: selectedSelectionArray
    });
  }

  handleSelectionItemTitleChange(e, outerindex, innerindex) {
    var selectedSelectionArray = this.state.selectedItemSelection.slice();
    var selectedSelectionJson = JSON.parse(
      JSON.stringify(selectedSelectionArray[outerindex])
    );
    var selectedSelectionItemArray = selectedSelectionArray[
      outerindex
    ].selectionitem.slice();
    var selectedSelectionItemJson = JSON.parse(
      JSON.stringify(selectedSelectionItemArray[innerindex])
    );

    if (typeof selectedSelectionItemJson.selectionitemtitle === "undefined") {
      selectedSelectionItemJson.selectionitemtitle = e.target.value;
    } else {
      selectedSelectionItemJson.selectionitemtitle = e.target.value;
    }

    selectedSelectionItemArray.splice(innerindex, 1, selectedSelectionItemJson);
    selectedSelectionJson.selectionitem = selectedSelectionItemArray;
    selectedSelectionArray.splice(outerindex, 1, selectedSelectionJson);

    this.setState({
      selectedItemSelection: selectedSelectionArray
    });
  }

  handleSelectionItemPriceChange(e, value, outerindex, innerindex) {
    var selectedSelectionArray = this.state.selectedItemSelection.slice();
    var selectedSelectionJson = JSON.parse(
      JSON.stringify(selectedSelectionArray[outerindex])
    );
    var selectedSelectionItemArray = selectedSelectionArray[
      outerindex
    ].selectionitem.slice();
    var selectedSelectionItemJson = JSON.parse(
      JSON.stringify(selectedSelectionItemArray[innerindex])
    );

    if (typeof selectedSelectionItemJson.selectionitemprice === "undefined") {
      selectedSelectionItemJson.selectionitemprice = value;
    } else {
      selectedSelectionItemJson.selectionitemprice = value;
    }

    selectedSelectionItemArray.splice(innerindex, 1, selectedSelectionItemJson);
    selectedSelectionJson.selectionitem = selectedSelectionItemArray;
    selectedSelectionArray.splice(outerindex, 1, selectedSelectionJson);

    this.setState({
      selectedItemSelection: selectedSelectionArray
    });
  }

  //Render functions///////////////////////////////////////////////////////////////////////

  renderNavItem(menutitle) {
    return (
      <NavItem>
        <NavLink
          onClick={() => this.navItemClicked(menutitle)}
          style={{
            paddingRight: 20,
            paddingLeft: 20,
            fontWeight: "600",
            color: this.state.activeTab === menutitle ? "#20a8d8" : "black",
            fontSize: 15
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
            <Col style={{ marginTop: 0, marginBottom: 30 }} xs="12">
              <Button
                block = {this.state.isMobile? true :false}
                style={{ fontSize: 17, fontWeight: "600", marginBottom:20, }}
                onClick={this.togglePreviewModal}
                color="success"
                className="float-right"
              >
                {" "}
                <i className="fa fa-play fa-1x" aria-hidden="true" />
                &nbsp; Preview
              </Button>

              <Button
                block = {this.state.isMobile? true :false}
                style={{ fontSize: 17, fontWeight: "600", marginRight: 20 }}
                onClick={this.toggleNewCategoryModal}
                color="primary"
                className="float-right"
                
              >
                {" "}
                <i className="fa fa-plus fa-1x" aria-hidden="true" />
                &nbsp; Add New Category
              </Button>

               <Button
                block = {this.state.isMobile? true :false}
                style={{ fontSize: 17, fontWeight: "600", marginBottom:20, backgroundColor: "#FF5722", color: 'white' }}
                className="float-left"
                onClick={() => this.gotoPublish()}
              >
                <i className="fa fa-rocket fa-1x" aria-hidden="true" />
                &nbsp; Publish
              </Button>
              
            </Col>
            <Col xs="12">{this.state.loading ? this.renderLoadingItems() : this.renderMenu(menutitle[i])}</Col>
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

  renderMenu(menutitle) {
    var menuindex = this.state.menu.findIndex(x => x.menutitle == menutitle);
    var selectedmenutab;
    var categoryarray = [];
    if (menuindex >= 0) {
      selectedmenutab = this.state.menu[menuindex].menuitem;
      for (let i = 0; i < selectedmenutab.length; i++) {
        categoryarray.push(
          <Col xs="12">
            {this.renderCategoryItems(
              menutitle,
              selectedmenutab[i].items,
              selectedmenutab[i].categoryname
            )}
          </Col>
        );
      }
    } else {
      for (let i = 0; i < 1; i++) {
        categoryarray.push(
          this.renderEmptyMenu(menutitle)
        );
      }
    }
    return <Row>{categoryarray}</Row>;
  }

  renderEmptyMenu(menutitle) {
    return (
      <Col style={{ padding: 0, opacity:0.6, }} xs="12">
        <Label
          style={{ marginBottom: 10, marginRight: 5, marginLeft: 15 }}
          className="h5"
        >
          New Category (ex: {menutitle})
        </Label>
        <Col xs="12" sm="6" md="6" lg="4">
          <Card
            style={{ borderStyle: "dashed", borderWidth: 2 }}
            onMouseOver=""
          >
            <CardBody
              style={{ marginTop: 20, marginBottom: 10, padding: 0, height: 130, }}
            >
              <div class="col" style={{ textAlign: "center" }}>
                <i
                  style={{ color: "#c8ced3", marginTop: 20 }}
                  className="fa icon-plus fa-3x text-center"
                />
                <p style={{ marginTop: 20 }}>Add New Item</p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Col>
    )
  }

  renderCategoryItems(menutitle, items, categoryname) {
    var itemsarray = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].title !== "") {
        itemsarray.push(
          <Col xs="12" sm="6" md="6" lg="4">
            <Card className="card-1">
              <CardHeader
                style={{
                  padding: 0,
                  margin: 0,
                  borderWidth: 0,
                  backgroundColor: "white",
                  marginRight: 10
                }}
              >
                <div className="card-header-actions">
                  <a
                    style={{ cursor: "pointer", opacity: 0.6 }}
                    className="card-header-action btn btn-close"
                    onClick={() => this.deleteMenuItem(items[i]._id)}
                  >
                    <i className="fa fa-times-thin fa-2x" aria-hidden="true" />
                  </a>
                </div>
              </CardHeader>
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
                  <div class="row">
                    <div>
                      <Dotdotdot clamp={1}>
                        <h5
                          style={{
                            textAlign: "start",
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
                    <Label
                      style={{
                        opacity: 0.5,
                        cursor: "pointer",
                        marginLeft: 15,
                        fontWeight:'600',
                        fontfStyle: "italic"
                      }}
                    >
                      {" "}
                      Serves {items[i].serveperunit}
                    </Label>
                    {items[i].minimumquantity > 1 ? (
                      <Label
                        style={{
                          opacity: 0.5,
                          cursor: "pointer",
                          marginLeft: 5,
                          fontWeight:'600',
                          fontfStyle: "italic"
                        }}
                      >
                        &#9679; Minimum {items[i].minimumquantity}
                      </Label>
                    ) : null}
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
        <Col xs="12">
          <Label style={{ marginBottom: 10, marginRight: 5 }} className="h5">
            {categoryname}
          </Label>
          <a
            style={{ marginTop: -5, cursor: "pointer", opacity: 0.6 }}
            className="card-header-action"
            onClick={() => this.editMenuCategoryName(categoryname)}
          >
            <i className="fa fa-pencil" />
          </a>
          <a
            style={{ marginTop: -5, cursor: "pointer", opacity: 0.6 }}
            className="card-header-action"
            onClick={() => this.deleteMenuCategory(categoryname)}
          >
            <i className="fa fa-trash" />
          </a>
        </Col>

        {itemsarray}

        {this.renderEmptyItem(menutitle, categoryname)}
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
          textAlign: "right",
          flex: 1
        }}
      >
        {iconarray}
      </Col>
    );
  }

  renderEmptyItem(menutitle, categoryname) {
    return (
      <Col xs="12" sm="6" md="6" lg="4">
        <Card
          style={{ cursor: "pointer", borderStyle: "dashed", borderWidth: 2 }}
          onMouseOver=""
          onClick={() => this.addNewItemClicked(menutitle, categoryname)}
        >
          <CardBody
            style={{ marginTop: 20, marginBottom: 10, padding: 0, height: 130 }}
          >
            <div class="col" style={{ textAlign: "center" }}>
              <i
                style={{ color: "#c8ced3", marginTop: 20 }}
                className="fa icon-plus fa-3x text-center"
              />
              <p style={{ marginTop: 20 }}>Add New Item</p>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }

  renderForm() {
    var selectedItemTitle = this.state.selectedItemTitle;
    var selectedItemDescrip = this.state.selectedItemDescrip;
    var selectedItemPrice = this.state.selectedItemPrice;
    var selectedItemServe = this.state.selectedItemServe;
    var selectedItemMinimumQuantity = this.state.selectedItemMinimumQuantity;
    var selectedItemSelection = this.state.selectedItemSelection;
    var selectedMarkItemAs = this.state.selectedMarkItemAs;
    var selectedDishType = this.state.selectedDishType;
    const { imagePreviewUrl } = this.state;
  
    return (
      <Collapse isOpen={selectedDishType == "" ? false : true}>
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

          {this.state.selectedDishType == "bulk" ? (
            <FormGroup row>
              <Col md="3">
                <h6>Serves / Unit</h6>
              </Col>
              <Col xs="12" md="9">
                <Input
                  onChange={e => this.handleServeChange(e)}
                  value={selectedItemServe}
                  style={{ color: "black", width: 135 }}
                  type="select"
                  placeholder="1"
                >
                  {this.state.servecount.map(serve => (
                    <option
                      style={{ color: "black" }}
                      key={serve}
                      value={serve}
                    >
                      {serve}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
          ) : null}

          {this.state.selectedDishType == "single" ? (
            <FormGroup row>
              <Col md="3">
                <h6>Min Quantity / Unit</h6>
              </Col>
              <Col xs="12" md="9">
                <Input
                  onChange={e => this.handleMinQuantityChange(e)}
                  value={selectedItemMinimumQuantity}
                  style={{ color: "black", width: 135 }}
                  type="select"
                  placeholder="1"
                >
                  {this.state.servecount.map(minimumquantity => (
                    <option
                      style={{ color: "black" }}
                      key={minimumquantity}
                      value={minimumquantity}
                    >
                      {minimumquantity}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
          ) : null}

          {this.renderSelection(selectedItemSelection)}

          <Button
            block
            color="primary"
            onClick={() => this.addNewSelectionCategory()}
          >
            Add Selections (Toppings / Sides)
          </Button>

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
      </Collapse>
    );
  }

  renderSelection(selection) {
    var selectionarray = [];
    for (let i = 0; i < selection.length; i++) {
      selectionarray.push(
        <Card>
          <CardHeader>
            <Label style={{ fontWeight: "600" }}>
              Selection {i + 1}
            </Label>
            <div className="card-header-actions">
              <a
                onClick={() => this.toggleSelection(i)}
                style={{ marginRight: 10, cursor: "pointer" }}
                onMouseOver=""
                className="card-header-action btn btn-close"
              >
                <img
                  style={{
                    height: 15,
                    width: 15,
                    objectFit: "cover"
                  }}
                  src={ selection[i].selectionisOpen ? dropUpIcon : dropDownIcon}
                  alt=""
                />
              </a>
              <a
                onClick={() => this.deleteSelectionCategory(i)}
                style={{ cursor: "pointer" }}
                onMouseOver=""
                className="card-header-action btn btn-close"
              >
                <img
                  style={{
                    height: 10,
                    width: 10,
                    objectFit: "cover"
                  }}
                  src={closeIcon}
                  alt=""
                />
              </a>
            </div>
          </CardHeader>
          <Collapse isOpen={selection[i].selectionisOpen ? true : false}>
            <CardBody>
              <FormGroup row>
                <Col xs="4">
                  <h6 style={{ marginTop: 5 }}>Selection Category</h6>
                </Col>
                <Col xs="8">
                  <Input
                    onChange={e => this.handleSelectionCategoryChange(e, i)}
                    value={selection[i].selectioncategory}
                    style={{ color: "black" }}
                    type="text"
                    placeholder="Selection Category"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="4">
                  <h6 style={{ marginTop: 5 }}>Selection Limit</h6>
                </Col>
                <Col xs="8">
                  <Input
                    onChange={e => this.handleSelectionMaxNumChange(e, i)}
                    value={selection[i].selectionmaxnum}
                    style={{ color: "black" }}
                    type="select"
                    placeholder="1"
                  >
                    {this.state.servecount.map(limit => (
                      <option
                        style={{ color: "black" }}
                        key={limit}
                        value={limit}
                      >
                        {limit}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
              {this.renderSelectionItems(selection[i].selectionitem, i)}
            </CardBody>
          </Collapse>
        </Card>
      );
    }
    return (
      <FormGroup>
        {selectionarray}
        {this.state.isItemSelectionEmpty ? (
          <FormText className="help-block">
            <span style={{ color: "red" }}>
              Please fill in all the empty inputs in selections
            </span>
          </FormText>
        ) : null}
      </FormGroup>
    );
  }

  renderSelectionItems(selectionitem, outerindex) {
    var selectionitemarray = [];
    for (let i = 0; i < selectionitem.length; i++) {
      selectionitemarray.push(
        <Row>
          <Col xs="12" md="5">
            <FormGroup>
              <div>
                <Input
                  onChange={e =>
                    this.handleSelectionItemTitleChange(e, outerindex, i)
                  }
                  value={
                    selectionitem[i] == null
                      ? ""
                      : selectionitem[i].selectionitemtitle
                  }
                  style={{ color: "black" }}
                  type="text"
                  placeholder="Selection 1"
                />
              </div>
            </FormGroup>
          </Col>
          <Col xs="10" md="6">
            <FormGroup>
              <div>
                <InputGroup className="input-prepend">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>€</InputGroupText>
                  </InputGroupAddon>
                  <CurrencyInput
                    style={{
                      borderWidth: 1,
                      borderColor: "rgba(211,211,211,0.3)",
                      paddingLeft: 10,
                      color: "black",
                      width:'80%'
                    }}
                    value={
                      selectionitem[i] == null
                        ? ""
                        : Number(selectionitem[i].selectionitemprice).toFixed(2)
                    }
                    onChange={(e, value) =>
                      this.handleSelectionItemPriceChange(
                        e,
                        value,
                        outerindex,
                        i
                      )
                    }
                    placeholder="0.00"
                    required
                  />
                </InputGroup>
              </div>
            </FormGroup>
          </Col>

          <Col style={{ padding: 0 }} xs="2" md="1">
            <img
              style={{
                cursor: "pointer",
                height: 10,
                width: 10,
                objectFit: "cover",
                marginTop: 10
              }}
              onClick={() => this.deleteSelectionItem(outerindex, i)}
              src={closeIcon}
              alt=""
            />
          </Col>
        </Row>
      );
    }
    return (
      <Row>
        <Col xs="12">{selectionitemarray}</Col>
        <Col xs="12">
          <Button
            onClick={() => this.addNewSelectionItem(outerindex)}
            color="primary"
            className="btn-pill"
          >
            Add Items
          </Button>
        </Col>
      </Row>
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

  renderPreviewModal() {
    return (
      <Modal
        isOpen={this.state.previewModalOpen}
        toggle={this.togglePreviewModal}
        size="lg"
        centered
      >
        <ModalHeader toggle={this.togglePreviewModal}>
          Preview Menu
        </ModalHeader>
        <ModalBody>
          <div >
            <CatererDetail preview={true}/>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  renderAddNewCategoryModal() {
    return (
      <Modal
        isOpen={this.state.categoryModal}
        toggle={this.toggleNewCategoryModal}
      >
        <ModalHeader toggle={this.toggleNewCategoryModal}>
          {this.state.updateCategory ? "Edit Category" : "Add New Category"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              style={{ marginTop: 10, color: "black" }}
              value={this.state.newMenuCategoryName}
              onChange={e => this.handleCategoryNameChange(e)}
              type="text"
              placeholder={this.state.activeTab}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={this.state.newMenuCategoryName == "" || this.state.isSaving ? true : false}
            color="primary"
            onClick={() => this.state.updateCategory ? this.saveMenuCategoryName() : this.addNewMenuCategory()}
          >
            {this.state.updateCategory ? this.state.isSaving ? "Saving..." : "Save" : this.state.isSaving ? "Adding..." : "Add"}
          </Button>
          <Button color="secondary" onClick={this.toggleNewCategoryModal} disabled={this.state.isSaving ? true : false}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  renderAddNewItemModal() {
    var selectedDishType = this.state.selectedDishType;
    return (
      <Modal isOpen={this.state.menuModalOpen} toggle={this.toggleNewItemModal}>
        <ModalHeader toggle={this.toggleNewItemModal}>{this.state.updateItem ? "Edit Item" : "Add New Item"}</ModalHeader>
        <ModalBody>
          <Label>How do you want to sell your dish?</Label>
          <Row>
            <Col>
              <Card
                style={{
                  cursor: "pointer",
                  borderColor: selectedDishType == "single" ? "#20a8d8" : null
                }}
                onMouseOver=""
                onClick={() => this.selectDishType("single")}
              >
                <CardHeader>
                  <div class="container">
                    <h6 style={{ textAlign: "center", color: selectedDishType == "single" ? "#20a8d8" : null }}>
                      Plate / Box (Single){" "}
                    </h6>
                  </div>
                </CardHeader>
                <CardBody>
                  <div class="container">
                    <img
                      style={{ height: 80, width: 80, objectFit: "cover" }}
                      src={require("../../../assets/img/singledish.png")}
                      alt=""
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  cursor: "pointer",
                  borderColor: selectedDishType == "bulk" ? "#20a8d8" : null
                }}
                onMouseOver=""
                onClick={() => this.selectDishType("bulk")}
              >
                <CardHeader>
                  <div class="container">
                    <h6 style={{ textAlign: "center", color: selectedDishType == "bulk" ? "#20a8d8" : null }}>
                      Platter / Tray (Bulk}
                    </h6>
                  </div>
                </CardHeader>
                <CardBody>
                  <div class="container">
                    <img
                      style={{ height: 80, width: 90, objectFit: "cover" }}
                      src={require("../../../assets/img/bulkdish.png")}
                      alt=""
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => this.checkInput()} color="primary" disabled={this.state.isSaving ? true : false}>
            {this.state.updateItem ? this.state.isSaving ? "Saving" : "Save" : this.state.isSaving ? "Adding..." : "Add"}
          </Button>{" "}
          <Button color="secondary" onClick={this.toggleNewItemModal} disabled={this.state.isSaving ? true : false}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  renderDeleteItemModal() {
    var title ;
    var descrip;

    if (this.state.deleteItemFunctionName === 'deleteMenuCategory') {
      title = "Delete Category";
      descrip = "Are you sure you want to delete this category from menu?"
    }
    else if (this.state.deleteItemFunctionName === 'deleteMenuItem') {
      title = "Delete Item";
      descrip = "Are you sure you want to delete this item from menu?"
    }
    else if (this.state.deleteItemFunctionName === 'deleteSelectionCategory') {
      title = "Delete Selection";
      descrip = "Are you sure you want to this selection from your item's list?"
    }
    else if (this.state.deleteItemFunctionName === 'deleteSelectionItem') {
      title = "Delete Selection Item";
      descrip = "Are you sure you want to delete this item from your current selection category?"
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
    var toBeReplaceItemArray =  this.state.toBeReplaceItemArray;

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = "";

    if (deleteItemFunctionName === 'deleteMenuCategory'){
      url = apis.BULKDELETEmenu + "?categoryname=" + this.state.deleteMenuCategoryName;
      axios.delete(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          toast(<SuccessDelete/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            deleteModalOpen: false
          }, () => {
              this.getCatererMenu()
          })
        } 
      })
      .catch((error) => {
        toast(<ErrorDelete/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
    }
    else if (deleteItemFunctionName === 'deleteMenuItem') {
      url = apis.DELETEmenu + "?_id=" + this.state.deleteMenuID;
      axios.delete(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          toast(<SuccessDelete/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            deleteModalOpen: false
          }, () => {
              this.getCatererMenu()
          })
        } 
      })
      .catch((error) => {
        toast(<ErrorDelete/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
    }
    else if (deleteItemFunctionName === 'deleteSelectionCategory') {
      this.setState({
        selectedItemSelection: toBeReplaceItemArray,
        deleteModalOpen: !this.state.deleteModalOpen
      });
    }
    else if (deleteItemFunctionName === 'deleteSelectionItem') {
      this.setState({
        selectedItemSelection: toBeReplaceItemArray,
        deleteModalOpen: !this.state.deleteModalOpen
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

        {this.renderAddNewCategoryModal()}

        {this.renderAddNewItemModal()}

        {this.renderDeleteItemModal()}

        {this.renderPreviewModal()}

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
