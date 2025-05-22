document.addEventListener('DOMContentLoaded', () => {
   //cargar parametros
    cargarEstaciones('/prendas/estaciones','filterEstacionPrendaOptions');
    cargarColores('/prendas/colores', 'filterColorOptions');
    cargarEstilos('/prendas/estilos', 'filterEstilosOptions');

    document.getElementById('applyFiltersPrenda').addEventListener('click', () => {
        //aplicar filtros
        const selectedColors = Array.from(document.querySelectorAll('#filterColorOptions .color-option.selected'))
        .map(option => option.querySelector('.color-square').getAttribute('data-value'));
        const selectedEstaciones = Array.from(document.querySelectorAll('#filterEstacionPrendaOptions .option.selected'))
        .map(option => option.getAttribute('data-value'));
        const selectedEstilos = Array.from(document.querySelectorAll('#filterEstilosOptions .option.selected'))
        .map(option => option.getAttribute('data-value'));
          

        // solicitud de filtrado
        fetch('/prendas/filtrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                colores: selectedColors,
                estaciones: selectedEstaciones,
                estilos: selectedEstilos
            })
        })
        .then(response => response.json())
        .then(prendas => {
            const filterModalElement = document.getElementById('filterModalPrendas');
            const filterModal = bootstrap.Modal.getOrCreateInstance(filterModalElement);
            filterModal.hide();
          actualizarPrendas(prendas);          
        })
        .catch(error => {
            console.error('Error al aplicar los filtros:', error);
            alert('Hubo un error al aplicar los filtros. Por favor, inténtalo de nuevo.');
        });
    });
    
    //actualizar contenedor de prendas
    function actualizarPrendas(prendas) {
        const prendasContainer = document.getElementById('prendasContainer');
        const noResultsMessage = document.getElementById('noResultsMessage');
        prendasContainer.innerHTML = '';
 
        if (prendas.length > 0) {
            prendas.forEach(prenda => {
                // Tarjeta prenda
                const prendaElement = document.createElement('div');
                prendaElement.className = 'col-md-2';
                prendaElement.innerHTML = `
                <div class="card mb-4 shadow-sm d-flex flex-column justify-content-center align-items-center w-100 h-100" onclick="openPrendaModal('${prenda.id_prenda}')">
                  <img src="/prendas/photoPrenda/${prenda.id_prenda}" class="card-img-top" alt="${prenda.id_prenda}">
                </div>
              `;
                prendasContainer.appendChild(prendaElement);
            });

            // mostrar resultados
            prendasContainer.style.display = 'flex';
            noResultsMessage.style.display = 'none';
        } else {
            // no resultados
            noResultsMessage.style.display = 'block';
            prendasContainer.style.display = 'none';
        }

        document.getElementById('botonResetPrendaFiltrada').style.display = 'block';
        document.getElementById('listarPrendasContainer').style.display = 'none';
    }

    // restablecer filtros
    document.getElementById('botonResetPrendaFiltrada').addEventListener('click', () => {
        document.getElementById('prendasContainer').style.display = 'none';
        document.getElementById('botonResetPrendaFiltrada').style.display = 'none';
        document.getElementById('listarPrendasContainer').style.display = 'block';
        document.getElementById('noResultsMessage').style.display = 'none';
    });
   
    
});

