
// function check_password() {
//   console.log(document.getElementById("pwd").value);

//   var password = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
//   if (password.test(document.getElementById('pwd').value) == true) {
//     document.getElementById('pwd').setCustomValidity('');
//   }
//   else {
//     document.getElementById('pwd').setCustomValidity('Must contain at least one number, one uppercase letter, one special character and at least 8 or more characters');
//   }
// }


function password_matching() {
  var password = document.getElementById('pwd');
  var password_cf = document.getElementById('pwd_cf');
  if (password.value != password_cf.value) {
    password_cf.setCustomValidity('You must put the same password.');
    return false;

  }

  else {
    password_cf.setCustomValidity('');
    return true;
  }
}


var error_exists = false;
var submited = false;


function post_it() {
  $(document).ready(function () {

    // $('form').submit(function (event) {
    if (submited) {

      $('#username').removeClass('valid_hate');
      $('#username').removeClass('invalid_love'); // add the error class to show red input
      $('#error1').remove(); // add the actual error message under our input
      $('#error2').remove();
      $('#email').removeClass('valid_hate');
      $('#email').removeClass('invalid_love'); // add the error class to show red input
      // $('#error').remove();

      var formData = {
        'username': $('input[name=username]').val(),
        'email': $('input[name=email]').val(),
        'password': $('input[name=password]').val()
      };

      // process the form
      $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: '/register', // the url where we want to POST
        data: formData, // our data object
        dataType: 'json', // what type of data do we expect back from the server
        encode: true,
        success: function (xhr) {
          console.log(xhr.url);
          $(window).attr('location', xhr.url)
        },
        error: function (xhr, status, error) {
          var res = JSON.parse(xhr.responseText);
          // console.log()
          error_exists = true;
          $('form').removeClass('was-validated');
          // var count = res.keys(res).length;
          // console.log(res)

          if (res.user === true && res.email === false) {

            $('#username').removeClass('valid_hate');
            $('#username').addClass('invalid_love'); // add the error class to show red input
            $('#name-group').append('<div id="error1" class="love_yes"> Username is used. Choose another </div>'); // add the actual error message under our input

          } else if (res.user === false && res.email === true) {

            $('#email').removeClass('valid_hate');
            $('#email').addClass('invalid_love'); // add the error class to show red input
            $('#email-group').append('<div id="error2" class="love_yes"> An account exists with this email </div>'); // add the actual error message under our input

          } else {

            $('#username').removeClass('valid_hate');
            $('#username').addClass('invalid_love'); // add the error class to show red input
            $('#email').removeClass('valid_hate');
            $('#email').addClass('invalid_love'); // add the error class to show red input
            $('#name-group').append('<div id="error1" class="love_yes"> Username is used. Choose another </div>'); // add the actual error message under our input
            $('#email-group').append('<div id="error2" class="love_yes"> An account exists with this email </div>');

          }
        }
      })
      // stop the form from submitting the normal way and refreshing the page
      // event.preventDefault();
    }
    // });

  });
}








// document.getElementById('pwd').addEventListener('keyup', check_password);
document.getElementById('pwd_cf').addEventListener('keyup', password_matching);


// (function submit_listener() {
'use strict';
window.addEventListener('load', function () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  var inputs = document.getElementsByClassName('input form-control');
  var check = true;

  const username = document.getElementById('username');
  const input = document.getElementById('email');
  const password = document.getElementById('pwd');
  const password_cf = document.getElementById('pwd_cf');
  const nice = document.getElementById('nice');

  // const log = document.getElementById('log')
  console.log(input);
  // input.addEventListener('invalid', logValue)

  username.addEventListener('keyup', function () {
    if (check === true && error_exists === true) {
      username.classList.remove('invalid_love');
      document.getElementById("error").remove();
    }
  });

  password.addEventListener('keyup', function () {
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

  password_cf.addEventListener('keyup', function () {
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

  input.addEventListener('keyup', function () {
    if (check === true) {
      var val = input.checkValidity();
      console.log(val);
      if (val !== true) {
        input.classList.add('invalid_love');
        nice.classList.add('love_yes');
        nice.classList.remove('love_no');
        input.classList.remove('valid_hate');
        console.log(5);
      } else {
        input.classList.add('valid_hate');
        nice.classList.add('love_no');
        nice.classList.remove('love_yes');
        input.classList.remove('invalid_love');
      };
    }
  });

  var validation = Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        submited = true;
        event.preventDefault();
        event.stopPropagation();
        post_it();
      }
      input.classList.remove('valid_hate');
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
// })();