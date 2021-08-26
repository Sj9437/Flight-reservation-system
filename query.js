apiCall();

function apiCall() {
    const adminCredential = JSON.parse(window.localStorage.getItem("adminCredential"));

    var myHeaders = new Headers();
    var access_token = "Bearer " + adminCredential['access_token']
    myHeaders.append("Authorization", access_token);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:5000/allquery", requestOptions)
    .then(response => response.text())
    .then(result => {
        // console.log(result);
        var objResult = JSON.parse(result);
        // console.log(objResult);
        var newjson = objResult.Queries;
        // var newjson = {
        //     cart: newjson,
        // }
        // console.log("newjson : ", newjson);
        tableData(newjson);
    })
    .catch(error => console.log('error', error));
}

function tableData(newjson) {
    if (newjson){
        console.log("JSON DATA NOT NULL");
        $.each(newjson, function(key, value){
            // console.log("key = ", key);
            // console.log("value : ", value);
            $('tbody').append(`<tr>
            <td class="Controller ID">${value.ControllerId}</td>
            <td class="Query Given">${value.Query}</td>
            <td class="Given Date">${value.GivenDate}</td>
            </tr>`);
        })
    }
    else{
        $('tbody').append(`<tr>
            <td class="Controller ID">No Queries Given Yet........</td>
        </tr>`);
    }
}
