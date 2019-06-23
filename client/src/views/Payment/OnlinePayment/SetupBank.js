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
  UncontrolledDropdown, 
  Modal,
  ModalBody
} from 'reactstrap'; 
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {listCounties} from '../../../utils'
import PropTypes from 'prop-types';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import {
    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PostalCodeElement,
    PaymentRequestButtonElement,
    IbanElement,
    IdealBankElement,
    StripeProvider,
    injectStripe,
    Elements
  } from "react-stripe-elements";
import Lottie from 'react-lottie';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class SetupBank extends Component {

  constructor(props) {
    super(props);

    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleIBANChange = this.handleIBANChange.bind(this)

    this.state = {
      loadingModal: false,
      agreementChecked: false,
      catererPaymentAccoundID: "",
      catererEmail: "",

      firstname:"",
      lastname: "",

      accountopeneremail: "",
      owneremail: "",

      ownerfirstname:"",
      ownerlastname: "",

      directorfirstname:"",
      directorlastname: "",

      companyname: "",
      companytaxid: "",
      holdertype: "",
      iban: "",

      address1: "",
      address2: "",
      city: "",
      county: "",
      country: "",

      accountopeneraddress1: "",
      accountopeneraddress2: "",
      accountopenercity: "",
      accountopenercounty: "",
      accountopenercountry: "",

      owneraddress1: "",
      owneraddress2: "",
      ownercity: "",
      ownercounty: "",
      ownercountry: "",

      currency: "EUR",
      selectedDate: "",
      selectedOwnerDate: "",
      maxDate: null,
      dropDownDate: false,
      ownerdropDownDate: false,

      ownerSameAccountOpener: false,

      isCountryEmpty: false,
      isIBANEmpty: false,
      isNextButtonActive: false,
      isProceedButtonVisible: false,
      isSaving: false,
    };

    this.CountyData = listCounties()

    this.HolderType  = [
        {
            "key": "Individual",
            "value": "individual"
        },
        {
            "key": "Company",
            "value": "company"
        },
    ]

    this.EuropeCountry  = [
        {
            "key": "Austria",
            "value": "AT"
        },
        {
            "key": "Belgium",
            "value": "BE"
        },
        {
            "key": "Denmark",
            "value": "DK"
        },
        {
            "key": "Finland",
            "value": "FI"
        },
        {
            "key": "France",
            "value": "FR"
        },
        {
            "key": "Germany",
            "value": "DE"
        },
        {
            "key": "Ireland",
            "value": "IE"
        },
        {
            "key": "Italy",
            "value": "IT"
        },
        {
            "key": "Luxembourg",
            "value": "LU"
        },
        {
            "key": "Netherlands",
            "value": "NL"
        },
        {
            "key": "Norway",
            "value": "NO"
        },
        {
            "key": "Portugal",
            "value": "PT"
        },
        {
            "key": "Spain",
            "value": "ES"
        },
        {
            "key": "Sweden",
            "value": "SE"
        },
        {
            "key": "Switzerland",
            "value": "CH"
        },
        {
            "key": "United Kingdom",
            "value": "UK"
        },
      ];
  }

  componentDidMount() {

    var currentDate = moment().subtract(13, 'years').toDate();

    this.setState({
      maxDate: currentDate
    })
   
   if (this.props.catererPaymentAccoundID && this.props.catererPaymentAccoundID !== "") {
     this.setState({
        catererPaymentAccoundID: this.props.catererPaymentAccoundID,
     })
   }
   if (this.props.catererEmail && this.props.catererEmail !== "") {
      this.setState({
        catererEmail: this.props.catererEmail
      })
   }
  }

  toggleLoadingModal = () => {
    this.setState({
      loadingModal: !this.state.loadingModal,
    });
  }

  handleIBANChange(e) {
    this.setState({ 
      iban: e.target.value, 
      isIBANEmpty: false,
    },() => {
      this.checkAllInput()
    })
  }

  handleHolderType(e) {
    this.setState({ 
      holdertype: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleTaxIDChange(e) {
    this.setState({ 
      companytaxid: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  /////////////////////////////////////////////Email Change/////////////////////////////////////////////

  handleOwnerEmailChange(e) {
    this.setState({ 
      owneremail: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleAccountOpenerEmailChange(e) {
    this.setState({ 
      accountopeneremail: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  ///////////////////////////////////////////////Name Change////////////////////////////////////////////////////////////

  handleFirstNameChange(e) {
    this.setState({ 
      firstname: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleLastNameChange(e) {
    this.setState({ 
      lastname: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleCompanyNameChange(e) {
    this.setState({ 
      companyname: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleOwnerFirstNameChange(e) {
    this.setState({ 
      ownerfirstname: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleOwnerLastNameChange(e) {
    this.setState({ 
      ownerlastname: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleDirectorFirstNameChange(e) {
    this.setState({ 
      directorfirstname: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleDirectorLastNameChange(e) {
    this.setState({ 
      directorlastname: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  /////////////////////////////////////////////////Address Change//////////////////////////////////////////////////

  
  handleCountryChange(e) {
    this.setState({ 
      country: e.target.value, 
      isCountryEmpty: false,
    },() => {
      this.checkAllInput()
    })
  }

  handleCounty(e) {
    this.setState({ 
      county: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleCity(e) {
    this.setState({ 
      city: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleAddress1(e) {
    this.setState( {
      address1: e.target.value,
    },() => {
      this.checkAllInput()
    })
  }

  handleAddress2(e) {
    this.setState({ 
      address2: e.target.value   
    })
  }


  handleAccountOpenerCountryChange(e) {
    this.setState({ 
      accountopenercountry: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleAccountOpenerCounty(e) {
    this.setState({ 
      accountopenercounty: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleAccountOpenerCity(e) {
    this.setState({ 
      accountopenercity: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleAccountOpenerAddress1(e) {
    this.setState( {
      accountopeneraddress1: e.target.value,
    },() => {
      this.checkAllInput()
    })
  }

  handleAccountOpenerAddress2(e) {
    this.setState({ 
      accountopeneraddress2: e.target.value   
    })
  }


  handleOwnerCountryChange(e) {
    this.setState({ 
      ownercountry: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleOwnerCounty(e) {
    this.setState({ 
      ownercounty: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleOwnerCity(e) {
    this.setState({ 
      ownercity: e.target.value, 
    },() => {
      this.checkAllInput()
    })
  }

  handleOwnerAddress1(e) {
    this.setState( {
      owneraddress1: e.target.value,
    },() => {
      this.checkAllInput()
    })
  }

  handleOwnerAddress2(e) {
    this.setState({ 
      owneraddress2: e.target.value   
    })
  }

  //////////////////////////////////////////////D.O.B Change////////////////////////////////////////////////////////////
  
  handleDateChange(date){
		this.setState({ 
      selectedDate : moment(date).format("DD / MM / YYYY") 
    }, () => {
      this.toggleDropDown()
      this.checkAllInput()
    })
  }

  handleOwnerDateChange(date){
		this.setState({ 
      selectedOwnerDate : moment(date).format("DD / MM / YYYY") 
    }, () => {
      this.toggleOwnerDateDropDown()
      this.checkAllInput()
    })
  }

  toggleDropDown = () => {
    this.setState({
      dropDownDate: !this.state.dropDownDate
    })
  }

  toggleOwnerDateDropDown = () => {
    this.setState({
      ownerdropDownDate: !this.state.ownerdropDownDate
    })
  }

  //////////////////////////////////////////////Checkbox Change////////////////////////////////////////////////////////////

  handleCheckBoxChange = (e) => {
    this.setState({
      agreementChecked: !this.state.agreementChecked
    }, () => {
      this.checkAllInput()
    })
  }

  handleOwnerCheckBoxChange = (e) => {
    this.setState({
      ownerSameAccountOpener: !this.state.ownerSameAccountOpener
    }, () => {
      this.checkAllInput()
    })
  }

  openStripeServicesAgreement = () => {
    window.open('https://stripe.com/ssa', '_blank');
  }

  openConnectedAccountAgreement = () => {
    window.open('https://stripe.com/connect-account/legal', '_blank');
  }

  checkAllInput = () => {
    const {
      companyname, firstname, lastname, ownerfirstname, ownerlastname, directorfirstname, directorlastname,
      owneremail, accountopeneremail,
      address1, address2, city, county, country, 
      owneraddress1, owneraddress2, ownercity, ownercountry, ownercounty,
      accountopeneraddress1, accountopeneraddress2, accountopenercity, accountopenercountry, accountopenercounty,
      selectedOwnerDate, selectedDate,
      agreementChecked, iban,  holdertype, ownerSameAccountOpener, companytaxid, 
    } = this.state
    
    if (holdertype !== "") {
      if (holdertype === "individual") {
        if (agreementChecked && country !== "" && iban !== "" && firstname !== "" && county !== "" && lastname !== "" && address1 !== "" && city !== "" && selectedDate !== "") {
          //Activate Next Button
          this.setState({ 
            isNextButtonActive: true, 
          });
        }
        else {
          this.setState({ 
            isNextButtonActive: false, 
          });
        }
      }
   
      else if (holdertype === "company") {
        if (ownerSameAccountOpener) {
          if ( 
            companyname !== "" && firstname !== "" && lastname !== "" && directorfirstname !== "" && directorlastname !== "" &&
            accountopeneremail !== "" &&
            address1 !== "" && city !== "" && county !== "" && country !== "" && 
            accountopeneraddress1 !== "" && accountopenercity !== "" && accountopenercountry !== "" && accountopenercounty !== "" &&
            selectedDate !== "" && iban !== "" && companytaxid !== "" && agreementChecked 
          ) {
            //Activate Next Button
            this.setState({ 
              isNextButtonActive: true, 
            });
          }
          else {
            this.setState({ 
              isNextButtonActive: false, 
            });
          }
        }
        else {
          if ( 
            companyname !== "" && firstname !== "" && lastname !== "" && ownerfirstname !== "" && ownerlastname !== "" && directorfirstname !== "" && directorlastname !== "" &&
            accountopeneremail !== "" && owneremail !== "" &&
            address1 !== "" && city !== "" && county !== "" && country !== "" && 
            accountopeneraddress1 !== "" && accountopenercity !== "" && accountopenercountry !== "" && accountopenercounty !== "" &&
            owneraddress1 !== "" && ownercity !== "" && ownercountry !== "" && ownercounty !== "" &&
            selectedDate !== "" && selectedOwnerDate !== "" && iban !== "" && companytaxid !== "" && agreementChecked 
          ) {
            //Activate Next Button
            this.setState({ 
              isNextButtonActive: true, 
            });
          }
          else {
            this.setState({ 
              isNextButtonActive: false, 
            });
          }
        }
      }
    }
    else {
      this.setState({ 
        isNextButtonActive: false, 
      });
    }
  }

  handleProceed = () => {
    this.props.history.push('/caterer/reports/order')
  }

  addNewCard = () => {

    this.setState({
      loadingModal: true
    })

    const {
      companyname, firstname, lastname, ownerfirstname, ownerlastname, directorfirstname, directorlastname,
      owneremail, accountopeneremail,
      address1, address2, city, county, country, 
      owneraddress1, owneraddress2, ownercity, ownercountry, ownercounty,
      accountopeneraddress1, accountopeneraddress2, accountopenercity, accountopenercountry, accountopenercounty,
      selectedOwnerDate, selectedDate,
      agreementChecked, iban,  holdertype, ownerSameAccountOpener, catererEmail, catererPaymentAccoundID, companytaxid
    } = this.state

    if (this.state.catererPaymentAccoundID === "" && this.state.catererEmail !== "") {

      var selectedDateDay = selectedDate.split(" / ")[0]
      var selectedDateMonth = selectedDate.split(" / ")[1]
      var selectedDateYear = selectedDate.split(" / ")[2]

      var headers = {
        'Content-Type': 'application/json',
      }

      var url = apis.POSTcreate_caterer_paymentaccount;

      var body = {
        email: catererEmail ,
        business_type: holdertype,
        country: country,
      }

      if (holdertype === "individual") {
  
        body.individual = {
          address: {
            city: city,
            country: country,
            line1: address1,
            line2: address2,
            state: county
          },
          dob: {
            day: Number(selectedDateDay),
            month: Number(selectedDateMonth),
            year: Number(selectedDateYear)
          },
          first_name: firstname,
          last_name: lastname
        }
      }
      else if (holdertype === "company") {

        var ownerbody;
        var accountopenerbody;
        var directorbody;

        if (ownerSameAccountOpener) {

          accountopenerbody = {
            first_name: firstname,
            last_name: lastname,
            email: accountopeneremail,
            address: {
              city: accountopenercity,
              country: accountopenercountry,
              line1: accountopeneraddress1,
              line2: accountopeneraddress2,
              state: accountopenercounty
            },
            dob: {
              day: selectedDateDay,
              month: selectedDateMonth,
              year: selectedDateYear
            },
          }
          
          accountopenerbody.relationship = {
            account_opener: true,
            director: false,
            owner: true,
          }

          directorbody = {
            first_name: directorfirstname,
            last_name: directorlastname,
          }

          directorbody.relationship = {
            account_opener: false,
            director: true,
            owner: false,
          }
          
        }
        else {

          var selectedOwnerDateDay = selectedOwnerDate.split(" / ")[0]
          var selectedOwnerDateMonth = selectedOwnerDate.split(" / ")[1]
          var selectedOwnerDateYear = selectedOwnerDate.split(" / ")[2]

          accountopenerbody = {
            first_name: firstname,
            last_name: lastname,
            email: accountopeneremail,
            address: {
              city: accountopenercity,
              country: accountopenercountry,
              line1: accountopeneraddress1,
              line2: accountopeneraddress2,
              state: accountopenercounty
            },
            dob: {
              day: selectedDateDay,
              month: selectedDateMonth,
              year: selectedDateYear
            },
            relationship: {
              account_opener: true,
              director: false,
              owner: false,
            }
          }

          ownerbody = {
            first_name: ownerfirstname,
            last_name: ownerlastname,
            email: owneremail,
            address: {
              city: ownercity,
              country: ownercountry,
              line1: owneraddress1,
              line2: owneraddress2,
              state: ownercounty
            },
            dob: {
              day: selectedOwnerDateDay,
              month: selectedOwnerDateMonth,
              year: selectedOwnerDateYear
            },
            relationship: {
              account_opener: false,
              director: false,
              owner: true,
            }
          }

          directorbody = {
            first_name: directorfirstname,
            last_name: directorlastname,
            relationship: {
              account_opener: false,
              director: true,
              owner: false,
            }
          }
        }
        
        body.company = {
          address: {
            city: city,
            country: country,
            line1: address1,
            line2: address2,
            state: county
          },
          name: companyname,
          tax_id : companytaxid
        }
      }

      console.log("setupbank url = ", url)
      console.log("setupbank body = ", url)
 
      axios.post(url, body, {headers: headers})
      .then((response) => {
          if (response.status === 200) {
            this.setState({
              catererPaymentAccoundID: response.data.id
            }, () => {
              if (holdertype === "company") {
                this.createCompanyPerson(this.state.catererPaymentAccoundID, ownerSameAccountOpener, accountopenerbody, ownerbody, directorbody)
              }
              else {
                this.generateBankToken()
              }
            })
          } 
      })
      .catch((error) => {
        alert( 'error 1 = ',error)
          if (error) {
            toast(<ErrorInfo/>, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
            this.setState({
              loadingModal: false
            })
          }
      });
    }
    else {
      this.generateBankToken()
    }
  }

  createCompanyPerson = (catererPaymentAccoundID, ownerSameAccountOpener, accountopenerbody, ownerbody, directorbody) => {

    //Create 3 persons

    var accountopener_updatebody = {
      catererPaymentAccoundID: catererPaymentAccoundID,
      persondetails: accountopenerbody
    }

    var owner_updatebody = {
      catererPaymentAccoundID: catererPaymentAccoundID,
      persondetails: ownerSameAccountOpener ? null : ownerbody
    }

    var director_updatebody = {
      catererPaymentAccoundID: catererPaymentAccoundID,
      persondetails: directorbody
    }
       
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.PUTupdate_caterer_person;

    var axiosarray = [];

    if (ownerSameAccountOpener) {
      axiosarray = [
        axios.put(url, accountopener_updatebody, {headers: headers}),
        axios.put(url, director_updatebody, {headers: headers}),
      ]
      axios.all(axiosarray)
      .then(axios.spread((accountopener_response, director_response) => {
        if (accountopener_response.status === 201 && director_response.status === 201) {
            this.updateCatererPaymentAccount(catererPaymentAccoundID)
        } 
      }))
      .catch((error) => {
          console.log('error2 = ', error)
          toast(<ErrorInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false
          })
      });
    }
    else {
      axiosarray = [
        axios.put(url, accountopener_updatebody, {headers: headers}),
        axios.put(url, owner_updatebody, {headers: headers}),
        axios.put(url, director_updatebody, {headers: headers}),
      ]
      axios.all(axiosarray)
      .then(axios.spread((accountopener_response, owner_response, director_response) => {
        if (accountopener_response.status === 201 && owner_response.status === 201 && director_response.status === 201) {
            this.updateCatererPaymentAccount(catererPaymentAccoundID)
        } 
      }))
      .catch((error) => {
          console.log('error3 = ', error)
          toast(<ErrorInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false
          })
      });
    }
  }

  updateCatererPaymentAccount = (catererPaymentAccoundID) => {

    var updatebody = {
      catererPaymentAccoundID: catererPaymentAccoundID,
      updatebody: {
        company: {
          owners_provided: true,
          directors_provided: true,
        }
      }
    }
       
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.PUTupdate_caterer_paymentaccount;

    axios.put(url, updatebody, {headers: headers})
    .then((response) => {
        if (response.status === 201) {
          this.generateBankToken()
        } 
    })
    .catch((error) => {
        console.log('error4 = ', error)
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          loadingModal: false
        })
    });
  }

  generateBankToken = () => {
    const {country, iban, currency, firstname, holdertype, } = this.state

    if (this.props.stripe) {
        this.props.stripe.createToken(
            'bank_account',
            {
              country: country,
              currency: currency,
              account_holder_name: firstname,
              account_holder_type: holdertype,
              account_number: iban
            })
            .then((err, payload) => 
              {
                if (err) {
                //  alert(JSON.stringify(err))
                  console.log(err)
                  if (err.error) {
                    console.log("error5 = ",JSON.stringify(err))
                    toast(<ErrorInfo/>, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    });
                    this.setState({
                      loadingModal: false
                    })
                  }
                  else if (err.token) {
                    console.log(JSON.stringify(err))
                    this.updateBankAccount(err.token.id)
                  }
                }
                else {
                  alert(JSON.stringify(payload))
                  this.updateBankAccount(payload.id)
                }
            });
    }
    else {
      console.log("error 6 =")
      toast(<ErrorInfo/>, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      this.setState({
        loadingModal: false
      })
    }
  }

  updateBankAccount = (token) => {

    var headers = {
        'Content-Type': 'application/json',
    }

    var url = apis.POSTcreate_caterer_external_bankaccount;

    var body = {
       catererPaymentAccoundID: this.state.catererPaymentAccoundID, bankacctoken: token 
    }

    axios.post(url, body, {headers: headers})
    .then((response) => {
        if (response.status === 200) {
          this.updateUserData(this.state.catererPaymentAccoundID)
        } 
    })
    .catch((error) => {
      console.log("error 7 =", error)
        if (error) {
          toast(<ErrorInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false
          })  
        }
    });
  }

  updateUserData = (catererPaymentAccoundID) => {
    
    var data = {
      catererPaymentAccoundID: catererPaymentAccoundID,
    }

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.UPDATEcaterer;

    axios.put(url, data, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            loadingModal: false
          }, () => {
            this.props.goBack()
          })
        }
      })
      .catch((error) => {
        console.log("error 8 =", error)
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          loadingModal: false
        })  
      });
  }

  renderIndividualInput() {
    return (
      <div>
        <FormGroup>
          <Label >First Name</Label>
          <Input style={{color: 'black'}} value={this.state.firstname} onChange={(e) => this.handleFirstNameChange(e)} type="text" id="firstname" placeholder="Enter account holder firstname" />
        </FormGroup>
        <FormGroup>
          <Label >Last Name</Label>
          <Input style={{color: 'black'}} value={this.state.lastname} onChange={(e) => this.handleLastNameChange(e)} type="text" id="lastname" placeholder="Enter account holder lastname" />
        </FormGroup>
        <FormGroup>
          <Label >Date of Birth</Label>
          <UncontrolledDropdown isOpen={this.state.dropDownDate}  toggle={() => this.toggleDropDown()}>
            <DropdownToggle
              style={{
                height: 40,
                width: '100%',
                color: "rgba(0,0,0, 0.5)",
                borderColor: "rgba(211,211,211, 0.5)",
                backgroundColor: "white",
              }}
              caret
            >
            <Label style={{ cursor: 'pointer', fontSize: 15, paddingLeft:5, textAlign:'start', color: this.state.selectedDate === "" ? 'gray' : 'black', height:12, width: '98%'}}>{this.state.selectedDate === "" ? 'Select Date of Birth' : this.state.selectedDate}</Label> 
            </DropdownToggle>
            <DropdownMenu>
              <div >
                <Calendar
                  onChange={this.handleDateChange.bind(this)}
                  maxDate={this.state.maxDate}
                />
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>        
        </FormGroup>
        <FormGroup>
          <Label >Address line 1</Label>
          <Input 
            style={{color: 'black'}} 
            value={this.state.address1}
            onChange={e => this.handleAddress1(e)}
            type="text"
            placeholder="Address line 1"
            autoComplete="address1"
          />
        </FormGroup>
        <FormGroup>
          <Label >Address line 2 (optional)</Label>
          <Input 
            value={this.state.address2}
            onChange={e => this.handleAddress2(e)}
            style={{ color: "black" }}
            type="text"
            placeholder="Address line 2 (optional)"
            autoComplete="address2" 
          />
        </FormGroup>
        <FormGroup>
          <Label >City</Label>
          <Input 
            value={this.state.city}
            onChange={e => this.handleCity(e)}
            style={{color: "black" }}
            type="text"
            placeholder="City"
            autoComplete="city"
          />
        </FormGroup>
        <FormGroup>
          <Label >County</Label>
          <Input
            style={{ color: this.state.county !== "" ? "black" : null }}
            value={this.state.county}
            onChange={e => this.handleCounty(e)}
            type="select"
            placeholder="County"
            autoComplete="county"
          >
            <option value="" disabled>
              Select County
            </option>
            {this.CountyData.map(county => (
              <option
                style={{ color: "black" }}
                key={county}
                value={county}
              >
                {county}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label >Country</Label>
          <Input value={this.state.country} onChange={(e) => this.handleCountryChange(e)} style={{color: this.state.country == "" ? 'grey': 'black'}} type="select" name="country" invalid={this.state.isCountryEmpty ? true : false}>
          <option value='' disabled>Select Country</option>
          {this.EuropeCountry.map(country =>
            <option style={{color:'black'}} key={country.key} value={country.value}>{country.key}</option>
          )}
          </Input>
        </FormGroup>
      </div>
    )
  }

  renderCompanyInput() {
    return (
      <div>
        <FormGroup>
          <Label >Company Name</Label>
          <Input style={{color: 'black'}} value={this.state.companyname} onChange={(e) => this.handleCompanyNameChange(e)} type="text" id="companyname" placeholder="Enter company name" />
        </FormGroup>
        <FormGroup>
          <Label >Company Tax ID</Label>
          <Input style={{color: 'black'}} value={this.state.companytaxid} onChange={(e) => this.handleTaxIDChange(e)} type="text" id="companytaxid" placeholder="Enter company tax ID" />
        </FormGroup>
        <FormGroup>
          <Label >Company Address line 1</Label>
          <Input 
            style={{color: 'black'}} 
            value={this.state.address1}
            onChange={e => this.handleAddress1(e)}
            type="text"
            placeholder="Address line 1"
            autoComplete="address1"
          />
        </FormGroup>
        <FormGroup>
          <Label >Address line 2 (optional)</Label>
          <Input 
            value={this.state.address2}
            onChange={e => this.handleAddress2(e)}
            style={{ color: "black" }}
            type="text"
            placeholder="Address line 2 (optional)"
            autoComplete="address2" 
          />
        </FormGroup>
        <FormGroup>
          <Label >City</Label>
          <Input 
            value={this.state.city}
            onChange={e => this.handleCity(e)}
            style={{color: "black" }}
            type="text"
            placeholder="City"
            autoComplete="city"
          />
        </FormGroup>
        <FormGroup>
          <Label >County</Label>
          <Input
            style={{ color: this.state.county !== "" ? "black" : null }}
            value={this.state.county}
            onChange={e => this.handleCounty(e)}
            type="select"
            placeholder="County"
            autoComplete="county"
          >
            <option value="" disabled>
              Select County
            </option>
            {this.CountyData.map(county => (
              <option
                style={{ color: "black" }}
                key={county}
                value={county}
              >
                {county}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label >Country</Label>
          <Input value={this.state.country} onChange={(e) => this.handleCountryChange(e)} style={{color: this.state.country == "" ? 'grey': 'black'}} type="select" name="country" invalid={this.state.isCountryEmpty ? true : false}>
          <option value='' disabled>Select Country</option>
          {this.EuropeCountry.map(country =>
            <option style={{color:'black'}} key={country.key} value={country.value}>{country.key}</option>
          )}
          </Input>
        </FormGroup>

        <div style={{marginTop: 40}}>
          <strong >Account Opener Details</strong>
        </div>

        <FormGroup style={{marginTop: 20}}>
          <Label >First Name</Label>
          <Input style={{color: 'black'}} value={this.state.firstname} onChange={(e) => this.handleFirstNameChange(e)} type="text" id="firstname" placeholder="Enter account opener firstname" />
        </FormGroup>
        <FormGroup>
          <Label >Last Name</Label>
          <Input style={{color: 'black'}} value={this.state.lastname} onChange={(e) => this.handleLastNameChange(e)} type="text" id="lastname" placeholder="Enter account opener lastname" />
        </FormGroup>
        <FormGroup>
          <Label >Email</Label>
          <Input style={{color: 'black'}} value={this.state.accountopeneremail} onChange={(e) => this.handleAccountOpenerEmailChange(e)} type="text" id="accountopeneremail" placeholder="Enter account opener email" />
        </FormGroup>
        <FormGroup>
          <Label >Date of Birth</Label>
          <UncontrolledDropdown isOpen={this.state.dropDownDate}  toggle={() => this.toggleDropDown()}>
            <DropdownToggle
              style={{
                height: 40,
                width: '100%',
                color: "rgba(0,0,0, 0.5)",
                borderColor: "rgba(211,211,211, 0.5)",
                backgroundColor: "white",
              }}
              caret
            >
            <Label style={{ cursor: 'pointer', fontSize: 15, paddingLeft:5, textAlign:'start', color: this.state.selectedDate === "" ? 'gray' : 'black', height:12, width: '98%'}}>{this.state.selectedDate === "" ? 'Select Date of Birth' : this.state.selectedDate}</Label> 
            </DropdownToggle>
            <DropdownMenu>
              <div >
                <Calendar
                  onChange={this.handleDateChange.bind(this)}
                  maxDate={this.state.maxDate}
                />
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>        
        </FormGroup>
        <FormGroup>
          <Label >Account Opener Home Address line 1</Label>
          <Input 
            style={{color: 'black'}} 
            value={this.state.accountopeneraddress1}
            onChange={e => this.handleAccountOpenerAddress1(e)}
            type="text"
            placeholder="Address line 1"
            autoComplete="account address1"
          />
        </FormGroup>
        <FormGroup>
          <Label >Address line 2 (optional)</Label>
          <Input 
            value={this.state.accountopeneraddress2}
            onChange={e => this.handleAccountOpenerAddress2(e)}
            style={{ color: "black" }}
            type="text"
            placeholder="Address line 2 (optional)"
            autoComplete="account address2" 
          />
        </FormGroup>
        <FormGroup>
          <Label >City</Label>
          <Input 
            value={this.state.accountopenercity}
            onChange={e => this.handleAccountOpenerCity(e)}
            style={{color: "black" }}
            type="text"
            placeholder="City"
            autoComplete="account city"
          />
        </FormGroup>
        <FormGroup>
          <Label >County</Label>
          <Input
            style={{ color: this.state.accountopenercounty !== "" ? "black" : null }}
            value={this.state.accountopenercounty}
            onChange={e => this.handleAccountOpenerCounty(e)}
            type="select"
            placeholder="County"
            autoComplete="account county"
          >
            <option value="" disabled>
              Select County
            </option>
            {this.CountyData.map(county => (
              <option
                style={{ color: "black" }}
                key={county}
                value={county}
              >
                {county}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label >Country</Label>
          <Input value={this.state.accountopenercountry} onChange={(e) => this.handleAccountOpenerCountryChange(e)} style={{color: this.state.accountopenercountry == "" ? 'grey': 'black'}} type="select" name="account country">
          <option value='' disabled>Select Country</option>
          {this.EuropeCountry.map(country =>
            <option style={{color:'black'}} key={country.key} value={country.value}>{country.key}</option>
          )}
          </Input>
        </FormGroup>

         <div style={{marginTop: 40}}>
          <strong >Owner Details</strong>
        </div>

        <div style={{ marginBottom: 20, marginTop: 20 }}>
          <Checkbox
            checked={this.state.ownerSameAccountOpener}
            onChange={e => this.handleOwnerCheckBoxChange(e)}
            style={{ padding: 0, marginRight: 10 }}
          />
          <span style={{ fontSize: 14 }} >
            Owner is the same person as Account Opener
          </span>
        </div>

        {!this.state.ownerSameAccountOpener ? this.renderOwnerDetails() : null}

        <div style={{marginTop: 40}}>
          <strong >Director Details</strong>
        </div>

        <FormGroup style={{marginTop: 20}}>
          <Label >First Name</Label>
          <Input style={{color: 'black'}} value={this.state.directorfirstname} onChange={(e) => this.handleDirectorFirstNameChange(e)} type="text" id="directorfirstname" placeholder="Enter director firstname" />
        </FormGroup>
        <FormGroup>
          <Label >Last Name</Label>
          <Input style={{color: 'black'}} value={this.state.directorlastname} onChange={(e) => this.handleDirectorLastNameChange(e)} type="text" id="directorlastname" placeholder="Enter director lastname" />
        </FormGroup>

      </div>
    )
  }

  renderOwnerDetails() {
    return (
      <div>
        <FormGroup style={{marginTop: 20}}>
          <Label >First Name</Label>
          <Input style={{color: 'black'}} value={this.state.ownerfirstname} onChange={(e) => this.handleOwnerFirstNameChange(e)} type="text" id="ownerfirstname" placeholder="Enter owner firstname" />
        </FormGroup>
        <FormGroup>
          <Label >Last Name</Label>
          <Input style={{color: 'black'}} value={this.state.ownerlastname} onChange={(e) => this.handleOwnerLastNameChange(e)} type="text" id="ownerlastname" placeholder="Enter owner lastname" />
        </FormGroup>
        <FormGroup>
          <Label >Email</Label>
          <Input style={{color: 'black'}} value={this.state.owneremail} onChange={(e) => this.handleOwnerEmailChange(e)} type="text" id="owneremail" placeholder="Enter owner email" />
        </FormGroup>
        <FormGroup>
          <Label >Date of Birth</Label>
          <UncontrolledDropdown isOpen={this.state.ownerdropDownDate}  toggle={() => this.toggleOwnerDateDropDown()}>
            <DropdownToggle
              style={{
                height: 40,
                width: '100%',
                color: "rgba(0,0,0, 0.5)",
                borderColor: "rgba(211,211,211, 0.5)",
                backgroundColor: "white",
              }}
              caret
            >
            <Label style={{ cursor: 'pointer', fontSize: 15, paddingLeft:5, textAlign:'start', color: this.state.selectedOwnerDate === "" ? 'gray' : 'black', height:12, width: '98%'}}>{this.state.selectedOwnerDate === "" ? 'Select Date of Birth' : this.state.selectedOwnerDate}</Label> 
            </DropdownToggle>
            <DropdownMenu>
              <div >
                <Calendar
                  onChange={this.handleOwnerDateChange.bind(this)}
                  maxDate={this.state.maxDate}
                />
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>        
        </FormGroup>
        <FormGroup>
          <Label >Owner Home Address line 1</Label>
          <Input 
            style={{color: 'black'}} 
            value={this.state.owneraddress1}
            onChange={e => this.handleOwnerAddress1(e)}
            type="text"
            placeholder="Address line 1"
            autoComplete="owner address1"
          />
        </FormGroup>
        <FormGroup>
          <Label >Address line 2 (optional)</Label>
          <Input 
            value={this.state.owneraddress2}
            onChange={e => this.handleOwnerAddress2(e)}
            style={{ color: "black" }}
            type="text"
            placeholder="Address line 2 (optional)"
            autoComplete="owner address2" 
          />
        </FormGroup>
        <FormGroup>
          <Label >City</Label>
          <Input 
            value={this.state.ownercity}
            onChange={e => this.handleOwnerCity(e)}
            style={{color: "black" }}
            type="text"
            placeholder="City"
            autoComplete="owner city"
          />
        </FormGroup>
        <FormGroup>
          <Label >County</Label>
          <Input
            style={{ color: this.state.ownercounty !== "" ? "black" : null }}
            value={this.state.ownercounty}
            onChange={e => this.handleOwnerCounty(e)}
            type="select"
            placeholder="County"
            autoComplete="owner county"
          >
            <option value="" disabled>
              Select County
            </option>
            {this.CountyData.map(county => (
              <option
                style={{ color: "black" }}
                key={county}
                value={county}
              >
                {county}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label >Country</Label>
          <Input value={this.state.ownercountry} onChange={(e) => this.handleOwnerCountryChange(e)} style={{color: this.state.ownercountry == "" ? 'grey': 'black'}} type="select" name="owner country" >
          <option value='' disabled>Select Country</option>
          {this.EuropeCountry.map(country =>
            <option style={{color:'black'}} key={country.key} value={country.value}>{country.key}</option>
          )}
          </Input>
        </FormGroup>

      </div>
    )
  }


  renderLoadingModal() {

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: require('../../../assets/animation/payment_loading.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <Modal    
        aria-labelledby="contained-modal-title-vcenter"
        centered
        isOpen={this.state.loadingModal} >
        <ModalBody>
          <div>
            <Lottie 
              options={defaultOptions}
              height={200}
              width={200}/>

            <p style={{textAlign: 'center', paddingLeft:20, paddingRight:20, fontSize: 16, fontWeight: '600'}}>
              Please don't close the browser or refresh the page while we are connecting to your payment account. This proccess may take a while.
            </p>
          </div>
        </ModalBody>
      </Modal>
    )
  }


  render() {
    const { isIBANEmpty, isCountryEmpty, isNextButtonActive, isProceedButtonVisible, isSaving} = this.state

    return (
      <div>
        <Card >
          <CardHeader>
            <strong>Setup Bank Account</strong>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label >Holder Type</Label>
              <Input value={this.state.holdertype} onChange={(e) => this.handleHolderType(e)} style={{color: this.state.holdertype == "" ? 'grey': 'black'}} type="select" name="holdertype">
              <option value='' disabled>Select Holder Type</option>
              {this.HolderType.map(holdertype =>
                <option style={{color:'black'}} key={holdertype.key} value={holdertype.value}>{holdertype.key}</option>
              )}
              </Input>
            </FormGroup>

            {this.state.holdertype === "individual" ? this.renderIndividualInput() : null }
           
            <FormGroup>
              <Label >Currency</Label>
              <Input value={this.state.currency} disabled type="text" name="currency" ></Input>
            </FormGroup>
            <FormGroup>
              <Label >IBAN</Label>
              <Input style={{color: 'black'}} value={this.state.iban} onChange={(e) => this.handleIBANChange(e)} type="text" id="IBAN" placeholder="Enter your IBAN number" invalid={isIBANEmpty ? true : false} />
              <FormFeedback>Please enter your IBAN number</FormFeedback>
            </FormGroup>

            { this.state.holdertype === "company" ? this.renderCompanyInput() : null }

            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <Checkbox
                checked={this.state.agreementChecked}
                onChange={e => this.handleCheckBoxChange(e)}
                style={{ padding: 0, marginRight: 10 }}
              />
              <span style={{ fontSize: 14 }} >
                I accept the
              </span>
              <Button color="link" onClick={() => this.openStripeServicesAgreement()} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                Stripe Services 
              </Button>
              <span style={{ fontSize: 14 }} >
                and
              </span>
              <Button color="link" onClick={() => this.openConnectedAccountAgreement()} style={{ fontSize: 14, paddingLeft:5, paddingRight:5, marginTop: 2, paddingTop: 2, fontWeight: '500',color: "#20a8d8" }} >
                Connected Account 
              </Button>
              <span style={{ fontSize: 14 }} >
                agreements
              </span>
              
            </div>
           
            <div className="form-actions">
              <Button onClick={() => this.props.goBack()} className="float-left" type="submit" outline color="primary">Back</Button>

              {isProceedButtonVisible ? 
              <Button style={{marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
              : null}
              <Button disabled={isNextButtonActive? false : true} onClick={() => this.addNewCard()} className="float-right" type="submit" color="primary">{isSaving ? "Saving..." : "Save" }</Button>
            </div>
          </CardBody>
        </Card>
        
        {this.renderLoadingModal()}

        <ToastContainer hideProgressBar/>
      </div>
    );
  }
}

const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Addded</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error adding account. Please try again</b>
   
  </div>
)


SetupBank.propTypes = propTypes;
SetupBank.defaultProps = defaultProps;

export default SetupBank;
