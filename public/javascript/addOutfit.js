
//Cargar parametros
cargarEventos('/outfits/eventos',"eventosOpcionesAdd","outfitEvento" );
cargarTags('/outfits/tags','tagsOpcionesAdd',"outfitTags");
cargarEstaciones('/outfits/estaciones','estacionOpcionesOutfit','outfitEstacion');

//Mostrar modal de exito
function mostrarModalExitoOutfit() {
    const modalElement = new bootstrap.Modal(document.getElementById('modalExitoOutfit'));
    modalElement.show();
    setTimeout(() => {
      window.location.reload(); 
    }, 2000); 
  }
   
 
  //navegacion modal
  let currentStep = 1;
  const totalSteps = document.querySelectorAll(".stepAdd").length; 
  
  function navigate(step) {
    //  valida el paso actual
    if (step > 0 && !validateStep(currentStep - 1)) {
        return; 
    }

    document.getElementById('step' + currentStep).style.display = 'none';

    // Actualizar el paso 
    currentStep += step;
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;

    // Mostrar el nuevo paso
    document.getElementById('step' + currentStep).style.display = 'block';

    // botones
    document.getElementById('prevBtnAdd').style.display = currentStep === 1 ? 'none' : 'inline-block';
    document.getElementById('nextBtnAdd').style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    document.getElementById('saveOptions').style.display = currentStep === totalSteps ? 'inline-block' : 'none';

    if (currentStep === 2) {
        actualizarPrevisualizacion();
    }
}
//funcion de validacion
function validateStep(stepIndex) {
   
    document.querySelectorAll('.text-danger').forEach(error => error.classList.add('d-none'));

    if (stepIndex === 0) {
        const nombre = document.getElementById('outfitNombre').value.trim();
        if (!nombre) {
            document.getElementById('errorNombre').classList.remove('d-none');
            return false;
        }
        const estacion = document.getElementById('outfitEstacion').value.trim();
        if (!estacion) {
            document.getElementById('errorEstaciones').classList.remove('d-none');
            return false;
        }
        const evento = document.getElementById('outfitEvento').value.trim();
        if (!evento) {
            document.getElementById('errorEventos').classList.remove('d-none');
            return false;
        }
        const tags = document.getElementById('outfitTags').value.trim();
        if (!tags) {
            document.getElementById('errorTags').classList.remove('d-none');
       
            return false;
        }
    }

    return true;
}

  
const prendasContainer = document.getElementById('prendasContainer');
const previewContainer = document.getElementById('previewContainer');
    
     
  function actualizarPrevisualizacion() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
    previewContainer.style.position = 'relative';
  
    const seleccionadas = document.querySelectorAll('.prenda-image.seleccionada');
  
    if (seleccionadas.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.textContent = 'Selecciona prendas para previsualizar el outfit';
      mensaje.style.textAlign = 'center';
      mensaje.style.color = '#aaa';
      previewContainer.appendChild(mensaje);
      return;
    }
   
  
    seleccionadas.forEach((prenda, index) => {
      const img = document.createElement('img');
      img.src = prenda.src;
      img.alt = 'Prenda seleccionada';
      img.className = 'prenda-draggable';
  
      img.style.width = '150px';        
      img.style.height = 'auto';          
      img.style.maxWidth = 'none';     
      img.style.maxHeight = 'none';      
      img.style.objectFit = 'contain';   
  
  //posicion inicial
      img.style.position = 'absolute';
      img.style.left = `${50 + index * 30}px`;
      img.style.top = `${50 + index * 30}px`;
  
      makeDraggable(img); // Hacer que se pueda mover
      previewContainer.appendChild(img);
    });
  }
  //funcion de biblioteca interact.js
  function makeDraggable(el) {
    interact(el)
      .draggable({
        listeners: {
          move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  
            target.style.transform = `translate(${x}px, ${y}px) scale(${target.dataset.scale || 1}) rotate(${target.dataset.rotate || 0}deg)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            const target = event.target;
            let { width, height } = event.rect;
  
            // Sin restricciones visuales
            target.style.maxWidth = 'none';
            target.style.maxHeight = 'none';
  
            // Aplicar tamaño actualizado
            target.style.width = width + 'px';
            target.style.height = height + 'px';
          }
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 200, height: 200 },
            max: { width: 3000, height: 3000 }
          })
        ]
      });
  }
  
  // Carga de categorías
  document.addEventListener('DOMContentLoaded', () => {
     
      cargarCategoriasOutfit();
     
    });
      

      //Rellena el acordeon con las categorias
async function cargarCategoriasOutfit() {
          try {
          const response = await fetch('/prendas/categorias'); 
          if (!response.ok) throw new Error('No se pudo obtener las categorías');
  
          const categorias = await response.json();
          const categoriaContainer = document.getElementById('categoriasAcordeon');
  
          categorias.forEach(categoria => {
              const accordionItem = document.createElement('div');
              accordionItem.className = 'accordion-item';
  
              const headerId = `heading${categoria.nombre.replace(/\s+/g, '')}`;
              const collapseId = `collapse${categoria.nombre.replace(/\s+/g, '')}`;
              const containerId = categoria.nombre.replace(/\s+/g, '').toLowerCase();
  
              accordionItem.innerHTML = `
                  <h2 class="accordion-header" id="${headerId}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                   ${categoria.nombre}
                      </button>
                  </h2>
                  <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#categoriasAcordeon">
                      <div class="accordion-body d-flex flex-wrap gap-2" id="${containerId}"></div>
                  </div>
              `;
  
              categoriaContainer.appendChild(accordionItem);
          });
   
      cargarPrendas();
  
      } catch (error) {
          console.error('Error al cargar categorías:', error);
          alert('Hubo un error al cargar las categorías.');
      }
  }   
  
async function cargarPrendas() {
      try {
          const response = await fetch('/prendas/listarPrendasJSON');
          if (!response.ok) throw new Error('No se pudo obtener las prendas');
  
          const data = await response.json();
  
          const contenedores = document.querySelectorAll('.accordion-body');
          contenedores.forEach(contenedor => contenedor.innerHTML = '');
  
          // mostrar las prendas en el contenedor de su categoria 
          data.prendas.forEach(prenda => {
              const div = document.createElement('div');
              div.classList.add('prenda-item');
              
              const img = document.createElement('img');
              img.src = `/prendas/photoPrenda/${prenda.id_prenda}`;
              img.alt = prenda.nombre;
              img.alt = prenda.id_prenda;
              img.classList.add('prenda-image');
              img.dataset.id = prenda.id_prenda;  
              img.dataset.categoria = prenda.categoria; 
  
              img.addEventListener('click', () => {
                  img.classList.toggle('seleccionada');
                  actualizarPrevisualizacion();
              });
  
              const containerId = prenda.categoria.replace(/\s+/g, '').toLowerCase();
              const contenedor = document.getElementById(containerId);
              if (contenedor) {
                  contenedor.appendChild(div);
                  div.appendChild(img);
              } else {
                  console.warn(`Contenedor no encontrado para la categoría: ${prenda.categoria}`);
              }
              
          });
      } catch (error) {
          console.error('Error al cargar las prendas:', error);
          alert('Hubo un error al cargar las prendas.');
      }
  
  }
  
     // Función para guardar el Outfit con las prendas seleccionadas
async function guardarOutfit(event,esPublico) {
      
      //valores
      const nombre = document.getElementById('outfitNombre').value.trim();
      const selectedPrendas = [];
      const checkboxes = document.querySelectorAll('.prenda-image.seleccionada');
      
      // Obtener las prendas seleccionadas
      checkboxes.forEach(img => {
          selectedPrendas.push(img.dataset.id);  
    });
      // Validar que al menos una prenda haya sido seleccionada
      if (selectedPrendas.length === 0) {
        document.getElementById('errorPrendas').classList.remove('d-none');
          return;
      }

     // Capturar las estaciones seleccionadas
     const estacion= document.getElementById('outfitEstacion').value
          ? document.getElementById('outfitEstacion').value.split(',').map(e => e.trim()) 
          : [];  
  
      // Obtener los eventos seleccionados
      const eventos = document.getElementById('outfitEvento').value
          ? document.getElementById('outfitEvento').value.split(',').map(e => e.trim()) 
          : [];
  
      // Obtener los tags seleccionados
      const tags = document.getElementById('outfitTags').value
          ? document.getElementById('outfitTags').value.split(',').map(t => t.trim())
          : [];
      
  
      /////////////////////////////////////
      // Guardar imagen
      const previewContainer = document.getElementById('previewContainer');
      html2canvas(previewContainer).then(async (canvas) => {
          const imagenBase64 = canvas.toDataURL('image/png'); 
  
          // Crear el objeto con los datos del outfit
          const outfitData = {
              nombre: nombre,
              prendas: selectedPrendas,
              estacion: estacion,
              eventos: eventos,
              tags: tags,
              imagen: imagenBase64, 
              publico: esPublico
          };
  
          try {
              
              const response = await fetch('/outfits/create', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(outfitData)
              });
  
              if (response.ok) {
                  const modalAddOutfit = bootstrap.Modal.getInstance(document.getElementById('createOutfitModal'));
                  if (modalAddOutfit) {
                      modalAddOutfit.hide();
                  }
                  mostrarModalExitoOutfit();
                  
              } else {
                  const errorText = await response.text();
                    console.error('Error de respuesta:', errorText);
                    alert('Error creando outfit: ' + errorText);
               
              }
          } catch (error) {
              console.error('Error al guardar el outfit:', error);
              alert('Hubo un error al guardar el outfit.');
          }
      });
  }
  