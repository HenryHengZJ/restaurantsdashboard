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
import './BusinessProfile.css'; 
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {listCounties, listCountry} from "../../../utils"

class BusinessProfile extends Component {

  constructor(props) {
    super(props);

    this.handleRestaurantNameChange = this.handleRestaurantNameChange.bind(this);
    this.handleRestaurantPhoneNumber = this.handleRestaurantPhoneNumber.bind(this);
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
      isNextButtonActive: false,
      isProceedButtonVisible: false,
      isSaving: false,
    };

  }

  componentDidMount() {
  
    /*var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            catererName: typeof response.data[0].catererName !== 'undefined' ? response.data[0].catererName : "",
            catererPhoneNumber: typeof response.data[0].catererPhoneNumber !== 'undefined' ? response.data[0].catererPhoneNumber : "",
            logoPreviewUrl: typeof response.data[0].profilesrc !== 'undefined' ? response.data[0].profilesrc : "",
            coverImagePreviewUrl: typeof response.data[0].coversrc !== 'undefined' ? response.data[0].coversrc : ""
          }, () => {
            this.checkAllInput()
          })
        } 
      })
      .catch((error) => {
      });*/
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
        isPhoneNumberEmpty: false,
        isPhoneNumberFormatWrong: false
      },() => {
        this.checkAllInput()
      })
    }
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

  validatePhoneNumber (restaurantPhoneNumber) {
    var returnval
    if (restaurantPhoneNumber.substring(0,3) === '353' || restaurantPhoneNumber.substring(0,1) !== '0') {
      this.setState({
        isPhoneNumberFormatWrong: true
      });
      returnval = false
    } else if (restaurantPhoneNumber.length > 10 || restaurantPhoneNumber.length < 9 ) {
      this.setState({
        isPhoneNumberFormatWrong: true
      });
      returnval = false
    } else {
      returnval = true
    }

    return returnval
  }

  checkAllInput = () => {
    const {catererName, catererPhoneNumber} = this.state
    if (catererName != "" && catererPhoneNumber != "" && this.validatePhoneNumber(catererPhoneNumber)) {
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

    const {coverImageFile, logoFile, catererName, catererPhoneNumber} = this.state

    let formData = new FormData();    //formdata object
    formData.append('catererName', catererName);
    formData.append('catererPhoneNumber', catererPhoneNumber);

    if (coverImageFile !== "") {
      formData.append('coverimgfiles', coverImageFile);
    }

    if (logoFile !== "") {
      formData.append('logofiles', logoFile);
    }

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
    this.props.history.push('/restaurant/basics/location')
  }

  render() {
    const {logoPreviewUrl, coverImagePreviewUrl, isNameEmpty, isPhoneNumberEmpty, isNextButtonActive, isProceedButtonVisible, isSaving} = this.state

    return (
      <div style={{marginBottom: 40}} className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="9">
            <Card >
              <CardHeader>
                <strong>Business Profile</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label style={{color: 'black', fontWeight: '600' }}>Restaurant Logo</Label>
                  
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
                  <Label style={{fontWeight: '600', marginTop: 20}} htmlFor="company">Restaurant Name</Label>
                  <Input style={{color: 'black'}} value={this.state.catererName} onChange={(e) => this.handleRestaurantNameChange(e)} type="text" id="company" placeholder="Enter your restaurant name" invalid={isNameEmpty ? true : false} />
                  <FormFeedback>Please enter your restaurant name</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label style={{fontWeight: '600', marginTop: 20}} htmlFor="telephone">Phone Number</Label>
                  <Input style={{color: 'black'}} value={this.state.catererPhoneNumber} onChange={(e) => this.handleRestaurantPhoneNumber(e)} type="text" id="telephone" placeholder="Enter your restaurant phone number (e.g: 0831456789)" invalid={isPhoneNumberEmpty ? true : false}/>
                  <FormFeedback>Please enter your phone number</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label style={{fontWeight: '600', marginTop: 20}}>Cover Image</Label>
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
                  <Button style={{marginLeft:10, fontSize:17}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button style={{fontSize:17}} disabled={isNextButtonActive? false : true} onClick={this.handleSave} className="float-right" type="submit" color="primary">{isSaving ? "Updating..." : "Update" }</Button>
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

export default BusinessProfile;
