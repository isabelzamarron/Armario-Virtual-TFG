document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('searchOutfit').addEventListener('input', (event) => {
    const query = event.target.value.trim();
    const searchContainer = document.getElementById('searchOutfitContainer');
    const listarOutfitsContainer = document.getElementById('listarOutfitsContainer');
    const noResultSearchMessage = document.getElementById('noResultOutfitSearchMessage');
          // cancela busqueda cuando input vacio
        if (!query) {
            listarOutfitsContainer.style.display = 'block';
            searchContainer.style.display = 'none';
            noResultSearchMessage.style.display = 'none';
            searchContainer.innerHTML = ''; 
            return;
        }
        listarOutfitsContainer.style.display='none';
        // solicitud de busqueda
        fetch(`/outfits/buscar?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(outfitsBusqueda => {
                 
                  if (!query) {
                    return;
                }
                actualizarOutfits(outfitsBusqueda); // Función para actualizar la interfaz
            })
            .catch(error =>{
                console.error('Error en la búsqueda:', error);
                searchContainer.style.display = 'none';
                noResultSearchMessage.style.display = 'block';
            });
    
});


function actualizarOutfits(outfits) {
    const container = document.getElementById('searchOutfitContainer');
    container.innerHTML = ''; // Limpiar resultados anteriores

    if (outfits.length === 0) {
        container.style.display = 'none';
        document.getElementById('noResultOutfitSearchMessage').style.display = 'block';
    } else {
        outfits.forEach(outfit => {
            const card = `
                <div class="col-md-4 mb-4 ">
                    <div class="card mb-4 shadow-sm d-flex flex-column justify-content-center align-items-center w-100 h-100" onclick="openOutfitModal('${outfit.id_outfit}')">
                     <img src="/outfits/photoOutfit/${outfit.id_outfit}" alt="Outfit" style="height: 350px; object-fit: contain;>
                        <div class="card-body">
                            <h5 class="card-text fw-bold"> ${outfit.nombre}</h5>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });
        container.style.display = 'flex';
        document.getElementById('noResultOutfitSearchMessage').style.display = 'none';
    }
}

});