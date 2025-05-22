  document.addEventListener('DOMContentLoaded', function () {
      //GRAFICO DE BARRAS
          var tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipElements.forEach(function (element) {
              new bootstrap.Tooltip(element);
            });
            
            const preferenciasData = document.getElementById('preferenciasData');
            const labels = JSON.parse(preferenciasData.getAttribute('data-labels'));
            const values = JSON.parse(preferenciasData.getAttribute('data-values'));
        
            const ctx = document.getElementById('outfitTipoChart').getContext('2d');
            
            const chartData = {
                labels: labels, 
                datasets: [{
                    label: 'Preferencias de Usuarios Seguidos',
                    data: values, 
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            };
            const options = {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            };
    
            new Chart(ctx, {
                type: 'bar', // Tipo de gráfico
                data: chartData,
                options: options
            });
        });
          
          //CALENDARIO
            const fechasData = document.getElementById('fechasData').getAttribute('data-fechas');
            const fechasPrendas = JSON.parse(fechasData); 

                const calendarEl = document.getElementById('calendar');
                const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'es',
                height: 420,
                headerToolbar: {
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
                },
                events: fechasPrendas.map(p => ({
                title: '👕',
                start: p.fecha,
                extendedProps: {
                  id_prenda: p.id_prenda
                },
                color: '#9A8C98'
                })),
                eventClick: function(info) {
                info.jsEvent.preventDefault(); 
                const prendaId = info.event.extendedProps.id_prenda;
                openPrendaModal(prendaId); 
                }
                });
                calendar.render();
    
      
        //DIAGRAMA DONUT
           // Apartado de colores
            const colores = JSON.parse(document.getElementById('coloresData').getAttribute('data-colores'));
            const coloresLimitados = colores.slice(0, 5);
            new Chart(document.getElementById('colorChart'), {
            type: 'doughnut',
            data: {
              labels: coloresLimitados.map(c => c.color),
              datasets: [{
                data: coloresLimitados.map(c => c.cantidad),
                backgroundColor: coloresLimitados.map(c => c.hex.startsWith('#') ? c.hex : '#' + c.hex),
                borderColor: colores.map(() => '#000'), 
                borderWidth: 0.3 
              }]
            },
            options: {
              plugins: { legend: { position: 'bottom' } }
            }
            });

            //Apartado de estilos
            const estilos = JSON.parse(document.getElementById('estilosData').getAttribute('data-estilos'));
            // Limitar a 5 colores
            const estilosLimitados = estilos.slice(0,4);
            new Chart(document.getElementById('estiloChart'), {
              type: 'doughnut',
              data: {
                labels: estilosLimitados.map(e => e.nombre),
                datasets: [{
                  data: estilosLimitados.map(e => e.cantidad),
                  backgroundColor: ['#f6c90e', '#1982c4', '#6a4c93', '#ff6b6b'],
                  borderColor: colores.map(() => '#000'), 
                  borderWidth: 0.3 
                }]
              },
              options: {
                plugins: { legend: { position: 'bottom' } }
              }
            });

          //Apartado de estaciones
          const estaciones = JSON.parse(document.getElementById('estacionesData').getAttribute('data-estaciones'));
          new Chart(document.getElementById('estacionChart'), {
            type: 'doughnut',
            data: {
              labels: estaciones.map(e => e.nombre),
              datasets: [{
                data: estaciones.map(e => e.cantidad),
                backgroundColor: ['#ff595e', '#8ac926', '#1982c4', '#6a4c93'],
                borderColor: colores.map(() => '#000'),
                borderWidth: 0.3 
              }]
            },
            options: {
              plugins: { legend: { position: 'bottom' } }
            }
          });