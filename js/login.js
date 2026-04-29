
let heading = document.getElementById('heading')

let form = document.getElementById('form')

let email = document.getElementById('email')

let password = document.getElementById('password')

let togglePassword = document.querySelector(".toggle-password");

let mailPrompt = document.getElementById('incorrect-mail-prompt')

let passwordPrompt = document.getElementById("incorrect-password-prompt");

let button = document.getElementById('button')

let loginRedirect = document.querySelector('.signup-link');


togglePassword.addEventListener("click", seePassword)

function seePassword (click) {
    click.preventDefault()

  if (password.type === "password") {
    password.type = "text";           
    togglePassword.src = "../assets/seePassword2.svg";  
  } 
  
  else {
    password.type = "password";       
    togglePassword.src = "../assets/hidePassword.svg";  
  }

}

let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;


form.addEventListener('submit', formCallback)

function formCallback (e) {

    e.preventDefault();

    let emailInput = email.value;
    let passwordInput = password.value;

       
    const validateEmail = emailRegex.test(emailInput);
    const validatePassword = passwordRegex.test(passwordInput);

    console.log(validateEmail, validatePassword)

    if (validateEmail === false) {
        mailPrompt.style.display = 'flex';
    }

    else { 
        mailPrompt.style.display = 'none';
    }

    if (validatePassword === false) {
        passwordPrompt.style.display = 'flex';
    }

    else { 
        passwordPrompt.style.display = 'none';
    }
    
    let UserAccount = {
        email: emailInput,
        password: passwordInput
    }

    console.log(UserAccount);

    
    if (validateEmail && validatePassword) {
        saveUserInfo (UserAccount);
    }
}


async function saveUserInfo(UserAccount) {
    try {
        let res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/auth/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(UserAccount)
        });

        let data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.authToken);
            window.location.replace("home.html");
        } else {
            alert(data.message || "Login failed");
        }

    } catch (err) {
        console.error(err);
    }
}