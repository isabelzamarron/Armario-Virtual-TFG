
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('searchPrenda').addEventListener('input', (event) => {
        const query = event.target.value.trim();
        const searchContainer = document.getElementById('searchContainer');
        const listarPrendasContainer = document.getElementById('listarPrendasContainer');
        const noResultSearchMessage = document.getElementById('noResultSearchMessage');

        // cancela busqueda cuando input vacio
        if (!query) {
            listarPrendasContainer.style.display = 'block';
            searchContainer.style.display = 'none';
            noResultSearchMessage.style.display = 'none';
            searchContainer.innerHTML = ''; 
            return;
        }

        listarPrendasContainer.style.display = 'none';
        //solicitud de busqueda
        fetch(`/prendas/buscar?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(prendasBusqueda => {
                if (!query) {
                    return;
                }
                actualizarPrendas(prendasBusqueda);
            })
            .catch(error => {
                console.error('Error en la búsqueda:', error);
                 alert('Hubo un error en la búsqueda. Por favor, inténtalo de nuevo.');
                searchContainer.style.display = 'none';
                noResultSearchMessage.style.display = 'block';
            });
    });

//actualizar contenedor de prendas
function actualizarPrendas(prendas) {
    const container = document.getElementById('searchContainer');
    container.innerHTML = ''; 

    if (prendas.length === 0) {
        container.style.display = 'none';
        document.getElementById('noResultSearchMessage').style.display = 'block';
    } else {
        prendas.forEach(prenda => {
            const tarjetaPrenda = `
                <div class="col-md-2">
                        <div class="card mb-4 shadow-sm d-flex flex-column justify-content-center align-items-center w-100 h-100" onclick="openPrendaModal('${prenda.id_prenda}')">
                     <img src="/prendas/photoPrenda/${prenda.id_prenda}" class="card-img-top" alt="${prenda.id_prenda}">
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', tarjetaPrenda);
        });
        container.style.display = 'flex';
        document.getElementById('noResultSearchMessage').style.display = 'none';
    }
}
});