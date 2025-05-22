
let eventosCargados = false;
let tagsCargados = false;
let estacionesCargadas = false; 

let id_outfit = null;
document.getElementById('outfitModal').addEventListener('hidden.bs.modal', function () {
    cerrarModal(); // Llama a la funcion cuando se cierra el modal
    restablecerParametros();
});
function restablecerParametros() {
    const sections = ['eventos', 'tags','estacion'];
    
    sections.forEach(sec => {
           
      const opcionesDiv = document.getElementById(`editar${sec.charAt(0).toUpperCase() + sec.slice(1)}Opciones`);
      const inputHidden = document.getElementById(`outfit${sec.charAt(0).toUpperCase() + sec.slice(1)}`);

        if (opcionesDiv) {
            opcionesDiv.innerHTML = '';  
        }
        if (inputHidden) {
            inputHidden.value = '';  
        }
    });

    eventosCargados = false;
    tagsCargados = false;
    estacionesCargadas = false; 
}   
 // Oculta todos los parametros
function cerrarModal() {
  
    const sections = ['eventos', 'tags','estacion'];
    
    sections.forEach(sec => {
        const editDiv = document.getElementById(`edit${sec.charAt(0).toUpperCase() + sec.slice(1)}Div`);
        editDiv.style.display = 'none'; 
    });

}

function mostrarParametros(section) {
    const sections = ['eventos', 'tags','estacion'];
    sections.forEach(sec => {
        const editDiv = document.getElementById(`edit${sec.charAt(0).toUpperCase() + sec.slice(1)}Div`);
        if (sec === section) {
            const mostrar = editDiv.style.display === 'none';
            editDiv.style.display = mostrar ? 'block' : 'none';

            if (mostrar) {
             if (sec === 'eventos' && !eventosCargados) {
                cargarEventosConActivos('/outfits/eventos', `/outfits/${id_outfit}/eventosByOutfit`, 'editarEventosOpciones', 'outfitEventos');
                eventosCargados = true;
            
            } else if (sec === 'tags' && editDiv.style.display === 'block' && !tagsCargados) {
                cargarTagsConActivos('/outfits/tags' ,`/outfits/${id_outfit}/tagsByOutfit`, 'editarTagsOpciones', 'outfitTags');
               tagsCargados = true;
             } 
            else if (sec === 'estacion' && !estacionesCargadas) {
                cargarEstacionesConActivos('/outfits/estaciones', `/outfits/${id_outfit}/estacionesByOutfit`, 'editarEstacionOpciones', 'outfitEstacion');
                estacionesCargadas = true;
                }
            } 
        } else {
            editDiv.style.display = 'none';
        }
    });
}

function openOutfitModal(id_outfit) {
    fetch(`/outfits/obtenerOutfit/${id_outfit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del outfit');
            }
            return response.json();
        })
        .then(outfit => {
            mostrarOutfitModal(outfit); 
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron obtener los detalles del outfit.');
        });
}

document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('outfitModal');
    modal.addEventListener('hidden.bs.modal', () => {
        window.location.reload();
    });
});


//MOSTRAR INFORMACION
function mostrarOutfitModal(outfit) {
    id_outfit=outfit.id_outfit;
 
    const modal = document.getElementById('outfitModal');

    // Imagen
    modal.querySelector("#modalImage").src = `/outfits/photoOutfit/${outfit.id_outfit}`;

    // Nombre
   modal.querySelector("#modalNombre").innerText = outfit.nombre;

    // Publicado
    const switchPublicado = modal.querySelector("#switchPublicado");
    const labelPublicado = modal.querySelector("#estadoPublicadoLabel");

const isPublico = Boolean(outfit.publico);
    if (isPublico === true) {
        switchPublicado.checked = true;
        labelPublicado.innerText = "PUBLICADO";
        labelPublicado.classList.add("text-success");
    } else {
        switchPublicado.checked = false;
        labelPublicado.innerText = "NO PUBLICADO";
        labelPublicado.classList.remove("text-success");
    }

      // Estaciones
      const estacionesDiv = modal.querySelector("#modalEstacionOutfit");
      estacionesDiv.innerHTML = ''; 
      if (outfit.estaciones && Array.isArray(outfit.estaciones)) {
        
          outfit.estaciones.forEach(estacion => {
             
          const badge = document.createElement('span');
          badge.className = 'badge bg-secondary me-1 mb-1'; 
          badge.textContent = estacion.nombre.trim();
  
          estacionesDiv.appendChild(badge);
         } );
      } else {
          estacionesDiv.innerText = 'Sin estaciones asignadas'; 
      }
     // Eventos
    const eventosDiv = modal.querySelector("#modalEventos");
    eventosDiv.innerHTML = ''; 
    if (outfit.eventos && Array.isArray(outfit.eventos)) {
        outfit.eventos .forEach(evento => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary me-1 mb-1';
            badge.textContent = evento.nombre.trim();
            eventosDiv.appendChild(badge);
        });
    } else {
        eventosDiv.innerText = 'Sin eventos asignados'; 
    }
     // Tags
     const tagsDiv = modal.querySelector("#modalTags");
     tagsDiv.innerHTML = ''; 
     if (outfit.tags && Array.isArray(outfit.tags)) {
        outfit.tags.forEach(tag => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary me-1 mb-1'; 
            badge.textContent = tag.nombre.trim();
            tagsDiv.appendChild(badge);
        });
     } else {
        tagsDiv.innerText = 'Sin tags asignados'; 
     }
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}



//ELIMINAR PRENDA
function confirmarEliminacion() {
    fetch('/outfits/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id_outfit })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
                if (confirmDeleteModal) {
                    confirmDeleteModal.hide();
                }
                window.location.href = `/outfits/listarOutfits`;
            } else {
                console.error("Error al eliminar el outfit:", data.message);
            }
        })
        .catch(error => console.error("Error:", error));
}

function gestionTags() {
    const tagsSeleccionados = document.getElementById('outfitTags').value
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== '');

    fetch(`/outfits/${id_outfit}/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tags: tagsSeleccionados })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tags actualizados correctamente');
            fetch(`/outfits/obtenerOutfit/${id_outfit}`)
                .then(r => r.json())
                .then(p => {
                    actualizarModal(p);
                    mostrarParametros("tags");
                    tagsOriginales = p.tags.map(e => e.id); 
                });
        } else {
            alert('Error al actualizar tags');
        }
    })
    .catch(err => {
        console.error("Error al actualizar tags:", err);
        alert("Hubo un problema al guardar los tags");
    });
}
function gestionEventos() {
    const eventosSeleccionados = document.getElementById('outfitEventos').value
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== '');

    fetch(`/outfits/${id_outfit}/eventos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventos: eventosSeleccionados })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Eventos actualizados correctamente');
            fetch(`/outfits/obtenerOutfit/${id_outfit}`)
                .then(r => r.json())
                .then(p => {
                    actualizarModal(p);
                    mostrarParametros("eventos");
                    eventosOriginales = p.eventos.map(e => e.id); 
                });
        } else {
            alert('Error al actualizar eventos');
        }
    })
    .catch(err => {
        console.error("Error al actualizar eventos:", err);
        alert("Hubo un problema al guardar los eventos");
    });
}
function gestionEstaciones() {
    const estacionesSeleccionadas = document.getElementById('outfitEstacion').value
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== '');

    fetch(`/outfits/${id_outfit}/estaciones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estaciones: estacionesSeleccionadas })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Estaciones actualizadas correctamente');
            fetch(`/outfits/obtenerOutfit/${id_outfit}`)
                .then(r => r.json())
                .then(p => {
                    actualizarModal(p);
                    mostrarParametros("estacion");
                });
        } else {
            alert('Error al actualizar estaciones');
        }
    })
    .catch(err => {
        console.error("Error al actualizar estaciones:", err);
        alert("Hubo un problema al guardar las estaciones");
    });
}
 function saveChanges(field) {
    let value;
    let prendas = []; 
     switch (field) {
        case "nombre":
            const nombreInput = document.getElementById('nombreOutfit');
            value = nombreInput ? nombreInput.value.trim() : '';
            if (!value) {
                alert("El nombre no puede estar vacío.");
                return;
            }
            break;
        case 'publico':
            const switchPublicado = document.getElementById('switchPublicado');
            value = switchPublicado.checked ? 1 : 0;
            break;
        case 'estacion':
             gestionEstaciones();
             break;
        case 'eventos':
            gestionEventos();
             break;
        case 'tags':
                gestionTags();
                break;
         default:
             console.error('Campo no válido para guardar cambios');
             return;
     }
     
 
     fetch('/outfits/updateOutfit', {
         method: 'PUT',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
             outfitId: id_outfit,
             field: field,
             value: value,
            prendas:prendas
         })
     })
         .then(response => response.json())
         .then(data => {
             if (data.success) {                 
                 // Cerrar el panel después de guardar
                 const editDiv = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}Div`);
                 if (editDiv) {
                     editDiv.style.display = 'none';
                 }
                 if (field === "nombre") {
                    document.getElementById("modalNombre").textContent = value;
                    cancelarEdicionNombre();
                }
                
                 // Actualizar etiqueta del switch si es necesario
                 if (field === 'publico') {
                    const label = document.getElementById('estadoPublicadoLabel');
                    if (value === 1) {
                        label.innerText = "PUBLICADO";
                        label.classList.add("text-success");
                        label.classList.remove("text-danger");
                    } else {
                        label.innerText = "NO PUBLICADO";
                        label.classList.remove("text-success");
                        label.classList.add("text-danger");
                    }
                }
             
                 // Actualizar el contenido del modal con los datos actualizados
                 fetch(`/outfits/obtenerOutfit/${id_outfit}`)
                     .then(response => response.json())
                     .then(outfit => {
                         actualizarModal(outfit);
                     })
                     .catch(error => {
                         console.error('Error al obtener los datos actualizados de la prenda:', error);
                     });
             }
         });
     }
    
function actualizarModal(outfit) {
         const modal = document.getElementById('outfitModal');
         modal.querySelector("#modalImage").src = `/outfits/photoOutfit/${outfit.id_outfit}`;
         modal.querySelector("#modalNombre").src = outfit.nombre;
           // Publicado
        const switchPublicado = modal.querySelector("#switchPublicado");
        const labelPublicado = modal.querySelector("#estadoPublicadoLabel");

        const isPublico = Boolean(outfit.publico);
            if (isPublico === true) {
                switchPublicado.checked = true;
                labelPublicado.innerText = "PUBLICADO";
                labelPublicado.classList.add("text-success");
            } else {
                switchPublicado.checked = false;
                labelPublicado.innerText = "NO PUBLICADO";
                labelPublicado.classList.remove("text-success");
            }
         // Estaciones
         const estacionesDiv = modal.querySelector("#modalEstacionOutfit");
         estacionesDiv.innerHTML = ''; 
        
         if (outfit.estaciones && Array.isArray(outfit.estaciones)&& outfit.estaciones.length > 0) {
            outfit.estaciones.forEach(estacion => {
                 const badge = document.createElement('span');
                 badge.className = 'badge bg-secondary me-1 mb-1'; 
                 badge.textContent = estacion.nombre.trim();
                 estacionesDiv.appendChild(badge);
             });
         } else {
             estacionesDiv.innerText = 'Sin estaciones asignadas';
         }
         //eventos
         const eventosDiv = modal.querySelector("#modalEventos");
         eventosDiv.innerHTML = ''; 
         if (outfit.eventos && Array.isArray(outfit.eventos)) {
             outfit.eventos .forEach(evento => {
                 const badge = document.createElement('span');
                 badge.className = 'badge bg-secondary me-1 mb-1';
                 badge.textContent = evento.nombre.trim();
                 eventosDiv.appendChild(badge);
             });
         } else {
             eventosDiv.innerText = 'Sin eventos asignados'; 
         }
          //tags
          const tagsDiv = modal.querySelector("#modalTags");
          tagsDiv.innerHTML = ''; 
          if (outfit.tags && Array.isArray(outfit.tags)) {
             outfit.tags.forEach(tag => {
                 const badge = document.createElement('span');
                 badge.className = 'badge bg-secondary me-1 mb-1'; 
                 badge.textContent = tag.nombre.trim();
                 tagsDiv.appendChild(badge);
             });
          } else {
             tagsDiv.innerText = 'Sin tags asignados'; 

          }
     
        
     }
 
    
   
    
