function password_matching() {
    var password = document.getElementById('pwd');
    console.log(password.value)
    var password_cf = document.getElementById('pwd_cf');
    if (password.value != password_cf.value) {
        password_cf.setCustomValidity('You must put the same password.');
        return false;
    } else {
        password_cf.setCustomValidity('');
        return true;
    }
}

//document.getElementById('pwd').addEventListener('onchange', check_password);
//document.getElementById('pwd_cf').addEventListener('onchange', password_matching);
var error = false;
(function submit_listener() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        var inputs = document.getElementsByClassName('input form-control');
        var check = true;

        const username = document.getElementById('username')
            // const input = document.getElementById('email');
        const password = document.getElementById('pwd');
        const password_cf = document.getElementById('pwd_cf');
        const nice = document.getElementById('nice');

        // const log = document.getElementById('log')

        // input.addEventListener('invalid', logValue)

        username.addEventListener('keyup', function() {
            if (check === true && error === true) {
                username.classList.remove('invalid_love');
                document.getElementById("error").remove();
            }
        });

        password.addEventListener('keyup', function() {
            if (check === true) {
                var val = password.checkValidity();
                console.log(val);
                if (val !== true) {
                    password.classList.add('invalid_love');
                    password.classList.remove('valid_hate');
                    nice_p.classList.add('love_yes');
                    nice_p.classList.remove('love_no');

                    console.log(5);
                } else {
                    password.classList.add('valid_hate');
                    password.classList.remove('invalid_love');
                    nice_p.classList.remove('love_yes');
                    nice_p.classList.add('love_no');
                };
            }
        });

        password_cf.addEventListener('keyup', function() {
            console.log(555)
            if (check === true) {
                var ans = password_matching();
                console.log(ans)
                if (ans !== true) {
                    password_cf.classList.add('invalid_love');
                    nice_pp.classList.add('love_yes');
                    nice_pp.classList.remove('love_no');
                    password_cf.classList.remove('valid_hate');
                    console.log(5);
                } else {
                    console.log(666)
                    password_cf.classList.add('valid_hate');
                    nice_pp.classList.add('love_no');
                    nice_pp.classList.remove('love_yes');
                    password_cf.classList.remove('invalid_love');
                };

            }
        });



        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                nice.classList.remove('love_yes');
                nice.classList.add('love_no');
                password.classList.remove('valid_hate');
                nice_p.classList.remove('love_yes');
                nice_p.classList.add('love_no');
                password_cf.classList.remove('valid_hate');
                nice_pp.classList.remove('love_yes');
                nice_pp.classList.add('love_no');
                form.classList.add('was-validated');
                check = false;
            }, false);
        });
    }, false);
})();





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
    xhr.open("POST", "http://localhost:3000/userprofile", true);
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