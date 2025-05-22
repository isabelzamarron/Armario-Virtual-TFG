const u = document.getElementById("userId").value;
const inputBusqueda = document.getElementById('searchUsernameInput');
const sugerenciasUsuarios = document.getElementById('sugerenciasUsuarios');



document.addEventListener("DOMContentLoaded", function() {
    //Busqueda
    document.getElementById('searchUsernameInput').addEventListener('input', buscarUsuario);
    inputBusqueda.addEventListener('input', buscarUsuario);
    buscarUsuario();
    //recargar página

     const followersModal = document.getElementById("followersModal");
      
      if (followersModal) {
          followersModal.addEventListener("show.bs.modal", function () {
              cargarSeguidores();
          });
      }
      
         const followingModal = document.getElementById("followingModal");

    if (followingModal) {
        followingModal.addEventListener("show.bs.modal", function () {
            cargarSeguidos();
        });
    }
    cargarSugerencias();

        });


function cargarSugerencias() {
  
    fetch(`/comunidad/discovery/${userId}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("sugerenciasUsuarios");
            container.innerHTML = ""; 

            if (!Array.isArray(data) || data.length === 0) {
                sugerenciasUsuarios.innerHTML = "<p class='text-muted'>No hay nuevas sugerencias en este momento.</p>";
                return;
            }

            data.forEach(user => {
                const userCard = `
  <div class="d-flex align-items-center justify-content-between bg-light px-3 py-2 rounded shadow-sm small" style="gap: 10px;">
    <div class="d-flex align-items-center" style="gap: 10px;">
      <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1px solid #ccc;">
        <img src="/user/photo/${user.id}" 
             alt="Foto de ${user.nombre}" 
             style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="lh-sm">
        <div class="fw-semibold">${user.nombre}</div>
        <div class="text-muted" style="font-size: 0.85rem;">${user.nombre_usuario}</div>
      </div>
    </div>
    <button class="btn btn-sm px-3 py-1" style="background-color: #4A4E69; color: white;" onclick="seguirUsuario(${user.id})">
      Seguir
    </button>
  </div>
`;
     container.innerHTML += userCard;
            });
        })
        .catch(error => console.error("Error al obtener sugerencias:", error));
}


function seguirUsuario(userId) {
   
    fetch(`/comunidad/addFollowing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ following_id: userId,usuario_id:u })
    })
       .then(response => response.json())
        .then(data => {
            
            mostrarModalExito();
            cargarSugerencias(); //recargar lista despues de seguir
        })
        .catch(error => console.error("Error al seguir usuario:", error));

        obtenerSeguido(userId);
}

function obtenerSeguido(userId) {
   
    fetch(`/comunidad/addFollower`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ follower_id: u,usuario_id:userId})
 })
       .then(response => response.json())
        .then(data => {
          
        })
        .catch(error => console.error("Error al seguir usuario:", error));
 }


 function mostrarModalExito() {
    // Mostrar el modal de éxito
    const modalElement = new bootstrap.Modal(document.getElementById('modalExitoSeguidor'));
    modalElement.show();

    // Esperar antes de recargar
    setTimeout(() => {
        window.location.reload(); 
    }, 1500); 
}




async function buscarUsuario() {
    const searchTerm = inputBusqueda.value.trim().toLowerCase();
    sugerenciasUsuarios.innerHTML = '';

    if (searchTerm === '') {
        cargarSugerencias(); // Volver a mostrar discovery
        return;
    }

    try {
        const response = await fetch(`/comunidad/buscar?query=${encodeURIComponent(searchTerm)}`);
        const contentType = response.headers.get("content-type");

        if (!response.ok || !contentType.includes("application/json")) {
            throw new Error("Respuesta no válida del servidor");
        }

        const usuarios = await response.json();
    
        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            sugerenciasUsuarios.innerHTML = '<p class="text-muted">No se encontraron coincidencias.</p>';

        }
         sugerenciasUsuarios.innerHTML = '';
            usuarios.forEach(usuario => {
        const userHTML = `
        <div class="d-flex align-items-center justify-content-between bg-light px-3 py-2 rounded shadow-sm small" style="gap: 10px;">
            <div class="d-flex align-items-center" style="gap: 10px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1px solid #ccc;">
                    <img src="/user/photo/${usuario.id}" alt="Foto de ${usuario.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="lh-sm">
                    <div class="fw-semibold">${usuario.nombre}</div>
                    <div class="text-muted" style="font-size: 0.85rem;">${usuario.nombre_usuario}</div>
                </div>
            </div>
            <button class="btn btn-sm px-3 py-1" style="background-color: #4A4E69; color: white;" onclick="seguirUsuario(${usuario.id})">
                Seguir
            </button>
        </div>
    `;

    sugerenciasUsuarios.insertAdjacentHTML('beforeend', userHTML);
});
        
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        sugerenciasUsuarios.innerHTML = '<p class="text-muted">Error al buscar usuarios.</p>';
    }
}
    
   
  function cargarSeguidores() {
    const followersList = document.getElementById("listaSeguidores");
    followersList.innerHTML = "<li class='list-group-item'>Cargando...</li>"; 

    const userId = document.getElementById("userId").value; 

    fetch(`/user/getFollowers/${userId}`)
 
        .then(response => response.json())
        .then(seguidores => {
          
            followersList.innerHTML = ""; 

            if (!seguidores || seguidores.length === 0) {
                followersList.innerHTML = "<li class='list-group-item'>No tienes seguidores.</li>";
                return;
            }

            seguidores.forEach(seguidor => {
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "align-items-center", "justify-content-between");

                const foto = seguidor.foto
                    ? `/user/photo/${seguidor.id}`
                    : '/uploads/default.png';
                    li.innerHTML = `
                        <div class="d-flex align-items-center justify-content-between w-100">
                            <div class="d-flex align-items-center" style="gap: 10px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1px solid #ccc;">
                        <img src="${foto}" 
                            alt="Foto de ${seguidor.nombre}" 
                            style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                            <div class="lh-sm">
                                <div class="fw-semibold">${seguidor.nombre}</div>
                                <small class="text-muted">${seguidor.nombre_usuario}</small>
                            </div>
                            </div>
                            <button class="btn btn-sm btn-outline-danger px-2 py-1" onclick="removeFollower(${seguidor.id})">✕</button>
                        </div>
                        `;

                followersList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error al obtener seguidores:", error);
            followersList.innerHTML = `<li class='list-group-item text-danger'>Error al cargar seguidores.</li>`;
        });
}
function removeFollower(followerId) {
    const userId = document.getElementById("userId").value; 

    fetch(`/comunidad/deleteFollower`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({usuario_id: userId,follower_id: followerId   }) 
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); 
        cargarSeguidores(); //recargar lista
    })
    .catch(error => console.error("Error al eliminar seguidor:", error));
}

function cargarSeguidos() {
    const followingList = document.getElementById("listaSeguidos");
    followingList.innerHTML = "<li class='list-group-item'>Cargando...</li>"; 

    const userId = document.getElementById("userId").value; 

    fetch(`/user/getFollowing/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            return response.json();
        })
        .then(seguidos => {
            followingList.innerHTML = ""; 

            if (!seguidos || seguidos.length === 0) {
                followingList.innerHTML = "<li class='list-group-item'>No sigues a nadie.</li>";
                return;
            }

            seguidos.forEach(user => {
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "align-items-center", "justify-content-between");

                const foto = user.foto
                    ? `data:image/png;base64,${user.foto}`
                    : '/uploads/default.png';

                    li.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between w-100">
                        <div class="d-flex align-items-center" style="gap: 10px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1px solid #ccc;">
                    <img src="${foto}" alt="Foto de ${user.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                        <div class="lh-sm">
                            <div class="fw-semibold">${user.nombre}</div>
                            <small class="text-muted">${user.nombre_usuario}</small>
                        </div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger px-2 py-1" onclick="unfollowUser(${user.id})">✕</button>
                    </div>
                    `;


                followingList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error al obtener seguidos:", error);
            followingList.innerHTML = `<li class='list-group-item text-danger'>Error al cargar seguidos.</li>`;
        });
}
//eliminar seguido
function unfollowUser(followingId) {
    const userId = document.getElementById("userId").value;//id del usuario actual

    fetch(`/comunidad/deleteFollowing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: userId, following_id: followingId }) 
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); 
        cargarSeguidos(); //recargar lista
    })
    .catch(error => console.error("Error al dejar de seguir:", error));
}

//recargar página 
document.addEventListener('DOMContentLoaded', (event) => {
    const followersModal = document.getElementById('followersModal');
     followersModal.addEventListener('hidden.bs.modal', () => {
        window.location.reload();
    });
   
});
document.addEventListener('DOMContentLoaded', (event) => {
    const followingModal = document.getElementById('followingModal');
    
    followingModal.addEventListener('hidden.bs.modal', () => {
        window.location.reload();
    });
});
