 // Cargar los tipos de eventos
function cargarEventos(endpoint, containerId, inputId){
 fetch(endpoint)
 .then(response => response.json())
 .then(eventos => {
  
     const eventoContainer = document.getElementById(containerId);
     const eventosSeleccionados = [];
     eventos.forEach(evento => {
         // Crear un botón para cada evento
         const eventoOption = document.createElement('div');
         eventoOption.className = 'option d-flex align-items-center';
         eventoOption.style.cursor = 'pointer';
         eventoOption.textContent = evento.nombre;
         eventoOption.setAttribute('data-value', evento.id);

         // Manejar la selección de eventos
         eventoOption.onclick = () => {
             eventoOption.classList.toggle('selected');
             if (eventosSeleccionados.includes(evento.id)) {
                 eventosSeleccionados.splice(eventosSeleccionados.indexOf(evento.id), 1);
             } else {
                 eventosSeleccionados.push(evento.id);
             }
             if (inputId) {
                document.getElementById(inputId).value = eventosSeleccionados.join(',');
            }
           
             };

         eventoContainer.appendChild(eventoOption);
     });
 })
 .catch(error => console.error('Error al cargar eventos:', error));
 }
 function cargarEventosConActivos(endpointTodos, endpointSeleccionados, containerId, inputId) {
   
    Promise.all([
        fetch(endpointTodos).then(res => res.json()),
        fetch(endpointSeleccionados).then(res => res.json())
    ])
    .then(([todosLosEventos, eventosSeleccionados]) => {
  
        const eventoContainer = document.getElementById(containerId);
        eventoContainer.innerHTML = ''; 
  
        const eventosSeleccionadosActuales = eventosSeleccionados.map(e => e.id); 
  
        todosLosEventos.forEach(evento => {
            const eventoOption = document.createElement('div');
            eventoOption.className = 'option d-flex align-items-center';
            eventoOption.style.cursor = 'pointer';
            eventoOption.setAttribute('data-value', evento.id);
  
           
            const eventoName = document.createElement('span');
            eventoName.className = 'ms-2';
            eventoName.textContent = evento.nombre;
  
            eventoOption.appendChild(eventoName);
  
            // Marcar como seleccionado si esta asociado 
            if (eventosSeleccionadosActuales.includes(evento.id)) {
                eventoOption.classList.add('selected');
            }
  
            eventoOption.onclick = () => {
                eventoOption.classList.toggle('selected');
                const eventoId = evento.id;
  
                const index = eventosSeleccionadosActuales.indexOf(eventoId);
                if (index !== -1) {
                    eventosSeleccionadosActuales.splice(index, 1);
                } else {
                    eventosSeleccionadosActuales.push(eventoId);
                }
  
                if (inputId) {
                    document.getElementById(inputId).value = eventosSeleccionadosActuales.join(',');
                }
            };
  
            eventoContainer.appendChild(eventoOption);
        });
  
        // Inicializar input oculto
        if (inputId) {
            document.getElementById(inputId).value = eventosSeleccionadosActuales.join(',');
        }
    })
    .catch(error => {
        console.error('Error al cargar eventos:', error);
    });
  }
  function cargarTagsConActivos(endpointTodos, endpointSeleccionados, containerId, inputId) {
    
    Promise.all([
        fetch(endpointTodos).then(res => res.json()),
        fetch(endpointSeleccionados).then(res => res.json())
    ])
    .then(([todosLosTags, tagsSeleccionados]) => {
       
        const tagContainer = document.getElementById(containerId);
        tagContainer.innerHTML = ''; // Limpiar antes de renderizar
  
        const tagsSeleccionadosActuales = tagsSeleccionados.map(e => e.id); 
  
        todosLosTags.forEach(tag => {
            const tagOption = document.createElement('div');
            tagOption.className = 'option d-flex align-items-center';
            tagOption.style.cursor = 'pointer';
            tagOption.setAttribute('data-value', tag.id);
  
            // Nombre 
            const tagName = document.createElement('span');
            tagName.className = 'ms-2';
            tagName.textContent = tag.nombre;
  
            tagOption.appendChild(tagName);
  
            // Marcar como seleccionado si esta asociado
            if (tagsSeleccionadosActuales.includes(tag.id)) {
                tagOption.classList.add('selected');
            }
  
            tagOption.onclick = () => {
                tagOption.classList.toggle('selected');
                const tagId = tag.id;
  
                const index = tagsSeleccionadosActuales.indexOf(tagId);
                if (index !== -1) {
                    tagsSeleccionadosActuales.splice(index, 1);
                } else {
                    tagsSeleccionadosActuales.push(tagId);
                }
  
                if (inputId) {
                    document.getElementById(inputId).value = tagsSeleccionadosActuales.join(',');
                }
            };
  
            tagContainer.appendChild(tagOption);
        });
  
        
        if (inputId) {
            document.getElementById(inputId).value = tagsSeleccionadosActuales.join(',');
        }
    })
    .catch(error => {
        console.error('Error al cargar tags:', error);
    });
  }
  

// Cargar los tags
function cargarTags(endpoint,containerId,inputId){
    fetch(endpoint)
    .then(response => response.json())
    .then(tags => {
      
         const tagsContainer = document.getElementById(containerId);
         const tagsSeleccionados = [];
    
         tags.forEach(tag => {
             // Crear un botón para cada tags
             const tagOption = document.createElement('div');
             tagOption.className = 'option d-flex align-items-center';
             tagOption.style.cursor = 'pointer';
             tagOption.textContent = tag.nombre;
             tagOption.setAttribute('data-value', tag.id);
    
             // Manejar la selección de tags
             tagOption.onclick = () => {
                 tagOption.classList.toggle('selected');
                 if (tagsSeleccionados.includes(tag.id)) {
                     tagsSeleccionados.splice(tagsSeleccionados.indexOf(tag.id), 1);
                 } else {
                     tagsSeleccionados.push(tag.id);
                 }
                 if (inputId) {
                    document.getElementById(inputId).value = tagsSeleccionados.join(',');
                }          
             };
    
             tagsContainer.appendChild(tagOption);
         });
     })
     .catch(error => console.error('Error al cargar tags:', error));
    }

    function cargarEstaciones(endpoint, containerId, inputId) {
        fetch(endpoint)
            .then(response => response.json())
            .then(estaciones => {
      
                const containerEstaciones = document.getElementById(containerId);
                const estacionesSeleccionadas = [];
      
                estaciones.forEach(estacion => {
                    const estacionOption = document.createElement('div');
                    estacionOption.className = 'option d-flex align-items-center';
                    estacionOption.style.cursor = 'pointer';
                    estacionOption.textContent = estacion.nombre;
                    estacionOption.setAttribute('data-value', estacion.id);
      
                    estacionOption.onclick = () => {
                      estacionOption.classList.toggle('selected');
                     
                        if (estacionesSeleccionadas.includes(estacion.id)) {
                          estacionesSeleccionadas.splice(estacionesSeleccionadas.indexOf(estacion.id), 1);
                        } else {
                          estacionesSeleccionadas.push(estacion.id);
                        }
                        if (inputId) {
                            document.getElementById(inputId).value = estacionesSeleccionadas.join(',');
                        }
                    };
      
                    containerEstaciones.appendChild(estacionOption);
                });
            })
            .catch(error => console.error('Error al cargar estacion:', error));
      }
      function cargarEstacionesConActivos(endpointTodos, endpointSeleccionados, containerId, inputId) {
       
        Promise.all([
            fetch(endpointTodos).then(res => res.json()),
            fetch(endpointSeleccionados).then(res => res.json())
        ])
        .then(([todosLasEstaciones, estacionesSeleccionadas]) => {
          
            const estacionContainer = document.getElementById(containerId);
            estacionContainer.innerHTML = ''; 
      
            const estacionesSeleccionadasActuales = estacionesSeleccionadas.map(e => e.id); 
      
            todosLasEstaciones.forEach(estacion => {
                const estacionOption = document.createElement('div');
                estacionOption.className = 'option d-flex align-items-center';
                estacionOption.style.cursor = 'pointer';
                estacionOption.setAttribute('data-value', estacion.id);
      
         
                const estacionName = document.createElement('span');
                estacionName.className = 'ms-2';
                estacionName.textContent = estacion.nombre;
      
                estacionOption.appendChild(estacionName);
      
                // Marcar como seleccionado si esta ya asociado
                if (estacionesSeleccionadasActuales.includes(estacion.id)) {
                  estacionOption.classList.add('selected');
                }
      
                estacionOption.onclick = () => {
                  estacionOption.classList.toggle('selected');
                    const estacionId = estacion.id;
      
                    const index = estacionesSeleccionadasActuales.indexOf(estacionId);
                    if (index !== -1) {
                      estacionesSeleccionadasActuales.splice(index, 1);
                    } else {
                      estacionesSeleccionadasActuales.push(estacionId);
                    }
      
                    if (inputId) {
                        document.getElementById(inputId).value = estacionesSeleccionadasActuales.join(',');
                    }
                };
      
                estacionContainer.appendChild(estacionOption);
            });
      
            if (inputId) {
                document.getElementById(inputId).value = estacionesSeleccionadasActuales.join(',');
            }
        })
        .catch(error => {
            console.error('Error al cargar estaciones:', error);
        });
      }
      
       