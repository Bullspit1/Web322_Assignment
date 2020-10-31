
function validateEmail(){
    let email = document.getElementById("email");
    let errMsg = document.getElementsByClassName("errMsg")[0];

    //email regular Expression
    let emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 
    if(email.value === "" || !emailRegEx.test(email.value)){
        email.className = "form-control is-invalid";
        errMsg.innerHTML = "Email is incorrect.";
        errMsg.style.color = "#dc3545";
        return false;
    }
        email.className = "form-control is-valid";
        errMsg.innerHTML = "";
        return true;
}

function validatePassword(){
    let pass = document.getElementById("password");
    let errMsg = document.getElementsByClassName("errMsg")[1];

    if(pass.value === "" || pass.value.length < 6 || pass.value.length > 12){
        pass.className = "form-control is-invalid";
        errMsg.innerHTML = "Password must be between 6 and 12 characters.";   
        errMsg.style.color = "#dc3545";
        return false;
    }
    pass.className = "form-control is-valid";
    errMsg.innerHTML = "";
    return true;
}

function validForm() {
    let fullyValid = true;

    if (validateEmail() === false) {
      fullyValid = false;
    }
    if(validatePassword() === false){
        fullyValid = false;
    }
  
    return fullyValid;
  }
