const form = document.getElementById("adminLogin-form");
const mail = document.getElementById("mail");
const pass = document.getElementById("password");

console.log("inside js page")

form.addEventListener("submit", (event)=> {
    event.preventDefault();
    inspect();
});

function inspect(){
    const mailValue = mail.value.trim();
    const passValue = pass.value.trim();

    var Mail, Pass;


    if (mailValue != "") {
        Mail = true
    }
    if (passValue != "") {
        Pass = true
    }

    if (mailValue === "" || passValue === "") {
        isValid = false;
    }
  
    if (Mail && Pass){
        isValid = true
    } 

    if (isValid){

        alert("Please Wait.........")
        // api calling
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

        fetch("http://127.0.0.1:5000/user/login", requestOptions)
        .then(response => response.text())
        .then(result => {
            // 1st store result into a variable here--> resultSet
            const loginResultSet = result ;
            console.log("LoginResultSet = ", loginResultSet);

            // 2nd convert that string var into a json obj here that obj is obj
            const objLoginResultSet = JSON.parse(loginResultSet);
            console.log(typeof(objLoginResultSet));
            console.log(objLoginResultSet);

            // 3rd retrive the keys from that json obj
            console.log(Object.keys(objLoginResultSet)); 

            storeinLocal(objLoginResultSet);
        })
        .catch(error => console.log('error', error));

    }

    function storeinLocal(responseData){

        console.log("inside function")
        console.log("response data : ", responseData);
        
        
        if (responseData["status"] == 401){
            $('#err-msg').text(responseData["message"] + "!!");
            // alert(responseData["message"]);
        }
        else if (responseData["status"] == 200){
            if (responseData["userid"] == 1){
                const adminCredential = {
                    "userid": responseData["userid"],
                    "access_token": responseData["access_token"], 
                    "refresh_token": responseData["refresh_token"],
                    "current_date_time" : formatAMPM()
                }
                // check if adminCredential local storage already exist or not
                if (window.localStorage.getItem("adminCredential") === null) {
                    console.log("adminCredential local storage not exist")
                    window.localStorage.setItem('adminCredential', JSON.stringify(adminCredential));
                    console.log("new adminCredential local storage created")
                }
                else{
                    console.log("admiCredential local storage exist")
                    window.localStorage.removeItem('adminCredential');
                    console.log("old adminCredential local storage deleted")
                        
                    window.localStorage.setItem('adminCredential', JSON.stringify(adminCredential));
                    console.log("new adminCredential local storage created")
                }
                nextPage();
            }
            else{
                //if userid != 1, so that user is not admin..
                // so we should logout that user
                // & asks the admin to give correct user credentials
                var myHeaders = new Headers();
                access_token = "Bearer  " + responseData["access_token"];
                myHeaders.append("Authorization", access_token);

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
                };

                fetch("http://127.0.0.1:5000/user/logout", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    // 1st store result into a variable here--> resultSet
                    const logoutResultSet = result ;
                    console.log("LogoutResultSet = ", logoutResultSet);

                    // 2nd convert that string var into a json obj here that obj is obj
                    const objLogoutResultSet = JSON.parse(logoutResultSet);
                    console.log(typeof(objLogoutResultSet));
                    console.log(objLogoutResultSet);

                    if (objLogoutResultSet["status"] == 200){
                        alert("Please Enter Correct Admin GmailID & Password")
                    }
                })
                .catch(error => console.log('error', error));
            }
            
        }
        
    }

    // current date time
    function formatAMPM() {
        var date = new Date();
        var hours = date.getHours();
        var days = date.getDay(); 
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = date + ' ' + hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }


    function nextPage(){
        location.replace("../../../Main/index.html");
    } 

}


