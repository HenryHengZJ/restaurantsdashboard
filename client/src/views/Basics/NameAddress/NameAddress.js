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
} from 'reactstrap';
import './NameAddress.css'; 
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {listCounties, listCountry} from "../../../utils"

class NameAddress extends Component {

  constructor(props) {
    super(props);

    this.handleRestaurantNameChange = this.handleRestaurantNameChange.bind(this);
    this.handleRestaurantPhoneNumber = this.handleRestaurantPhoneNumber.bind(this);
    this.handleRestaurantStreet = this.handleRestaurantStreet.bind(this);
    this.handleRestaurantCounty = this.handleRestaurantCounty.bind(this);
    this.handleRestaurantCity = this.handleRestaurantCity.bind(this);
    this.handleRestaurantPostalCode = this.handleRestaurantPostalCode.bind(this);
    this.handleRestaurantCountry = this.handleRestaurantCountry.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.inputCoverOpenFileRef = React.createRef()
    this.inputLogoOpenFileRef = React.createRef()

    this.state = {
      logoFile: '',
      logoPreviewUrl: '',
      coverImageFile: '',
      coverImagePreviewUrl: '',
      _id: "",
      catererName: "",
      isNameEmpty: false,
      catererPhoneNumber: "",
      isPhoneNumberEmpty: false,
      catererStreet: "",
      isStreetEmpty: false,
      catererCity: "",
      isCityEmpty: false,
      catererPostalCode: "",
      catererCounty: "",
      isCountyEmpty: false,
      catererCountry: "",
      isCountryEmpty: false,
      isNextButtonActive: false,
      isProceedButtonVisible: false,
      isSaving: false,
    };

    this.CountyData  = listCounties()

    this.CountryData  = listCountry()

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
            catererName: typeof response.data[0].catererName !== 'undefined' ? response.data[0].catererName : "",
            catererPhoneNumber: typeof response.data[0].catererPhoneNumber !== 'undefined' ? response.data[0].catererPhoneNumber : "",
            catererStreet: typeof response.data[0].catererAddress !== 'undefined' ? response.data[0].catererAddress : "",
            catererCounty: typeof response.data[0].catererCounty !== 'undefined' ? response.data[0].catererCounty : "",
            catererPostalCode: typeof response.data[0].catererPostalCode !== 'undefined' ? response.data[0].catererPostalCode : "",
            catererCity: typeof response.data[0].catererCity !== 'undefined' ? response.data[0].catererCity : "",
            catererCountry: typeof response.data[0].catererCountry !== 'undefined' ? response.data[0].catererCountry : "",
            logoPreviewUrl: typeof response.data[0].profilesrc !== 'undefined' ? response.data[0].profilesrc : "",
            coverImagePreviewUrl: typeof response.data[0].coversrc !== 'undefined' ? response.data[0].coversrc : ""
          }, () => {
            this.checkAllInput()
          })
        } 
      })
      .catch((error) => {
      });
  }

  handleRestaurantNameChange(e) {
    this.setState({ 
      catererName: e.target.value,
      isNameEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantPhoneNumber(e) {
    if(isNaN(e.target.value)){
      //Letters
    }
    else if (e.target.value.includes("+") || e.target.value.includes("-") || e.target.value.includes(".")) {
      //Letters
    }
    else {
      //Valid Number
      this.setState({ 
        catererPhoneNumber: e.target.value,
        isPhoneNumberEmpty: e.target.value == "" ? true : false
      },() => {
        this.checkAllInput()
      })
    }
  }
  
  handleRestaurantStreet(e) {
    this.setState({ 
      catererStreet: e.target.value,
      isStreetEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantCounty(e) {
    this.setState({ 
      catererCounty: e.target.value,
      isCountyEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantCity(e) {
    this.setState({ 
      catererCity: e.target.value,
      isCityEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantPostalCode(e) {
    this.setState({ catererPostalCode: e.target.value });
  }

  handleRestaurantCountry(e) {
    this.setState({ 
      catererCountry: e.target.value, 
      isCountryEmpty: e.target.value == "" ? true : false,
    },() => {
      this.checkAllInput()
    })
  }

  handleLogoChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        logoFile: file,
        logoPreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  removeLogo = () => {
    this.setState({
      logoFile: "",
      logoPreviewUrl: ""
    });
  }


  handleCoverImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        coverImageFile: file,
        coverImagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  removeCoverPhoto = () => {
    this.setState({
      coverImageFile: "",
      coverImagePreviewUrl: ""
    });
  }

  checkAllInput = () => {
    const {catererName, catererPhoneNumber, catererStreet, catererCity, catererCounty, catererCountry} = this.state
    if (catererName != "" && catererPhoneNumber != "" && catererStreet != "" && catererCity != "" && catererCounty != "" && catererCountry != "") {
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

  handleSave() {

    this.setState({
      isSaving: true,
    })

    const {coverImageFile, logoFile, catererName, catererPhoneNumber, catererStreet, catererCity, catererCounty, catererCountry, catererPostalCode, _id} = this.state

    var fulladdress = "";

    //Full address format
    var postalcode = "";
    if (catererPostalCode !== "") {
      postalcode = ', ' + catererPostalCode
    }

    fulladdress = catererStreet + ', ' + catererCity + ', ' + catererCounty + postalcode + ', ' + catererCountry;
    
    //Find Country Code
    var catererCountryCode = "";
    var itemindex = this.CountryData.findIndex(x => x.value === catererCountry);
    if (itemindex > 0) {
      catererCountryCode =  this.CountryData[itemindex].code
    }
    
    //Data to be saved

    let formData = new FormData();    //formdata object
    formData.append('catererName', catererName);
    formData.append('catererPhoneNumber', catererPhoneNumber);
    formData.append('catererAddress', catererStreet);
    formData.append('catererFullAddress', fulladdress);
    formData.append('catererCity', catererCity);
    formData.append('catererCounty', catererCounty);
    formData.append('catererCountry', catererCountry);
    formData.append('catererCountryCode', catererCountryCode);

    if (coverImageFile !== "") {
      formData.append('coverimgfiles', coverImageFile);
    }

    if (logoFile !== "") {
      formData.append('logofiles', logoFile);
    }

    /*var data = {
      catererName: catererName,
      catererPhoneNumber: catererPhoneNumber,
      catererAddress: catererStreet,
      catererFullAddress: fulladdress,
      catererCity: catererCity,
      catererCounty: catererCounty,
      catererCountry: catererCountry,
      catererCountryCode: catererCountryCode,
    }*/
   // alert(JSON.stringify(data))

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.UPDATEcaterernameaddress;

    axios.put(url, formData, {withCredentials: true}, {headers: headers})
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

  handleProceed = () => {
    this.props.history.push('/caterer/basics/description')
  }

  render() {
    const {logoPreviewUrl, coverImagePreviewUrl, isNameEmpty, isPhoneNumberEmpty, isStreetEmpty, isCityEmpty, isCountyEmpty, isCountryEmpty, isNextButtonActive, isProceedButtonVisible, isSaving, addressManual} = this.state

    return (
      <div style={{marginBottom: 40}} className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="9">
            <Card >
              <CardHeader>
                <strong>What's your business name & address?</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label style={{color: 'black'}}>Restaurant / Caterer Logo</Label>
                  
                  <div onClick={() => this.inputLogoOpenFileRef.current.click()} style={{ cursor:'pointer', width: 80, height: 80, position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
                    <img 
                      style={{ objectFit:'cover', width: 'auto', height: '100%', display: 'inline' }}
                      src={logoPreviewUrl !== "" ? logoPreviewUrl : "https://s3-eu-west-1.amazonaws.com/foodiebeegeneralphoto/user_default.png"} />
                  </div>
                  
                  {logoPreviewUrl !== "" ?
                  <Button
                    style={{ marginTop: 10, borderRadius: 0, opacity: 0.9 }}
                    outline
                    color="danger"
                    onClick={() => this.removeLogo()}
                  >
                    Remove
                  </Button> : null }

                  <div style={{marginTop: 10}}>
                    <input
                      id="fileInput"
                      type="file"
                      ref={this.inputLogoOpenFileRef}
                      onChange={(e)=>this.handleLogoChange(e)}
                    />
                  </div>
                 
                  <FormFeedback>Please input only jpg / png format</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="company">Restaurant / Caterer Name*</Label>
                  <Input style={{color: 'black'}} value={this.state.catererName} onChange={(e) => this.handleRestaurantNameChange(e)} type="text" id="company" placeholder="Enter your restaurant name" invalid={isNameEmpty ? true : false} />
                  <FormFeedback>Please enter your restaurant name</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="telephone">Phone Number *</Label>
                  <Input style={{color: 'black'}} value={this.state.catererPhoneNumber} onChange={(e) => this.handleRestaurantPhoneNumber(e)} type="text" id="telephone" placeholder="Enter your restaurant phone number (e.g: 0831456789)" invalid={isPhoneNumberEmpty ? true : false}/>
                  <FormFeedback>Please enter your phone number</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="street">Street *</Label>
                  <Input style={{color: 'black'}} value={this.state.catererStreet} onChange={(e) => this.handleRestaurantStreet(e)} type="text" id="street" placeholder="Enter street name" invalid={isStreetEmpty ? true : false}/>
                  <FormFeedback>Please enter restaurant street name</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="county">County *</Label>
                  <Input value={this.state.catererCounty} onChange={(e) => this.handleRestaurantCounty(e)} style={{color: this.state.catererCounty == "" ? 'grey': 'black'}} type="select" name="select" id="select" invalid={isCountyEmpty ? true : false}>
                  <option value='' disabled>Select County</option>
                  {this.CountyData.map(county =>
                    <option style={{color:'black'}} key={county} value={county}>{county}</option>
                  )}
                  </Input>
                </FormGroup>
                <FormGroup row className="my-0">
                  <Col xs="8">
                    <FormGroup>
                      <Label htmlFor="city">City *</Label>
                      <Input style={{color: 'black'}} value={this.state.catererCity} onChange={(e) => this.handleRestaurantCity(e)} type="text" id="city" placeholder="Enter your city" invalid={isCityEmpty ? true : false}/>
                      <FormFeedback>Please enter your restaurant based city</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input style={{color: 'black'}} value={this.state.catererPostalCode} onChange={(e) => this.handleRestaurantPostalCode(e)} type="text" id="postal-code" placeholder="Postal Code"/>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="country">Country *</Label>
                  <Input value={this.state.catererCountry} onChange={(e) => this.handleRestaurantCountry(e)} style={{color: this.state.catererCountry == "" ? 'grey': 'black'}} type="select" name="select" id="select" invalid={isCountryEmpty ? true : false}>
                  <option value='' disabled>Select Country</option>
                  {this.CountryData.map(country =>
                    <option style={{color:'black'}} key={country.value} value={country.value}>{country.value} {country.code}</option>
                  )}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label style={{color: 'black'}}>Cover Image</Label>
                  <div>
                    <input
                      id="fileInput"
                      type="file"
                      ref={this.inputCoverOpenFileRef}
                      onChange={(e)=>this.handleCoverImageChange(e)}
                    />
                  </div>
                  {coverImagePreviewUrl === "" ?
                  <div onClick={() => this.inputCoverOpenFileRef.current.click()} style={{ cursor:'pointer', marginTop:20, width: "100%", height: 200, display:'flex', alignItems: 'center', backgroundColor: 'rgba(211,211,211,0.7)'}}>
                      <img
                      style={{ margin: 'auto', objectFit: "cover", width: 70, height: 70 }}
                      src={"https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png"}
                    />
                    </div>
                    :
                  <img
                    style={{cursor:'pointer', marginTop:20, objectFit: "cover", width: "100%", height: 200 }}
                    onClick={() => this.inputCoverOpenFileRef.current.click()}
                    src={coverImagePreviewUrl !== "" ? coverImagePreviewUrl : "https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png"}
                  />
                    }
                  {coverImagePreviewUrl !== "" ?<Button
                    style={{ borderRadius: 0, opacity: 0.9 }}
                    color="danger"
                    block
                    onClick={() => this.removeCoverPhoto()}
                  >
                    Remove
                  </Button> : null }
                  <FormFeedback>Please input only jpg / png format</FormFeedback>
                </FormGroup>

                <div className="form-actions">
                  {isProceedButtonVisible ? 
                  <Button style={{marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button disabled={isNextButtonActive? false : true} onClick={this.handleSave} className="float-right" type="submit" color="primary">{isSaving ? "Saving..." : "Save" }</Button>
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

export default NameAddress;
