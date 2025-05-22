
//carga de colores activos
function cargarColoresConActivos(endpointTodos, endpointSeleccionados, containerId, inputId) {
 
  Promise.all([
      fetch(endpointTodos).then(res => res.json()),
      fetch(endpointSeleccionados).then(res => res.json())
  ])
  .then(([todosLosColores, coloresSeleccionados]) => {
     
      const colorContainer = document.getElementById(containerId);
      colorContainer.innerHTML = ''; 

      const coloresSeleccionadosActuales = coloresSeleccionados.map(c => c.id); 

      todosLosColores.forEach(color => {
          const colorOption = document.createElement('div');
          colorOption.className = 'color-option d-flex align-items-center';
          colorOption.style.cursor = 'pointer';
          colorOption.setAttribute('data-color-id', color.id);

          const colorSquare = document.createElement('div');
          colorSquare.className = 'color-square';
          colorSquare.style.backgroundColor = color.hex;
          colorSquare.setAttribute('data-value', color.id);

          const colorName = document.createElement('span');
          colorName.className = 'ms-2';
          colorName.textContent = color.nombre;

          colorOption.appendChild(colorSquare);
          colorOption.appendChild(colorName);

          // Marcar como seleccionado si esta asociado
          if (coloresSeleccionadosActuales.includes(color.id)) {
              colorOption.classList.add('selected');
          }

          colorOption.onclick = () => {
              colorOption.classList.toggle('selected');
              const colorId = color.id;

              const index = coloresSeleccionadosActuales.indexOf(colorId);
              if (index !== -1) {
                  coloresSeleccionadosActuales.splice(index, 1);
              } else {
                  coloresSeleccionadosActuales.push(colorId);
              }

              if (inputId) {
                  document.getElementById(inputId).value = coloresSeleccionadosActuales.join(',');
              }
          };

          colorContainer.appendChild(colorOption);
      });

      if (inputId) {
          document.getElementById(inputId).value = coloresSeleccionadosActuales.join(',');
      }
  })
  .catch(error => {
      console.error('Error al cargar colores:', error);
  });
}

//carga de colores
function cargarColores(endpoint, containerId, inputId) {

  fetch(endpoint) // obtener los colores desde la base de datos
      .then(response => response.json())
      .then(colores => {
     
          const colorContainer = document.getElementById(containerId);
          const coloresSeleccionados = []; 

          colores.forEach(color => {
             
              const colorOption = document.createElement('div');
              colorOption.className = 'color-option d-flex align-items-center';
              colorOption.style.cursor = 'pointer';
              colorOption.setAttribute('data-color-id', color.id);
              // Cuadro de color
              const colorSquare = document.createElement('div');
              colorSquare.className = 'color-square';
              colorSquare.style.backgroundColor = color.hex;
              colorSquare.setAttribute('data-value', color.id);
              // Nombre del color
              const colorName = document.createElement('span');
              colorName.className = 'ms-2';
              colorName.textContent = color.nombre;

              colorOption.appendChild(colorSquare);
              colorOption.appendChild(colorName);

              colorOption.onclick = () => {
                  colorOption.classList.toggle('selected');
                  const colorId = color.id;

                  // Añadir o eliminar el color seleccionado
                  if (coloresSeleccionados.includes(colorId)) {
                      // Eliminar el color si ya esta seleccionado
                      coloresSeleccionados.splice(coloresSeleccionados.indexOf(colorId), 1);
                  } else {
                      // Añadir el color si no esta seleccionado
                      coloresSeleccionados.push(colorId);
                  }

                if (inputId) {
                      document.getElementById(inputId).value = coloresSeleccionados.join(',');
                 }
              };

              // Agrega ra la interfaz
              colorContainer.appendChild(colorOption);
          });
        
      })
      .catch(error => {
          console.log('Error al cargar los colores:', error);
      });
}

function cargarCategorias(endpoint , containerId,inputId,tipo) {
  fetch(endpoint)
      .then(response => response.json())
      .then(categorias => {
        
          const container = document.getElementById(containerId);
          container.innerHTML = ''; 

          categorias.forEach(categoria => {
              const button = document.createElement('button');
              button.type = 'button';
              button.className = 'btn m-1 option';
              button.textContent = categoria.nombre;
              button.value = categoria.id;

              button.onclick = () => {
                  document.querySelectorAll(`#${containerId} button`).forEach(btn => btn.classList.remove('active'));//mantiene solo un boton activo
                  button.classList.add('active');

                  document.getElementById(inputId).value = categoria.id;

                  // Cargar tipos segun categoria
                  cargarTipos(categoria.id, tipo); 
              };

              container.appendChild(button);
          });
      })
      .catch(error => console.error(`Error al cargar categorías desde ${endpoint}:`, error));
}
function cargarTipos(categoriaId,containerId) {
  const tipoContainer = document.getElementById(containerId);
  tipoContainer.innerHTML = ''; 
  fetch(`/prendas/tipos/${categoriaId}`)
    .then(response => response.json())
    .then(tipos => {
      tipos.forEach(tipo => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn m-1 option';
        button.textContent = tipo.nombre;
        button.value = tipo.id;
        button.onclick = () => {
          document.querySelectorAll(`#${containerId} button`).forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          document.getElementById('prendaTipo').value = tipo.id;
        };
        tipoContainer.appendChild(button);
      });
    })
    .catch(error => console.error('Error al cargar tipos:', error));
}
//cargar estilos
function cargarEstilosConActivos(endpointTodos, endpointSeleccionados, containerId, inputId) {
  
  Promise.all([
      fetch(endpointTodos).then(res => res.json()),
      fetch(endpointSeleccionados).then(res => res.json())
  ])
  .then(([todosLosEstilos, estilosSeleccionados]) => {

      const estiloContainer = document.getElementById(containerId);
      estiloContainer.innerHTML = '';

      const estilosSeleccionadosActuales = estilosSeleccionados.map(e => e.id); 

      todosLosEstilos.forEach(estilo => {
          const estiloOption = document.createElement('div');
          estiloOption.className = 'option d-flex align-items-center';
          estiloOption.style.cursor = 'pointer';
          estiloOption.setAttribute('data-value', estilo.id);

          // Nombre del estilo
          const estiloName = document.createElement('span');
          estiloName.className = 'ms-2';
          estiloName.textContent = estilo.nombre;
          estiloOption.appendChild(estiloName);

          // Marcar como seleccionado si esta asociado 
          if (estilosSeleccionadosActuales.includes(estilo.id)) {
              estiloOption.classList.add('selected');
          }

          estiloOption.onclick = () => {
              estiloOption.classList.toggle('selected');
              const estiloId = estilo.id;

              const index = estilosSeleccionadosActuales.indexOf(estiloId);
              if (index !== -1) {
                  estilosSeleccionadosActuales.splice(index, 1);
              } else {
                  estilosSeleccionadosActuales.push(estiloId);
              }

              if (inputId) {
                  document.getElementById(inputId).value = estilosSeleccionadosActuales.join(',');
              }
          };

          estiloContainer.appendChild(estiloOption);
      });

      if (inputId) {
          document.getElementById(inputId).value = estilosSeleccionadosActuales.join(',');
      }
  })
  .catch(error => {
      console.error('Error al cargar estilos:', error);
  });
}

 function cargarEstilos(endpoint, containerId, inputId) {
  fetch(endpoint)
      .then(response => response.json())
      .then(estilos => {

          const containerEstilos = document.getElementById(containerId);
          const estilosSeleccionados = [];

          estilos.forEach(estilo => {
              const estiloOption = document.createElement('div');
              estiloOption.className = 'option d-flex align-items-center';
              estiloOption.style.cursor = 'pointer';
              estiloOption.textContent = estilo.nombre;
              estiloOption.setAttribute('data-value', estilo.id);

             estiloOption.onclick = () => {
                  estiloOption.classList.toggle('selected');
               
                  if (estilosSeleccionados.includes(estilo.id)) {
                      estilosSeleccionados.splice(estilosSeleccionados.indexOf(estilo.id), 1);
                  } else {
                      estilosSeleccionados.push(estilo.id);
                  }
                  if (inputId) {
                      document.getElementById(inputId).value = estilosSeleccionados.join(',');
                  }
              };

              containerEstilos.appendChild(estiloOption);
          });
      })
      .catch(error => console.error('Error al cargar estilos:', error));
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
  // Fetch ambos en paralelo
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

          // Nombre del estilo
          const estacionName = document.createElement('span');
          estacionName.className = 'ms-2';
          estacionName.textContent = estacion.nombre;

          estacionOption.appendChild(estacionName);

          // Marcar como seleccionado si está asociado a la prenda
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

 