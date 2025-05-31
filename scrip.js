document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.cards-container');

    if (cardContainer) { // Verificar que el contenedor de tarjetas exista
        cardContainer.addEventListener('click', (event) => {
            // Encuentra el .card-header más cercano al elemento clickeado
            const cardHeader = event.target.closest('.card-header');

            if (cardHeader) {
                const card = cardHeader.closest('.info-card');
                if (card) {
                    // Alternar la clase 'expanded' en la tarjeta clickeada
                    const isExpanded = card.classList.contains('expanded');

                    // Opcional: cerrar otras tarjetas al abrir una (ESTA ES LA LÓGICA ORIGINAL DEL USUARIO)
                    // Si se quiere que solo una tarjeta esté abierta a la vez:
                    const allCards = cardContainer.querySelectorAll('.info-card');
                    allCards.forEach(otherCard => {
                        if (otherCard !== card && otherCard.classList.contains('expanded')) {
                            otherCard.classList.remove('expanded');
                        }
                    });
                    
                    // Alterna la tarjeta actual DESPUÉS de cerrar las otras si es necesario
                    card.classList.toggle('expanded');
                }
            }
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.info-card');

    if (filterBtns.length > 0 && cards.length > 0) { // Verificar que existan botones y tarjetas
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover clase activa de todos los botones
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                
                // Filtrar tarjetas
                cards.forEach(card => {
                    // Asegurarse de que todas las tarjetas estén colapsadas antes de filtrar
                    // si no se quiere que mantengan su estado expandido entre filtros.
                    // card.classList.remove('expanded'); // Descomentar si se desea este comportamiento

                    if(category === 'todas') {
                        card.style.display = 'block';
                    } else {
                        card.style.display = card.dataset.category === category ? 'block' : 'none';
                    }
                });
            });
        });
    }
});

// La función runSimulation está aquí como se solicitó,
// pero no tendrá efecto visual ya que los elementos HTML
// (piCanvas, puntos, dentro, piEst, error) no están en esta página.
function runSimulation() {
    const canvas = document.getElementById("piCanvas");
    // Verificar si el canvas existe antes de continuar
    if (!canvas) {
        console.warn("Elemento canvas 'piCanvas' no encontrado. La simulación no se ejecutará.");
        return;
    }
    const ctx = canvas.getContext("2d");
    const puntosTotalesInput = document.getElementById("puntos");
    
    // Verificar si el input de puntos existe
    if (!puntosTotalesInput) {
        console.warn("Elemento input 'puntos' no encontrado. La simulación no se ejecutará.");
        return;
    }
    const puntosTotales = parseInt(puntosTotalesInput.value);
    let puntosDentro = 0;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar cuadrado y círculo
    ctx.strokeStyle = "#53a8b6"; // Este color no es de la paleta nueva, considerar cambiarlo si se usa.
    ctx.lineWidth = 2; 
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    const radio = Math.min(canvas.width, canvas.height) / 2;
    ctx.arc(canvas.width/2, canvas.height/2, radio, 0, 2 * Math.PI);
    ctx.stroke();

    for (let i = 0; i < puntosTotales; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        const centroX = canvas.width / 2;
        const centroY = canvas.height / 2;
        const distancia = Math.sqrt((x - centroX)**2 + (y - centroY)**2);
        
        if (distancia <= radio) {
            ctx.fillStyle = "#6ee7b7"; // Este color no es de la paleta nueva
            puntosDentro++;
        } else {
            ctx.fillStyle = "#fca5a5"; // Este color no es de la paleta nueva
        }
        
        ctx.fillRect(x - 1, y - 1, 3, 3); 
    }

    const piEstimado = 4 * (puntosDentro / puntosTotales);
    const error = ((Math.abs(Math.PI - piEstimado) / Math.PI) * 100).toFixed(2);

    const dentroEl = document.getElementById("dentro");
    const piEstEl = document.getElementById("piEst");
    const errorEl = document.getElementById("error");

    if (dentroEl) dentroEl.textContent = puntosDentro;
    if (piEstEl) piEstEl.textContent = piEstimado.toFixed(4);
    if (errorEl) errorEl.textContent = `${error}%`;
}