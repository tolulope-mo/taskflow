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

function seePassword(click) {
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

function formCallback(e) {
  e.preventDefault();

  const emailInput = email.value;
  const passwordInput = password.value;

  const validateEmail = emailRegex.test(emailInput);
  const validatePassword = passwordRegex.test(passwordInput);

  mailPrompt.style.display = validateEmail ? "none" : "flex";
  passwordPrompt.style.display = validatePassword ? "none" : "flex";

  if (!validateEmail || !validatePassword) return;

  const userInfo = { email: emailInput, password: passwordInput };

  saveUserInfo(userInfo);
}

async function saveUserInfo(userInfo) {
    try {
        let res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/auth/signup', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInfo)
        })

        let data = await res.json()

        if (res.ok) {
            console.log("Success:", data)
            window.location.replace("login.html")
        } else {
            console.error("Error:", data);
            alert(`Sign up failed: ${data.message}`);
        }

    }

    catch (err) {
        console.error(err)
    }
}