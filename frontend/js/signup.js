
function check_password(){
      console.log(document.getElementById("pwd").value);

      var password =  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
      if ( password.test(document.getElementById('pwd').value)==true)
      {
        document.getElementById('pwd').setCustomValidity('');
        }
      else{
        document.getElementById('pwd').setCustomValidity('Must contain at least one number, one uppercase letter, one special character and at least 8 or more characters');
      }
}




function password_matching(){
      var password = document.getElementById('pwd');
      var password_cf = document.getElementById('pwd_cf');
      if (password.value != password_cf.value){
        password_cf.setCustomValidity('You must put the same password.');

      }

      else {
        password_cf.setCustomValidity('');

        }
}

document.getElementById('pwd').addEventListener('keyup',check_password);
document.getElementById('pwd_cf').addEventListener('keyup',password_matching);
