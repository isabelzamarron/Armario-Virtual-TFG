
let categoriasCargadas = false;
let tiposCargados = false;
let coloresCargados = false;
let estilosCargados = false;
let estacionesCargadas = false; 

document.getElementById('prendaModal').addEventListener('hidden.bs.modal', function () {
    cerrarModal(); // Llama a la funcion cuando se cierra el modal
    restablecerParametros();
});
 
function restablecerParametros() {
   
    const sections = ['categoria', 'tipo', 'colores', 'estacion', 'estilos'];
    
    sections.forEach(sec => {
        
        const opcionesDiv = document.getElementById(`${sec}OpcionesDetalles`);
        const inputHidden = document.getElementById(`prenda${sec.charAt(0).toUpperCase() + sec.slice(1)}`);

        if (opcionesDiv) {
            opcionesDiv.innerHTML = '';  
        }
        if (inputHidden) {
            inputHidden.value = '';  
        }
    });
    categoriasCargadas = false;
    tiposCargados = false;
    coloresCargados = false;
    estilosCargados = false;
    estacionesCargadas = false; 
}   
// Ocultar todos los parametros
function cerrarModal() {
   
    const sections = ['categoria', 'tipo', 'colores', 'estacion', 'estilos'];
    
    sections.forEach(sec => {
        const editDiv = document.getElementById(`edit${sec.charAt(0).toUpperCase() + sec.slice(1)}Div`);
        editDiv.style.display = 'none'; 
    });
}

function mostrarParametros(section) {
    const sections = ['categoria', 'tipo', 'colores', 'estacion', 'estilos'];

    sections.forEach(sec => {
        const editDiv = document.getElementById(`edit${sec.charAt(0).toUpperCase() + sec.slice(1)}Div`);
        if (sec === section) {
            const mostrar = editDiv.style.display === 'none';
            editDiv.style.display = mostrar ? 'block' : 'none';

            if (mostrar) {
                if (sec === 'categoria' && !categoriasCargadas) {
                    cargarCategorias('/prendas/categorias', 'categoriaOpcionesDetalles', 'prendaCategoria');
                    categoriasCargadas = true;
                } else if (sec === 'tipo' && !tiposCargados) {
                    getCategoria().then(categoriaId => {
                        cargarTipos(categoriaId, 'tipoOpcionesDetalles');
                        tiposCargados = true;
                    }).catch(error => console.error('Error al obtener categoría:', error));
                } else if (sec === 'colores' && !coloresCargados) {
                    cargarColoresConActivos('/prendas/colores', `/prendas/${id_prenda}/colorByPrenda`, 'colorOpcionesDetalles', 'prendaColores');
                    coloresCargados = true;
                } else if (sec === 'estilos' && !estilosCargados) {
                    cargarEstilosConActivos('/prendas/estilos', `/prendas/${id_prenda}/estiloByPrenda`, 'estiloOpcionesDetalles', 'prendaEstilos');
                    estilosCargados = true;
                }
                else if (sec === 'estacion' && !estacionesCargadas) {
                    cargarEstacionesConActivos('/prendas/estaciones', `/prendas/${id_prenda}/estacionByPrenda`, 'estacionOpcionesDetalles', 'prendaEstacion');
                    estacionesCargadas = true;
                }
            }
        } else {
            editDiv.style.display = 'none';
        }
    });
}

function openPrendaModal(prenda_id) {
    
    fetch(`/prendas/obtenerPrenda/${prenda_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la prenda');
            }
            return response.json();
        })
        .then(prenda => {
            mostrarPrendaModal(prenda); 
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron obtener los detalles de la prenda.');
        });
}
let id_prenda = null;
let p;

//rellenar contenido
function mostrarPrendaModal(prenda) {

    const modal = document.getElementById('prendaModal');
   
    modal.querySelector("#modalImage").src = `/prendas/photoPrenda/${prenda.id_prenda}`;
    modal.querySelector("#modalCategoria").innerText = prenda.categoria;
    modal.querySelector("#modalTipo").innerText = prenda.tipo;

    //estaciones
    const estacionesDiv = modal.querySelector("#modalEstacion");
    estacionesDiv.innerHTML = ''; // Limpiar contenido previo
    if (prenda.estaciones && Array.isArray(prenda.estaciones)) {
        prenda.estaciones.forEach(estacion => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary me-1 mb-1'; 
        badge.textContent = estacion.nombre.trim();
        estacionesDiv.appendChild(badge);
       } );
    } else {
        estacionesDiv.innerText = 'Sin estaciones asignadas'; 
    }
    //
    //estilos,colores
    //---------------------------------------------------------------------------------------------
   
    const estilosDiv = modal.querySelector("#modalEstilos");
    estilosDiv.innerHTML = ''; // Limpiar contenido previo

    if (prenda.estilos && Array.isArray(prenda.estilos)) {
        prenda.estilos.forEach(estilo => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary me-1 mb-1'; // Bootstrap-style
            badge.textContent = estilo.nombre.trim();
            estilosDiv.appendChild(badge);
        });
    } else {
        estilosDiv.innerText = 'Sin estilos asignados';
    }

    id_prenda = prenda.id_prenda;
//---------------------------------------------------------------------------------------------------------------
    // colores
    const modalColorBox = modal.querySelector("#modalColores");
    modalColorBox.innerHTML = ''; // Limpiar contenido previo

    if (prenda.colores && Array.isArray(prenda.colores)) {
       
        prenda.colores.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option'; 

            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color.hex; 
            colorDiv.className = 'color-square';

            const colorName = document.createElement('span');
            colorName.innerText = color.nombre; +

            colorOption.appendChild(colorDiv);
            colorOption.appendChild(colorName);
            modalColorBox.appendChild(colorOption);
        });
      
  
    }
   
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

}


//ELIMINAR PRENDA
function confirmarEliminacion() {
   
    fetch('/prendas/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id_prenda })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
                if (confirmDeleteModal) {
                    confirmDeleteModal.hide();
                }
                window.location.href = `/prendas/listarPrendas`;
            } else {
                console.error("Error al eliminar la prenda:", data.message);
            }
        })
        .catch(error => console.error("Error:", error));
}

async function getCategoria() {
    try {
        const response = await fetch(`/prendas/obtenerPrenda/${id_prenda}`);
        if (!response.ok) {
            throw new Error('Error al obtener los detalles de la prenda');
        }
        const prenda = await response.json();

        return prenda.categoria_id;
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron obtener los detalles de la prenda.');
    }
}
//guardar los cambios
function gestionColores(){
    const coloresSeleccionados = document.getElementById('prendaColores').value
    .split(',')
    .map(c => c.trim()) 
    .filter(c => c !== ''); 
    fetch(`/prendas/${id_prenda}/colores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ colores: coloresSeleccionados })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Colores actualizados correctamente');
            fetch(`/prendas/obtenerPrenda/${id_prenda}`)
                .then(r => r.json())
                .then(p => {
                    actualizarModal(p);
                    mostrarParametros("colores");
                    coloresOriginales = p.colores.map(c => c.id); 
                });
        } else {
            alert('Error al actualizar colores');
        }
    })
    .catch(err => {
        console.error("Error al actualizar colores:", err);
        alert("Hubo un problema al guardar los colores");
    });
    return;
}
function gestionEstilos() {
    const estilosSeleccionados = document.getElementById('prendaEstilos').value
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== '');

    fetch(`/prendas/${id_prenda}/estilos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estilos: estilosSeleccionados })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Estilos actualizados correctamente');
            fetch(`/prendas/obtenerPrenda/${id_prenda}`)
                .then(r => r.json())
                .then(p => {
                    actualizarModal(p);
                    mostrarParametros("estilos");
                    estilosOriginales = p.estilos.map(e => e.id); 
                });
        } else {
            alert('Error al actualizar estilos');
        }
    })
    .catch(err => {
        console.error("Error al actualizar estilos:", err);
        alert("Hubo un problema al guardar los estilos");
    });
}
function gestionEstaciones() {
    const estacionesSeleccionadas = document.getElementById('prendaEstacion').value
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== '');

    fetch(`/prendas/${id_prenda}/estaciones`, {
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
            fetch(`/prendas/obtenerPrenda/${id_prenda}`)
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
    switch (field) {
        case "categoria":
            value = document.getElementById('prendaCategoria').value;
            break;
        case 'tipo':
            value = document.getElementById('prendaTipo').value;
            break;
            case 'colores':
               gestionColores();
                break;
        case 'estacion':
            gestionEstaciones();
            break;
        case 'estilos':
           gestionEstilos();
            break;
        default:
            console.error('Campo no válido para guardar cambios');
            return;
    }
    

    fetch('/prendas/updatePrenda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prendaId: id_prenda,
            field: field,
            value: value
        })
    })
    
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const editDiv = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}Div`);
                if (editDiv) {
                    editDiv.style.display = 'none';
                }
        
                // Actualiza el contenido del modal 
                fetch(`/prendas/obtenerPrenda/${id_prenda}`)
                    .then(response => response.json())
                    .then(prenda => {
                        actualizarModal(prenda);
                    })
                    .catch(error => {
                        console.error('Error al obtener los datos actualizados de la prenda:', error);
                    });
            }
        });
    }

    function actualizarModal(prenda) {
        const modal = document.getElementById('prendaModal');
    
        // Actualiza imagen, categoría y tipo
        modal.querySelector("#modalImage").src = `/prendas/photoPrenda/${prenda.id_prenda}`;
        modal.querySelector("#modalCategoria").innerText = prenda.categoria;
        modal.querySelector("#modalTipo").innerText = prenda.tipo;
    
       //estaciones
        const estacionesDiv = modal.querySelector("#modalEstacion");
        estacionesDiv.innerHTML = ''; 
    
        if (prenda.estaciones && Array.isArray(prenda.estaciones)&& prenda.estaciones.length > 0) {
            prenda.estaciones.forEach(estacion => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-secondary me-1 mb-1'; 
                badge.textContent = estacion.nombre.trim();
                estacionesDiv.appendChild(badge);
            });
        } else {
            estacionesDiv.innerText = 'Sin estaciones asignadas';
        }
    
        // estilos
        const estilosDiv = modal.querySelector("#modalEstilos");
        estilosDiv.innerHTML = ''; 
            
        if (prenda.estilos && Array.isArray(prenda.estilos) && prenda.estilos.length > 0) {
            prenda.estilos.forEach(estilo => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-secondary me-1 mb-1'; 
                badge.textContent = estilo.nombre.trim();
                estilosDiv.appendChild(badge);
            });
        } else {
            estilosDiv.innerText = 'Sin estilos asignados';
        }
        // colores
        const modalColorBox = modal.querySelector("#modalColores");
        modalColorBox.innerHTML = ''; 
    
        if (prenda.colores && Array.isArray(prenda.colores)) {
            prenda.colores.forEach(color => {
                const colorOption = document.createElement('div');
                colorOption.className = 'color-option';
    
                const colorDiv = document.createElement('div');
                colorDiv.style.backgroundColor = color.hex;
                colorDiv.className = 'color-square';
    
                const colorName = document.createElement('span');
                colorName.innerText = color.nombre;
    
                colorOption.appendChild(colorDiv);
                colorOption.appendChild(colorName);
                modalColorBox.appendChild(colorOption);
            });
        }
        
    }
