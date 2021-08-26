const form = document.getElementById("form");
const airportname = document.getElementById("airportname");
const iatacode = document.getElementById("iatacode");
const country = document.getElementById("country");
// const state = document.getElementById("state");
const city = document.getElementById("city");

form.addEventListener("submit", (event)=> {
    event.preventDefault();
    inspect();
});

function inspect() {
  //The the values from the inputs
    const airportnameValue = airportname.value.trim();
    const iatacodeValue = iatacode.value.trim();
    const countryValue = country.value.trim();
    // const stateValue = state.value.trim();
    const cityValue = city.value.trim();

    var AName, IATACode, Country, City;

    if (airportnameValue == "") {
        //display error
        //add error class
        setErrorFor(airportname, "Airport Name can't be blank");
        isValid = false
    }
    else{
        if(airportnameValue.length < 4){
            setErrorFor(airportname, "Airport Name can't be less than 4");
            isValid = false
        }
        else{
            setSuccessFor(airportname);
            AName = true
        }
        // else{
        //     if(/^[A-Z]+$/.test(airportnameValue)){
        //         setSuccessFor(airportname);
        //         AName = true
        //     }
        //     else{
        //         setErrorFor(airportname, "Airport Name only contain uppercase");
        //         isValid = false
        //     }
            
        // }
    } 

        
      
    if (iatacodeValue == "") {
        setErrorFor(iatacode, "IATA Code can't be blank");
        isValid = false;
    }
    else{
        if(iatacodeValue.length < 3){
            setErrorFor(iatacode, "IATA Code can't be less than 4 characters");
            isValid = false;
        }
        else{
            if((/^[A-Z]/.test(iatacodeValue))){
                setSuccessFor(iatacode);
                IATACode = true
            }
            else{
                setErrorFor(iatacode, "1st char Must be Capital Letter");
                isValid = false;
            }
        }
    }

    if (countryValue == "") {
        setErrorFor(country, "Country can't be blank");
        isValid = false;
    }
    else{
        if(countryValue.length < 4){
            setErrorFor(country, "Country Must be of greater than or equal to 4 characters");
            isValid = false;
        }
        else{
            if((/^[A-Z]/.test(countryValue))){
                setSuccessFor(country);
                Country = true
            }
            else{
                setErrorFor(country, "1st char Must be Capital Letter");
                isValid = false;
            }
        }
    }

   

    if (cityValue == "") {
        setErrorFor(city, "City can't be blank");
        isValid = false;
    }
    else{
        if(cityValue.length < 4){
            setErrorFor(city, "City Must be of greater than or equal to 4 characters");
            isValid = false;
        }
        else{
            if((/^[A-Z]/.test(cityValue))){
                setSuccessFor(city);
                City = true
            }
            else{
                setErrorFor(city, "1st char Must be Capital Letter");
                isValid = false;
            }
        }
    }
    

    if (airportnameValue === "" || iatacodeValue === "" || countryValue === "" || cityValue === "") {
        //display error
        //add error class
            isValid = false;
    }

    if (AName && IATACode && Country && City){
        isValid = true
    } 
    
    if (isValid){
        alert("Please Wait.......");
        // api calling
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var adminCredential = JSON.parse(window.localStorage.getItem("adminCredential"));
        access_token = "Bearer " + adminCredential['access_token'];
        myHeaders.append("Authorization", access_token);

        var raw = JSON.stringify({
        "AirportName": airportnameValue,
        "Country": countryValue,
        "City": cityValue
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        url = "http://127.0.0.1:5000/airport/" + iatacodeValue

        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result);
            responseData = JSON.parse(result);
            if (responseData['status']==201){
                alert("Airport Added Successfully...");
            }
            else if(responseData['status']==400){
                alert(responseData['message']);
            }
        })
        .catch(error => console.log('error', error));
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
} 