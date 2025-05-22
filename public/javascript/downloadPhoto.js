document.getElementById('descargarOutfit').addEventListener('click', function (e) {
    const img = document.getElementById('modalImage');
    const src = img.src;
    if (!src) { //si no hay imagen no se puede descargar
      e.preventDefault(); 
      return;
    }  
    this.href = src;
    const nombre = 'prenda-' + (src.split('/').pop().split('?')[0] || 'imagenPrenda.jpg');
    this.setAttribute('download', nombre);
  });
  