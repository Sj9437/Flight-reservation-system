const form = document.getElementById("form");
const airlinename = document.getElementById("airlinename");
const airlinecode = document.getElementById("airlinecode");
const avtar = document.getElementById("avtar");

const mail = document.getElementById("mailid");
const pass = document.getElementById("password");
const conf = document.getElementById("confirm");

form.addEventListener("submit", (event)=> {
    event.preventDefault();
    inspect();
});

// fun for aname, acode, avtar check
function inspect() {
  //The the values from the inputs
    const airlinenameValue = airlinename.value.trim();
    const airlinecodeValue = airlinecode.value.trim();
    const avtarValue = avtar.value.trim();  

    var AName, ACode, Avtar

    if (airlinenameValue == "") {
        //display error
        //add error class
        setErrorFor(airlinename, "Airline Name can't be blank");
        isValid = false
    }
    else{
        if(airlinenameValue.length < 4){
            setErrorFor(airlinename, "Airline Name can't be less than 4");
            isValid = false
        }
        else{
            if(/^[A-Z]+$/.test(airlinenameValue)){
                //add success class
                setSuccessFor(airlinename);
                AName = true
            }
            else{
                setErrorFor(airlinename, "Airline Name only contain uppercase");
                isValid = false
            }
            
        }
    } 

        
      
    if (airlinecodeValue == "") {
        setErrorFor(airlinecode, "Airline Code can't be blank");
        isValid = false;
    }
    else{
        if(airlinecodeValue.length != 2){
            setErrorFor(airlinecode, "Airline Code Must be of 2 characters");
            isValid = false;
        }
        else{
            if((/^[A-Z]/.test(airlinecodeValue))){
                setSuccessFor(airlinecode);
                ACode = true
            }
            else{
                setErrorFor(airlinecode, "1st char Must be Capital Letter");
                isValid = false;
            }
        }
    }

    if (avtarValue == "") {
        //display error
        //add error class
        setErrorFor(avtar, "Picture not given");
        isValid = false
    }
    else{
        setSuccessFor(avtar);
        Avtar = true
    }   

    if (airlinenameValue === "" || airlinecodeValue === "" || avtarValue === "") {
        //display error
        //add error class
            isValid = false;
    }

    if (AName && ACode && Avtar){
        isValid = true
    } 
    
    if (isValid){
        checkAirlineExist(airlinecodeValue);
        
        

        // registerAirline(airlinenameValue, airlinecodeValue, avtarValue);

        
    }

} 

// fun for mail & password check
function createController() {
    const mailValue = mail.value.trim();
    const passValue = pass.value.trim();
    const confValue = conf.value.trim();

    var Mail, Pass, Conf;


    if (mailValue == "") {
        setErrorFor(mail, "Please enter the MailId");
        isValid = false
    }
    else{
        if (validateEmail(mailValue)){
            setSuccessFor(mail);
            Mail = true
        }
        else{
            setErrorFor(mail, "Please enter a valid MailId");
            isValid = false
        }
    }

    if (passValue == "") {
        setErrorFor(pass, "Password can't be blank");
        isValid = false
    }
    else{
        setSuccessFor(pass);
        Pass = true
    }

    if (confValue == "") {
        setErrorFor(conf, "Confirm Password can't be blank");
        isValid = false
    }
    else{
        if (passValue != confValue){
            setErrorFor(conf, "your password & confirm password do not match.....");
            isValid = false
        }
        else{
            setSuccessFor(conf);
            Conf = true
        }
    }

    if (mailValue === "" || passValue === "" || confValue === "") {
        isValid = false;
    }
  
    if (Mail && Pass && Conf){
        isValid = true
    } 

    if (isValid){
        checkUserExist(mailValue, passValue);    
    }

    function validateEmail(elementValue){      
        var emailPattern = /^[a-z0-9._-]+@gmail.com/;
        return emailPattern.test(elementValue); 
    } 

}














function setErrorFor (input, message) {
    const formControl = input.parentElement //.form-control
    const small = formControl.querySelector("small");
    //add error message inside small 
    small.innerText = message;
    //add error class
    formControl.className = "form-control error";
}
    
function setSuccessFor(input, message) {
    const formControl = input.parentElement //.form-control
    formControl.className = "form-control success";
}
// 
// 
// 
// 
// 
// 
// check if airline already exist or not
// 
// 
// 
// 
// 
// 
function checkAirlineExist(airlinecodeValue) {
    var adminCredential;
    // check if userCredential local storage already exist or not
    if (window.localStorage.getItem("adminCredential") === null) {
        // console.log("adminCredential local storage not exist")
    }
    else{
        // console.log("adminCredential local storage exist")
        adminCredential =  JSON.parse(window.localStorage.getItem('adminCredential'));
        // console.log("adminCredential local storage retrieved")
        // console.log(adminCredential["access_token"]); 
    }
    var myHeaders = new Headers();
    access_token = "Bearer " + adminCredential["access_token"];
    myHeaders.append("Authorization", access_token);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
    url = "http://127.0.0.1:5000/airline/" + airlinecodeValue;
    fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => {
        // console.log(result);
        responseData = JSON.parse(result);
        if (responseData['status']==200){
            setErrorFor(airlinename, "Airline with this name already exist");
            setErrorFor(airlinecode, "Acode with this code already exist");
        }
        else if(responseData['status']==404){
            // console.log("airline not found");
            createController();
        }
    })
    .catch(error => console.log('error', error));
}
//
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
function checkUserExist(mailValue, passValue) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "mailid": mailValue,
    "password": passValue
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:5000/user/verify", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result);
        responseData = JSON.parse(result);
        if (responseData['status']==400){
            setErrorFor(mail, "This Controller MailID already exist");
        }
        else{
            console.log("user not found");
            registerController(mailValue, passValue);
            registerAirline(airlinename.value.trim(), airlinecode.value.trim(), avtar.value.trim());
        }
    })
    .catch(error => console.log('error', error));
}


// 
// 
// 
// 
// 
// 
// function for registering new airline
// 
// 
// 
// 
// 
// 
function registerAirline(airlinenameValue, airlinecodeValue, avtarValue) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var adminCredential = JSON.parse(window.localStorage.getItem("adminCredential"));
    access_token = "Bearer " + adminCredential['access_token'];
    myHeaders.append("Authorization", access_token);

    var raw = JSON.stringify({
        "AirlineName": airlinenameValue
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    url = "http://127.0.0.1:5000/airline/" + airlinecodeValue;

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result);
            responseData = JSON.parse(result);
            if (responseData['status']==201){
                alert("Airline Added Successfully...");
            }
            else if(responseData['status']==400){
                alert(responseData['message']);
            }
        })
        .catch(error => console.log('error', error));
}
// 
// 
// 
// 
// 
// 
// function for registering new controller
// 
// 
// 
// 
// 
// 
function registerController(mailValue, passValue) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "mailid": mailValue,
        "password": passValue
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://127.0.0.1:5000/user/register", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            var regMsg = JSON.parse(result);
            console.log("regMsg = ", regMsg); 

            if (regMsg["status"] == 400){
                alert(regMsg["message"] + "....Please try another mailid")
            }
            else if (regMsg["status"] == 500){
                alert(regMsg["message"] + "....Internal server error...Please try after some time")
            }
            else if (regMsg["status"] == 201){
                alert(regMsg["message"] + "....Now Sign In to go to the User Panel")
            }
        })
        .catch(error => console.log('error', error));
}