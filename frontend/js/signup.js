
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

var error = false;

$(document).ready(function () {
  $('form').submit(function (event) {
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
      success: function (returnData) {
        var res = JSON.parse(returnData);
      },
      error: function (xhr, status, error) {

        if (xhr.responseText.indexOf('<body') != -1) {
          $(window).attr('location','http://localhost:3000/login')
          // a 302 redirection happens
        } else {
          var errorMessage = xhr.responseText
          error = true;
          $('form').removeClass('was-validated');
          $('#username').removeClass('valid_hate');
          $('#username').addClass('invalid_love'); // add the error class to show red input
          $('#name-group').append('<div id="error" class="love_yes">' + xhr.responseText + '</div>'); // add the actual error message under our input

          alert('Error - ' + errorMessage);
        }
      }
    })
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
  });
});




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

    const username = document.getElementById('username')
    const input = document.getElementById('email');
    const nice = document.getElementById('nice');
    // const log = document.getElementById('log')
    console.log(input);
    // input.addEventListener('invalid', logValue)

    username.addEventListener('keyup', function () {
      if (check === true && error === true) {
        username.classList.remove('ivalid_love');
        document.getElementById("error").remove();
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
          nice.classList.remove('love_yes');
          input.classList.remove('invalid_love');
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