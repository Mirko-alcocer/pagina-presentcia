class InfiniteCarousel {
    constructor() {
        this.grid = document.getElementById('serviciosGrid');
        this.indicators = document.querySelectorAll('.indicator');
        this.cards = [...document.querySelectorAll('.servicio-card')];
        this.currentSlide = 0;
        this.totalSlides = 6;
        this.slideInterval = 4000;
        this.carouselTimer = null;
        this.isTransitioning = false;
        this.cardWidth = 340;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.updateCardWidth();
        this.createInfiniteLoop();
        this.setupIndicators();
        this.startAutoSlide();
        this.setupHoverPause();
        this.setupResize();
    }
    
    createInfiniteLoop() {
        // Solo crear el bucle infinito si no es móvil
        if (!this.isMobile) {
            const firstThreeCards = this.cards.slice(0, 3);
            firstThreeCards.forEach(card => {
                const clone = card.cloneNode(true);
                this.grid.appendChild(clone);
            });
        }
    }

    updateCardWidth() {
        const viewportWidth = window.innerWidth;
        this.isMobile = viewportWidth <= 768;
        
        if (this.isMobile) {
            this.cardWidth = viewportWidth - 60;
        } else if (viewportWidth <= 1200) {
            this.cardWidth = 295;
        } else {
            this.cardWidth = 340;
        }
    }
    
    
    setupIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToSlide(index);
                }
            });
        });
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSlide = slideIndex;
        
        const translateX = -this.cardWidth * this.currentSlide;
        this.grid.style.transform = `translateX(${translateX}px)`;
        this.updateIndicators();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
        
        this.restartAutoSlide();
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        if (this.isMobile) {
            // En móvil, simplemente avanzar sin bucle infinito
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        } else {
            // En desktop con bucle infinito
            this.currentSlide++;
        }
        
        const translateX = -this.cardWidth * this.currentSlide;
        this.grid.style.transform = `translateX(${translateX}px)`;
        
        // Solo hacer el reset si estamos en desktop y llegamos al final
        if (!this.isMobile && this.currentSlide >= this.totalSlides) {
            setTimeout(() => {
                this.grid.style.transition = 'none';
                this.currentSlide = 0;
                this.grid.style.transform = 'translateX(0px)';
                
                setTimeout(() => {
                    this.grid.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    this.isTransitioning = false;
                }, 50);
            }, 800);
        } else {
            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }
        
        this.updateIndicators();
    }
    
    updateIndicators() {
        const activeIndex = this.currentSlide >= this.totalSlides ? 0 : this.currentSlide;
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
    }
    
    startAutoSlide() {
        this.carouselTimer = setInterval(() => {
            this.nextSlide();
        }, this.slideInterval);
    }
    
    stopAutoSlide() {
        if (this.carouselTimer) {
            clearInterval(this.carouselTimer);
            this.carouselTimer = null;
        }
    }
    
    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
    
    setupHoverPause() {
        const container = document.querySelector('.servicios-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                this.stopAutoSlide();
            });
            
            container.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
    }
    
    setupResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.updateCardWidth();
                
                // Si cambiamos entre móvil y desktop, recrear el carrusel
                if (wasMobile !== this.isMobile) {
                    this.recreateCarousel();
                } else {
                    this.goToSlide(this.currentSlide);
                }
            }, 100);
        });
    }
    
    recreateCarousel() {
        // Limpiar clones existentes
        const clones = this.grid.querySelectorAll('.servicio-card:nth-child(n+7)');
        clones.forEach(clone => clone.remove());
        
        // Resetear posición
        this.currentSlide = 0;
        this.grid.style.transform = 'translateX(0px)';
        
        // Recrear bucle infinito si es necesario
        this.createInfiniteLoop();
        this.updateIndicators();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new InfiniteCarousel();
});

