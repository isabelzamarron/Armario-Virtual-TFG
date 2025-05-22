document.addEventListener("DOMContentLoaded", function () {
     const userId = document.getElementById('user_id').value;
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    //desactivar cuenta
    const eliminarCuentaBtn = document.getElementById('eliminarCuentaBtn');
    eliminarCuentaBtn.addEventListener('click', async () => {

             if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                 try {
                     const response = await fetch(`/user/delete`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ id: userId })
                 })
 
            if (response.ok) {
                // Deshabilita el formulario y redirige
                 document.getElementById('editarPerfilUsuarioForm').reset();
                 document.getElementById('editarPerfilUsuarioForm').style.display = 'none';
                  setTimeout(() => {
                       window.location.href = '/auth';
                     }, 1000);
            } else {
                 alert('Error al eliminar la cuenta.');
                }
            } catch (error) {
                     console.error('Error al enviar la solicitud:', error);
                     alert('Error al enviar la solicitud.');
                 }
             }
         });
});


document.addEventListener('DOMContentLoaded', async () => {
     const userId = document.getElementById('user_id').value;
     //mostrar info de usuario
    try {
        const response = await fetch(`/user/obtenerUsuario/${userId}`);
        if (response.ok) {
            const user = await response.json();
            document.getElementById('new_name').value = user.nombre;
            document.getElementById('new_surname').value = user.apellidos;
            document.getElementById('new_username').value = user.nombre_usuario;
            document.getElementById('new_email').value = user.email;
            document.getElementById('new_edad').value = user.preferencias?.rango_edad;
            
            // preferencias
            document.getElementById('new_formalidad').value = user.preferencias?.formalidad ?? 5;
            document.getElementById('new_simplicidad').value = user.preferencias?.simplicidad ?? 5;
            document.getElementById('new_estilo_temporal').value = user.preferencias?.estilo_temporal ?? 5;
            document.getElementById('new_sofisticacion').value = user.preferencias?.sofisticacion ?? 5;
          
        } else {
            alert('Error al obtener los datos del usuario.');
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        alert('Error al obtener los datos del usuario.');
    }
});

    // Manejo del formulario de edición
    document.getElementById('editarPerfilUsuarioForm').addEventListener('submit',async (event) => {
          const userId = document.getElementById('user_id').value;
        event.preventDefault();
        //step1
        const email = document.getElementById('new_email').value;
        const name = document.getElementById('new_name').value;
        const surname = document.getElementById('new_surname').value;
        const username = document.getElementById('new_username').value;
 
        //step 2
        const formalidad = document.getElementById('new_formalidad').value;
        const simplicidad = document.getElementById('new_simplicidad').value;
        const estiloTemporal = document.getElementById('new_estilo_temporal').value;
        const sofisticacion = document.getElementById('new_sofisticacion').value;
     
        //step3
        const photo = document.getElementById('new_photo');
        const edad = document.getElementById('new_edad').value; 


        const errorMessage = document.getElementById('updateProfile-error'); // mensaje de error
        if (!email.trim() || !name.trim() || !surname.trim() || !username.trim() ||username === '@' || !edad ) {
            errorMessage.textContent = 'Todos los campos son obligatorios.';
            errorMessage.style.display = 'block';
            return;
        }
        const data = {
                email,
                nombre: name,
                apellidos: surname,
                nombre_usuario: username,
              
                preferencias: {
                    formalidad,
                    simplicidad,
                    estiloTemporal,
                    sofisticacion,
                    edad
                }
            };

          errorMessage.style.display = 'none';      
    
            if (photo.files.length > 0) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const photoBase64 = reader.result.split(',')[1];
                    data.foto = photoBase64;

                    await enviarDatos(userId, data); // recoge los datos y los envia
                };
                reader.readAsDataURL(photo.files[0]);
            } else {
                await enviarDatos(userId, data); 
            }
    });

 async function enviarDatos(userId, data) {
    const errorMessage = document.getElementById('updateProfile-error');

    try {
        const response =  await fetch(`/user/updateProfile/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.reload()
        } else {
            const errorData = await response.json();
            errorMessage.textContent = (errorData.message || 'Error al actualizar el perfil.');

            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        errorMessage.textContent = ' Error al enviar la solicitud.';
        errorMessage.style.display = 'block';
    }
}