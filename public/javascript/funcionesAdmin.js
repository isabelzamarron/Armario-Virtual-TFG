function mostrarModalExito() {
  const modalElement = new bootstrap.Modal(document.getElementById('modalExito'));
  modalElement.show();
  setTimeout(() => {
    window.location.reload(); 
  }, 1500); 
}

//Gestion usuarios admin
        document.addEventListener('DOMContentLoaded', () => {
 
            const addUserBtn = document.getElementById('addUserBtn');
            const searchUserInput = document.getElementById('searchUserInput');
            const userTableBody = document.getElementById('userTableBody');
            const deleteUserBtn=document.getElementById('delete-user-btn');
            
            //AÑADIR USUARIO
            addUserBtn.addEventListener('click', () => {
                const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
                addUserModal.show();
            });

            document.getElementById('addUserForm').addEventListener('submit', (event) => {
                    event.preventDefault(); 
                    //step 1
                    const email = document.getElementById('input_email').value;
                    const name = document.getElementById('input_name').value;
                    const surname = document.getElementById('input_surname').value;
                    const username=document.getElementById('input_username').value;
                    const password = document.getElementById('input_password').value;
                    const password2 = document.getElementById('input_password2').value;
                        //step2
                    const formalidad = document.getElementById('input_formalidad').value;
                    const simplicidad = document.getElementById('input_simplicidad').value;
                    const estiloTemporal = document.getElementById('input_estilo_temporal').value;
                    const sofisticacion = document.getElementById('input_sofisticacion').value;
                  
                    //step3
                    const rangoEdad = document.getElementById('input_edad').value;
                    const photoElement = document.getElementById('input_photo');

                    //comprobar si las dos contraseñas introducidas son iguales
                    if (password !== password2) {
                    alert('Las contraseñas no coinciden');
                     return;
                   }
                   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                   if (!passwordRegex.test(password)) {
                        alert('La contraseña debe tener al menos 8 caracteres, incluir letras mayúsculas, letras minúsculas, números y caracteres especiales.');
                        return;
                    }
                    const errorMessage = document.getElementById('addUser-error'); // mensaje de error
                    errorMessage.style.display = 'none'; //oculta mensajes previos
                      if (
                        !email.trim() ||
                        !name.trim() ||
                        !surname.trim() ||
                        !username.trim() ||
                        !password ||
                        !password2 ||
                        !formalidad ||
                        !simplicidad ||
                        !estiloTemporal ||
                        !sofisticacion ||
                        !rangoEdad ||
                        !photoElement.files.length
                    ) {
                        errorMessage.textContent = 'Todos los campos son obligatorios.';
                        errorMessage.style.display = 'block';
                        return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const photoBase64 = reader.result.split(',')[1]; 

                try {
                    const response = await fetch('/user/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
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
                        const modalAddPrenda = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                    if (modalAddPrenda) {
                        modalAddPrenda.hide();
                    }
                        mostrarModalExito();
                                    
                    } else {
                        const errorData = await response.json();
                        alert('Error creating user: ' + errorData.message);
                    }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error creating user');
                    }
            };

            reader.readAsDataURL(photoElement.files[0]); 
     
    });
});
            //BUSCAR USUARIO
                    searchUserInput.addEventListener('input', () => {
                        const searchTerm = searchUserInput.value.toLowerCase();
                        const rows = userTableBody.getElementsByTagName('tr');
                        Array.from(rows).forEach(row => {
                            const cells = row.getElementsByTagName('td');
                            const name = cells[0].innerText.toLowerCase();
                            const surname = cells[1].innerText.toLowerCase();
                            const email = cells[2].innerText.toLowerCase();
                            if (name.includes(searchTerm) || surname.includes(searchTerm) || email.includes(searchTerm)) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                                }
                            });
                        });

        //ACTUALIZAR
        userTableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('update-user-btn')) {
            const userId = event.target.dataset.userId;
            const updateUserModal = new bootstrap.Modal(document.getElementById('updateUserModal'));
            updateUserModal.show();

            document.getElementById('editarPerfilForm').dataset.userId = userId;
            //mostrar los campos con la informacion del usuario
            try {
                const response = await fetch(`/user/obtenerUsuario/${userId}`);
                if (response.ok) {
                    const user = await response.json();
                    document.getElementById('update_name').value = user.nombre;
                    document.getElementById('update_surname').value = user.apellidos;
                    document.getElementById('update_username').value = user.nombre_usuario;
                    document.getElementById('update_email').value = user.email;
                    document.getElementById('update_edad').value = user.preferencias?.rango_edad;
                   
                   // preferencias
                    document.getElementById('update_formalidad').value = user.preferencias?.formalidad ?? 5;
                    document.getElementById('update_simplicidad').value = user.preferencias?.simplicidad ?? 5;
                    document.getElementById('update_estilo_temporal').value = user.preferencias?.estiloTemporal ?? 5;
                    document.getElementById('update_sofisticacion').value = user.preferencias?.sofisticacion ?? 5;

                } else {
                    alert('Error al obtener los datos del usuario.');
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                alert('Error al obtener los datos del usuario.');
            }
        }
   

    document.getElementById('editarPerfilForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userId = event.target.dataset.userId;
        const emailElement = document.getElementById('update_email');
        const nameElement = document.getElementById('update_name');
        const surnameElement = document.getElementById('update_surname');
        const photoElement = document.getElementById('update_photo');
        const usernameElement=document.getElementById('update_username');
        const edadElement = document.getElementById('update_edad'); 
        const formalidad = document.getElementById('update_formalidad').value;
        const simplicidad = document.getElementById('update_simplicidad').value;
        const estiloTemporal = document.getElementById('update_estilo_temporal').value;
        const sofisticacion = document.getElementById('update_sofisticacion').value;

        const errorMessage = document.getElementById('update-error'); 
        errorMessage.style.display = 'none';
       
       // Validar que todos los campos obligatorios estén llenos
       if (
            !nameElement.value.trim() ||
            !surnameElement.value.trim() ||
            !usernameElement.value.trim() ||
            !emailElement.value.trim() ||
            !edadElement.value 
        ) {
            errorMessage.textContent = '❌ Todos los campos son obligatorios.';
            errorMessage.style.display = 'block';
            return;
        }

            const email = emailElement.value;
            const name = nameElement.value;
            const surname = surnameElement.value;
            const username=usernameElement.value;
            const edad= edadElement.value;

        
            const data = {
            email: email,
            nombre: name,
            apellidos: surname,
            nombre_usuario:username,

            preferencias: {
                formalidad,
                simplicidad,
                estiloTemporal,
                sofisticacion,
                edad
            }
           
        }; 

        if (photoElement.files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const photoBase64 = reader.result.split(',')[1]; 
                data.foto = photoBase64;

                await enviarDatos(userId,data);
            };
            reader.readAsDataURL(photoElement.files[0]);
        } else {
            await enviarDatos(userId,data);
        }
});
});
    async function enviarDatos(userId,data) {
    const errorMessage = document.getElementById('update-error');
    errorMessage.style.display = 'none'; 

    try {
        const response = await fetch(`/user/updateProfile/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = `/user/indexAdmin`;
        } else {
            const errorData = await response.json();
            errorMessage.textContent = errorData.message;
            errorMessage.style.display = 'block';
            }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        errorMessage.textContent = 'Error al enviar la solicitud.';
        errorMessage.style.display = 'block';
    }
}


//ELIMINAR USUARIO
document.addEventListener("DOMContentLoaded", function () {
        userTableBody.addEventListener('click', (event) => {
     
            if (event.target.classList.contains('delete-user-btn')) {
               
                    const userId = event.target.dataset.userId;
                    const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
                    deleteUserModal.show();

    document.getElementById('confirmDeleteUserBtn').onclick = () => {
            fetch(`/user/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId })
            })
            .then(response => {
                  return response.json();
            })
            .then(data => {
                
                if (data.success) {
                    deleteUserModal.hide();
                    location.reload();
                } else {
                    alert('Error al eliminar el usuario');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el usuario');
            });
             };
                }
            });
    
    //ACTUALIZAR ESTADO DE ADMINISTRADOR
  
    document.addEventListener("change", async function (event) {
        if (event.target.classList.contains("admin-checkbox")) {
            const userId = event.target.dataset.userId;
            const isAdmin = event.target.checked;

            try {
                const response = await fetch(`/user/updateAdmin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: userId, admin: isAdmin })
                });

                if (response.ok) {
                    alert('Estado de administrador actualizado con éxito.');
                } else {
                    console.error("Error en la respuesta del servidor:", response);
                    alert('Error al actualizar el estado de administrador.');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error);
                alert("Hubo un problema con la actualización.");
            }
        }
    });
});

      //--------------GESTION PAGINACION----------------------       

    document.addEventListener('DOMContentLoaded', () => {
    const usersPerPage = 10; // numero de usuarios por página
    let currentPage = 1; // pagina actual
    const userTableBody = document.getElementById('userTableBody'); 
    const pagination = document.getElementById('pagination'); 

    const userDataDiv = document.getElementById('user-data');
    const allUsers = JSON.parse(userDataDiv.getAttribute('data-users'));
    

    //cargar usuarios
    function loadUsers() {
        userTableBody.innerHTML = ''; 

        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const usersToShow = allUsers.slice(start, end);

        usersToShow.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.apellidos}</td>
                <td>${user.nombre_usuario}</td>
                <td>${user.email}</td>
                <td><input type="checkbox" class="form-check-input admin-checkbox" data-user-id="${user.id}" ${user.admin ? 'checked' : ''}></td>
                <td>
                    <button class="btn btn-danger delete-user-btn" data-user-id="${user.id}">Eliminar</button>
                    <button class="btn btn-secondary update-user-btn" data-user-id="${user.id}">Modificar</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        updatePagination(); // actualiza los botones
    }

    function updatePagination() {
        pagination.innerHTML = ''; 

        const totalPages = Math.ceil(allUsers.length / usersPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === currentPage) li.classList.add('active');

            const a = document.createElement('a');
            a.classList.add('page-link');
            a.textContent = i;
            a.href = '#';
            a.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                loadUsers(); 
            });

            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    // carga primera pagina
    loadUsers();
});

document.addEventListener("DOMContentLoaded", function () {
    function setupMultiStepForm(modalId) {
        const modal = document.querySelector(modalId);
        if (!modal) return;

        const steps = modal.querySelectorAll(".step");
        let currentStep = 0;

        function showStep(stepIndex) {
            steps.forEach((step, index) => {
                step.classList.toggle("d-none", index !== stepIndex);
            });
        }

        modal.querySelectorAll(".next-step").forEach(button => {
            button.addEventListener("click", function () {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        });

        modal.querySelectorAll(".prev-step").forEach(button => {
            button.addEventListener("click", function () {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });

        modal.addEventListener("show.bs.modal", function () {
            currentStep = 0;
            showStep(currentStep);
        });

        showStep(currentStep);
    }

    setupMultiStepForm("#updateUserModal");
    setupMultiStepForm("#addUserModal");
});
