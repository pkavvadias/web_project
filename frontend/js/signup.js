
function check_password() {
  console.log(document.getElementById("pwd").value);

  var password = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
  if (password.test(document.getElementById('pwd').value) == true) {
    document.getElementById('pwd').setCustomValidity('');
  }
  else {
    document.getElementById('pwd').setCustomValidity('Must contain at least one number, one uppercase letter, one special character and at least 8 or more characters');
  }
}




function password_matching() {
  var password = document.getElementById('pwd');
  var password_cf = document.getElementById('pwd_cf');
  if (password.value != password_cf.value) {
    password_cf.setCustomValidity('You must put the same password.');

  }

  else {
    password_cf.setCustomValidity('');

  }
}




document.getElementById('pwd').addEventListener('keyup', check_password);
document.getElementById('pwd_cf').addEventListener('keyup', password_matching);


(function submit_listener() {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    var inputs = document.getElementsByClassName('input form-control');
    var check = true;

    // const input = document.getElementById('email')
    const input = document.getElementById('email');
    const nice = document.getElementById('nice');
    // const log = document.getElementById('log')
    console.log(input);
    // input.addEventListener('invalid', logValue)

    input.addEventListener('keyup', function () {
      if (check === true) {
        var val = input.checkValidity();
        console.log(val);
        if (val !== true) {
          input.classList.add('invalid_love');
          nice.classList.add('love_yes');
          console.log(5);
        } else {
          input.classList.add('valid_hate');
          nice.classList.remove('love_yes');
          nice.classList.add('love_no');
        };
      }
    });

    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        input.classList.remove('valid_hate');
        nice.classList.remove('love_yes');
        nice.classList.add('love_no');
        form.classList.add('was-validated');
        check = false;
      }, false);
    });
  }, false);
})();