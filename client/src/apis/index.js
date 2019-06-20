
export default {

    /*Caterer API*/
    UPDATEcaterer: "/caterer/updatecaterer",
    UPDATEcatererpassword: "/caterer/updatecatererpassword",
    UPDATEcaterernameaddress: "/caterer/updatecaterernameaddress",
    GETcaterer: "/caterer/getcaterer",

    /*Published API*/
    UPDATE_catererPublished: "/catererPublished/update_caterer_published",

    /*Menu API*/
    UPDATEmenu: "/menu/updatemenu",
    BULKUPDATEmenu: "/menu/bulkupdatemenu",
    GETmenu: "/menu/getmenu",
    ADDmenu: "/menu/addmenu",
    DELETEmenu: "/menu/deletemenu",
    BULKDELETEmenu: "/menu/bulkdeletemenu",

    /*Menu Published API*/
    GETmenuPublished: "/menuPublished/getmenuPublished",
    UPDATEmenuPublished: "/menuPublished/update_menu_published",
  
    /*Order API*/
    GETorder: "/order/getorder",
    GETorder_customer: "/order/getorder_customer",
    PUTacceptorder_order: "/order/acceptorder",
    PUTreject_order: "/order/rejectorder",

    /*Payment API*/
    GETcaterer_paymentaccount: "/payment/get_caterer_paymentaccount",
    GETcaterer_person: "/payment/get_caterer_person",
    POSTconfirm_payment: "/payment/confirm_payment",
    POSTcreate_caterer_external_bankaccount: "/payment/create_caterer_external_bankaccount",
    PUTupdate_caterer_paymentaccount: "/payment/update_caterer_paymentaccount",
    POSTcreate_caterer_paymentaccount: "/payment/create_caterer_paymentaccount",
    PUTupdate_caterer_person: "/payment/update_caterer_person",
    PUTupdate_caterer_paymentaccount: "/payment/update_caterer_paymentaccount",
    PUTupdate_caterer_external_bankaccount: "/payment/update_caterer_external_bankaccount",
    DELETE_caterer_external_bankaccount: "/payment/delete_caterer_external_bankaccount",

    /*Review API*/
    GETreview: "/review/getreview",

    /*Auth API*/
    POSTcatererlogin: "/auth/catererlogin",
    GETcatererlogout: "/auth/logout",
    POSTpasswordreset: "/auth/resetpassword",
    GETresetpassword: '/auth/getresetpassword',
    PUTupdatepassword: '/auth/updatepassword',
  };



