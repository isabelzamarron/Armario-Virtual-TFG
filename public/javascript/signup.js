
document.addEventListener("DOMContentLoaded", function () {
    // mensajes informativos en modal
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const errorMessage = document.getElementById('signup-error');
    errorMessage.style.display = 'none';
    const steps = document.querySelectorAll(".step");
    let stepActual = 0;

    //Validacion pasos del formulario
    function validateStep(stepIndex) {
   
        if (stepIndex === 0) {
            const email = document.getElementById('input_email').value.trim();
            const name = document.getElementById('input_name').value.trim();
            const surname = document.getElementById('input_surname').value.trim();
            const username = document.getElementById('input_username').value.trim();
            const password = document.getElementById('input_password').value;
            const password2 = document.getElementById('input_password2').value;
    
            if (!email || !name || !surname || !username || !password || !password2|| username === '@') {
                errorMessage.textContent = 'Completa todos los campos del paso 1.';
                errorMessage.style.display = 'block';
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage.textContent = 'Introduce un correo electrónico válido.';
                errorMessage.style.display = 'block';
                return false;
            }
            if (password !== password2) {
                errorMessage.textContent = 'Las contraseñas no coinciden.';
                errorMessage.style.display = 'block';
                return false;
            }
    
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                errorMessage.textContent = 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un símbolo.';
                errorMessage.style.display = 'block';
                return false;
            }
        }
    
        if (stepIndex === 1) {
            const formalidad = document.getElementById('input_formalidad').value;
            const simplicidad = document.getElementById('input_simplicidad').value;
            const estiloTemporal = document.getElementById('input_estilo_temporal').value;
            const sofisticacion = document.getElementById('input_sofisticacion').value;
    
            if (!formalidad || !simplicidad || !estiloTemporal || !sofisticacion) {
                errorMessage.textContent = 'Completa todos los campos del paso 2.';
                errorMessage.style.display = 'block';
                return false;
            }
        }
    
        if (stepIndex === 2) {
            const rangoEdad = document.getElementById('input_edad').value;
            const photoElement = document.getElementById('input_photo');
            if (!rangoEdad || !photoElement.files.length) {
                errorMessage.textContent = 'Completa todos los campos del paso 3.';
                errorMessage.style.display = 'block';
                return false;
            }
        }
    
        errorMessage.style.display = 'none';
        return true;
        
    }
    
//pasar paginas del formulario
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle("d-none", index !== stepIndex);
        });
    }
    document.querySelectorAll(".next-step").forEach(button => {
        button.addEventListener("click", function () {
            if (validateStep(stepActual)) {
                if (stepActual < steps.length - 1) {
                    stepActual++;
                    showStep(stepActual);
                }
            }
        });
    });
    document.querySelectorAll(".prev-step").forEach(button => {
        button.addEventListener("click", function () {
            if (stepActual > 0) {
                stepActual--;
                showStep(stepActual);
            }
        });
    });

    showStep(stepActual);
     
    
    // Manejo del formulario de registro
      const formSignup = document.getElementById('form-signup');
      formSignup.addEventListener('submit', async (event) => {
          event.preventDefault();

        //step1
        const email = document.getElementById('input_email').value;
        const name = document.getElementById('input_name').value;
        const surname = document.getElementById('input_surname').value;
        const username = document.getElementById('input_username').value;
        const password = document.getElementById('input_password').value;
        
        //step2
        const formalidad = document.getElementById('input_formalidad').value;
        const simplicidad = document.getElementById('input_simplicidad').value;
        const estiloTemporal = document.getElementById('input_estilo_temporal').value;
        const sofisticacion = document.getElementById('input_sofisticacion').value;
        //step3 
        const photoElement = document.getElementById('input_photo');
        const rangoEdad = document.getElementById('input_edad').value;
   
          const reader = new FileReader();
          reader.onloadend = async () => {
              const photoBase64 = reader.result.split(',')[1];

              try {
                  const response = await fetch('/auth/signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                      email,
                      password,
                      admin: 0,
                      nombre_usuario: username,
                      nombre: name,
                      apellidos: surname,
                      foto: photoBase64,
                      activo: 1,
                      preferencias: {
                          formalidad,
                          simplicidad,
                          estiloTemporal,
                          sofisticacion,
                          rangoEdad
                      }
                  })
                  });
                  if (response.ok) {
                      const data = await response.json();
                      window.location.href = data.redirectUrl;
                  } else {
                      const data = await response.json();
                      errorMessage.textContent = data.message;
                      errorMessage.style.display = 'block';
                  }
              } catch (error) {
                  console.error('Error:', error);
                  alert('Error al conectar con el servidor');
              }
          };

          reader.readAsDataURL(photoElement.files[0]);
      });
});
