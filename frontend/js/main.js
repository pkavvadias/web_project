function Responses() {
    let formdata = {
        "username": document.getElementById('username-user').value,
        "password": document.getElementById('password-user').value
    }
    data = JSON.stringify(formdata);
    // console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:3000/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log('mainjs');
            if (xhr.status == 403) {
                alert(xhr.responseText);
            } else if (xhr.status == 200) {
                window.location.href = "./dashboard"
            }
        }
    };
    xhr.send(data);
}