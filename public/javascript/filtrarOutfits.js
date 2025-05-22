  
document.addEventListener('DOMContentLoaded', () => {
    //cargar parametros
    cargarEstaciones('/outfits/estaciones','filterEstacionOptions_outfit');
    cargarEventos('/outfits/eventos', 'filterEventosOptions_outfit');
    cargarTags('/outfits/tags', 'filterTagsOptions_outfit');
    
    document.getElementById('applyFiltersOutfit').addEventListener('click', () => {
       //aplicar filtros
        const selectedEventos = Array.from(document.querySelectorAll('#filterEventosOptions_outfit .option.selected'))
        .map(option => option.getAttribute('data-value'));
        const selectedTags = Array.from(document.querySelectorAll('#filterTagsOptions_outfit .option.selected'))
        .map(option => option.getAttribute('data-value'));
        const selectedEstaciones = Array.from(document.querySelectorAll('#filterEstacionOptions_outfit .option.selected'))
        .map(button => button.getAttribute('data-value'));

        // solicitud de filtrado
        fetch('/outfits/filtrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tags:selectedTags,
                eventos:selectedEventos,
                estaciones: selectedEstaciones
            })
        })
        .then(response => response.json())
        .then(outfits => {
                        
            const filterModalOutfit =document.getElementById('filterModalOutfit');
            const fmodal=bootstrap.Modal.getOrCreateInstance(filterModalOutfit);
            fmodal.hide();
            actualizarOutfits(outfits);
        })
        .catch(error => {
            console.error('Error al aplicar los filtros:', error);
            alert('Hubo un error al aplicar los filtros. Por favor, inténtalo de nuevo.');
        });
    });
   //actualizar contenedor de outfits
    function actualizarOutfits(outfits) {
        const outfitsContainer = document.getElementById('outfitsContainer');
        const noResultsMessage = document.getElementById('noResultsOutfitMessage');
        outfitsContainer.innerHTML = ''; 

        if (outfits.length > 0) {
           outfits.forEach(outfit => {
            const outfitElement = document.createElement('div');
            outfitElement.className = 'col-md-4 mb-4';
            outfitElement.innerHTML = `
        <div class="card mb-4 shadow-sm d-flex flex-column justify-content-center align-items-center w-100 h-100" onclick="openOutfitModal('${outfit.id_outfit}')">
            <img src="/outfits/photoOutfit/${outfit.id_outfit}" alt="${outfit.id_outfit}" style="height: 350px; object-fit: contain;">
             <div class="card-body">
             <h5 class="card-text fw-bold"> ${outfit.nombre}</h5>
             </div> 
        </div>
    `;
    outfitsContainer.appendChild(outfitElement);
});

// mostrar resultados
            outfitsContainer.style.display = 'flex';
            noResultsMessage.style.display = 'none';
        } else {
            // no resultados
            noResultsMessage.style.display = 'block';
            outfitsContainer.style.display = 'none';
        }

        document.getElementById('resetFiltersOutfit').style.display = 'block';
        document.getElementById('listarOutfitsContainer').style.display = 'none';
    }

      // restablecer filtros
    document.getElementById('resetFiltersOutfit').addEventListener('click', () => {
        document.getElementById('outfitsContainer').style.display = 'none';
        document.getElementById('resetFiltersOutfit').style.display = 'none';
        document.getElementById('listarOutfitsContainer').style.display = 'block';
        document.getElementById('noResultsOutfitMessage').style.display = 'none';
    });
});
