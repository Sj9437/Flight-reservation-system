document.getElementById("admin-logout").addEventListener("click", function() {
    console.log("logout clicked");
    callLogoutApi();
});

function callLogoutApi(){
    var adminCredential;
    // check if userCredential local storage already exist or not
    if (window.localStorage.getItem("adminCredential") === null) {
        console.log("adminCredential local storage not exist")
    }
    else{
        console.log("adminCredential local storage exist")
        adminCredential =  JSON.parse(window.localStorage.getItem('adminCredential'));
        console.log("adminCredential local storage retrieved")
        console.log(adminCredential["access_token"]); 
    }

    //api calling
    var myHeaders = new Headers();
    access_token = "Bearer  " + adminCredential["access_token"];
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
                alert(objLogoutResultSet["message"])
                nextPage()
            }
        })
        .catch(error => console.log('error', error));


    function nextPage(){
        // var a = document.getElementById("admin-logout");
        // a.setAttribute("href", "../../index.html");
        location.replace("../AdminLogin/GetStarted/index.html");
    } 
}
