
    document.addEventListener("DOMContentLoaded", function() {

    //Cargar parametros
    cargarColores('/prendas/colores', 'colorOpciones', 'prendaColores');
    cargarCategorias('/prendas/categorias', 'categoriaOpciones', 'prendaCategoria','tipoOpciones');
    cargarEstilos('/prendas/estilos', 'estiloOpciones', 'prendaEstilos');
    cargarEstaciones('/prendas/estaciones','estacionOpciones','prendaEstacion');   
        
    //Mostrar modal de exito
    function mostrarModalExito() {
        const modalElement = new bootstrap.Modal(document.getElementById('modalExito'));
        modalElement.show();
        setTimeout(() => {
        window.location.reload();
        }, 2000); 
    }
    //formulario añadir
    document.getElementById('addPrendaForm').addEventListener('submit', (event) => {
      event.preventDefault();

      document.querySelectorAll('.text-danger').forEach(error => error.classList.add('d-none'));
  
       const userIdElement = document.getElementById('userId');
       userId = userIdElement ? userIdElement.value : null;
    
      const photoElement = document.getElementById('prendaFoto');
      const categoria = document.getElementById('prendaCategoria').value;
      const tipo = document.getElementById('prendaTipo').value;
      const colores = document.getElementById('prendaColores').value.split(',');
      const estacion =  document.getElementById('prendaEstacion').value.split(',');
      const estilos = document.getElementById('prendaEstilos').value.split(',');
   
      // Validar campos
      if (!photoElement.files.length) {
        document.getElementById('errorFoto').classList.remove('d-none');
        return;
      }
  
      if (!categoria) {
        document.getElementById('errorCategoria').classList.remove('d-none');
        return;
      }
  
      if (!tipo) {
        document.getElementById('errorTipo').classList.remove('d-none');
        return;
      }
  
      if (colores.length === 0 || colores[0] === '') {
        document.getElementById('errorColores').classList.remove('d-none');
        return;
      }
  
      if (estacion.length === 0||estacion[0] === '') {
        document.getElementById('errorEstaciones').classList.remove('d-none');
        return;
      }
  
      if (estilos.length === 0 || estilos[0] === '') {
        document.getElementById('errorEstilos').classList.remove('d-none');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const photoBase64 = reader.result.split(',')[1];
      // Mostrar cargando
      document.getElementById('spinner').style.display = 'flex';
        try {
          const response = await fetch('/prendas/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              foto: photoBase64,
              activo:1,
              categoria,
              tipo,
              colores,
              estacion, 
              estilos,
              usuario:userId
            })
            
          });
    
          if (response.ok) {
            const modalAddPrenda = bootstrap.Modal.getInstance(document.getElementById('addPrendaModal'));
            if (modalAddPrenda) {
             modalAddPrenda.hide();
            }
            mostrarModalExito();
          } else {
            const errorText = await response.text();
            console.error('Error de respuesta:', errorText);
            alert('Error creando prenda: ' + errorText);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error creando prenda');
        }
        finally {
      // Ocultar cargando
      document.getElementById('spinner').style.display = 'none';
      }
      };
    
      reader.readAsDataURL(photoElement.files[0]);
    });
    });