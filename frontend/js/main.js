function Responses() {
    let formdata = {
        "username": document.getElementById('username-user').value,
        "password": document.getElementById('password-user').value
    }
    data = JSON.stringify(formdata);
    // console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/login", true);
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

// const getData = () => {
//   sendHttpRequest('GET', 'https://reqres.in/api/users').then(responseData => {
//     console.log(responseData);
//   });
// };


// const sendData = () => {
//   sendHttpRequest('POST', 'https://reqres.in/api/register', {
//     email: 'eve.holt@reqres.in'
//     // password: 'pistol'
//   })
//     .then(responseData => {
//       console.log(responseData);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };


exports = { sendHttpRequest };