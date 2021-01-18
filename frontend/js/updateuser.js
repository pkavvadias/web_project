function check_password() {
    console.log(document.getElementById("pwd").value);

    var password = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
    if (password.test(document.getElementById('pwd').value) == true) {
        document.getElementById('pwd').setCustomValidity('');
    } else {
        document.getElementById('pwd').setCustomValidity('Must contain at least one number, one uppercase letter, one special character and at least 8 or more characters');
    }
}




function password_matching() {
    var password = document.getElementById('pwd');
    console.log(password.value)
    var password_cf = document.getElementById('pwd_cf');
    if (password.value != password_cf.value) {
        password_cf.setCustomValidity('You must put the same password.');

    } else {
        password_cf.setCustomValidity('');

    }
}

document.getElementById('pwd').addEventListener('onchange', check_password);
document.getElementById('pwd_cf').addEventListener('onchange', password_matching);



function Update() {
    let formdata = {
        "username": document.getElementById('username').value,
        "password_old": document.getElementById('pwd_old').value,
        "password": document.getElementById('pwd').value,
        "password_cf": document.getElementById('pwd_cf').value
    }
    data = JSON.stringify(formdata);
    // console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:3000/userprofile", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log('userprofile');
            if (xhr.status == 403) {
                alert(xhr.responseText);
            } else if (xhr.status == 200) {
                window.location.href = "./dashboard"
            }
        }
    };
    xhr.send(data);
}