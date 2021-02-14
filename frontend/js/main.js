const username = document.getElementById('username-user');
const password = document.getElementById('password-user');
const wrong = document.getElementById('wrong');
const header = document.getElementById('title');

var check = false;

function Responses() {

    check = true;



    const wrong = document.getElementById('wrong');
    const header = document.getElementById('title');
    header.classList.remove('invalid_god');
    wrong.classList.remove('love_yes_yes');
    wrong.classList.add('love_no');

    let formdata = {
        "username": username.value,
        "password": password.value
    }
    data = JSON.stringify(formdata);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 403) {
                header.classList.add('invalid_god');
                wrong.classList.add('love_yes_yes');

            } else if (xhr.status == 200) {
                window.location.href = "./dashboard"
            } else if (xhr.status == 201) {
                window.location.href = "./admin"
            }
        }
    };
    xhr.send(data);
}


username.addEventListener('keyup', function() {
    if (check === true) {
        check = false;
        header.classList.remove('invalid_god');
        wrong.classList.remove('love_yes_yes');
        wrong.classList.add('love_no');
    }
});
username.addEventListener('keyup', function() {
    if (check === true) {
        check = false;
        header.classList.remove('invalid_god');
        wrong.classList.remove('love_yes_yes');
        wrong.classList.add('love_no');
    }
});


const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.responseType = 'json';

        if (data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };

        xhr.onerror = () => {
            reject('Something went wrong!');
        };

        xhr.send(JSON.stringify(data));
    });
    return promise;
};

exports = { sendHttpRequest };