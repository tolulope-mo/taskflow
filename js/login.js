let email = document.getElementById('email')
let password = document.getElementById('password')
let togglePassword = document.querySelector(".toggle-password");
let form = document.getElementById('form')
let mailPrompt = document.getElementById('incorrect-mail-prompt')
let passwordPrompt1 = document.getElementById("incorrect-password-prompt1");
let passwordPrompt2 = document.getElementById("incorrect-password-prompt2");
let loginRedirect = document.querySelector('.signup-link');

//to see password input

togglePassword.addEventListener("click", seePassword)

function seePassword (click) {
    // click.preventDefault()

  if (password.type === "password") {
    password.type = "text";           
    togglePassword.src = "../assets/seePassword2.svg";  
  } 
  
  else {
    password.type = "password";       
    togglePassword.src = "../assets/hidePassword.svg";  
  }

}

// to validate inputs

let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;


form.addEventListener('submit', formCallback)

function formCallback (e) {

    e.preventDefault();

    // validate inputs

    let emailInput = email.value;
    let passwordInput = password.value;

       
    const validateEmail = emailRegex.test(emailInput);
    const validatePassword = passwordRegex.test(passwordInput);

    // update user on incorrect info

    if (validateEmail === false) {
        mailPrompt.style.display = 'flex';
    }

    else { 
        mailPrompt.style.display = 'none';
    }

    if (validatePassword === false) {
        passwordPrompt1.style.display = 'flex';
        passwordPrompt2.style.display = 'flex';
    }

    else { 
        passwordPrompt1.style.display = 'none';
        passwordPrompt2.style.display = 'none';
    }
    
    // send data to backend and authenticate 
    // *cries in basteed ekun egbere

    if (validateEmail && validatePassword){
        console.log("you're good to go") 
    }

} 

