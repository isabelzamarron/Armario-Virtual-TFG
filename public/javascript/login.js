
document.addEventListener('DOMContentLoaded', () => {

const formLogin = document.getElementById('formLogin');
const errorMessage = document.getElementById('errorLogin'); 
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

   emailInput.addEventListener('input', () => {
        errorMessage.style.display = 'none';
    });
    passwordInput.addEventListener('input', () => {
        errorMessage.style.display = 'none';
    });

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.style.display = 'none';
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) { 
            const data = await response.json();
            errorMessage.style.display = 'none';
            window.location.href = data.redirectUrl;
        } else if (response.status === 401) {
            errorMessage.textContent = '❌ Usuario o contraseña incorrectos.';
        } else if (response.status === 403) {
            errorMessage.textContent = '⚠️ Tu cuenta está inactiva. Contacta con soporte.';
        } else {
            errorMessage.textContent = '❌ Ocurrió un error. Inténtalo de nuevo.';
        }
        if (!response.ok) {
        errorMessage.style.display = 'block';
        }
} catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = '❌ Error al conectar con el servidor. Inténtalo más tarde.';
    errorMessage.style.display = 'block';
}
});
});
    //gestion logout
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('logout')) {
        console.log("Sesión cerrada correctamente");
        // limpia url
        window.history.replaceState(null, '', window.location.pathname);
    }
});