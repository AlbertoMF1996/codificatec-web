document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});


/* =========================================================
   HEADER
   ========================================================= */

const header = document.querySelector('[data-header]');

if (header) {
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });
}


/* =========================================================
   BOTÓN DE DESCARGA FLOTANTE
   ========================================================= */

const topDownloadButton = document.querySelector('#mainDownloadButton');
const bottomDownloadButton = document.querySelector('#bottomDownloadButton');
const stickyDownload = document.querySelector('#stickyDownload');

if (topDownloadButton && bottomDownloadButton && stickyDownload) {
  let isTopVisible = true;
  let isBottomVisible = false;

  const updateSticky = () => {
    stickyDownload.classList.toggle(
      'is-visible',
      !isTopVisible && !isBottomVisible
    );
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === topDownloadButton) {
        isTopVisible = entry.isIntersecting;
      }

      if (entry.target === bottomDownloadButton) {
        isBottomVisible = entry.isIntersecting;
      }
    });

    updateSticky();
  }, {
    threshold: 0.2
  });

  observer.observe(topDownloadButton);
  observer.observe(bottomDownloadButton);
}


/* =========================================================
   CARRUSEL VERIFACTU
   ========================================================= */

document.querySelectorAll('[data-vf-carousel]').forEach((carousel) => {
  const viewport = carousel.querySelector(
    '[data-vf-carousel-viewport]'
  );

  const track = carousel.querySelector(
    '[data-vf-carousel-track]'
  );

  const prevButton = carousel.querySelector(
    '[data-vf-carousel-prev]'
  );

  const nextButton = carousel.querySelector(
    '[data-vf-carousel-next]'
  );


  if (!viewport || !track) {
    return;
  }


  const originalCards = Array.from(track.children);

  if (originalCards.length === 0) {
    return;
  }


  /* =======================================================
     DUPLICAR TARJETAS PARA CREAR EL BUCLE
     ======================================================= */

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);

    clone.setAttribute('aria-hidden', 'true');

    track.appendChild(clone);
  });


  let isPaused = false;
  let lastFrameTime = null;

  /*
   * Velocidad del movimiento automático.
   *
   * Puedes cambiar este valor:
   *
   * 40  = lento
   * 52  = velocidad actual
   * 60  = algo más rápido
   * 70  = rápido
   */
  const pixelsPerSecond = 52;


  /* =======================================================
     MEDIDAS
     ======================================================= */

  const getLoopWidth = () => {
    const firstCard = track.children[0];
    const firstClone = track.children[originalCards.length];

    if (!firstCard || !firstClone) {
      return 0;
    }

    return firstClone.offsetLeft - firstCard.offsetLeft;
  };


  const getCardStep = () => {
    const firstCard = track.children[0];
    const secondCard = track.children[1];

    if (!firstCard) {
      return 300;
    }

    if (!secondCard) {
      return firstCard.offsetWidth;
    }

    return secondCard.offsetLeft - firstCard.offsetLeft;
  };


  /* =======================================================
     NORMALIZACIÓN DEL BUCLE
     ======================================================= */

  const normalizePosition = () => {
    const loopWidth = getLoopWidth();

    if (loopWidth <= 0) {
      return;
    }

    while (viewport.scrollLeft >= loopWidth) {
      viewport.scrollLeft -= loopWidth;
    }

    while (viewport.scrollLeft < 0) {
      viewport.scrollLeft += loopWidth;
    }
  };


  /* =======================================================
     MOVIMIENTO AUTOMÁTICO
     ======================================================= */

  const animate = (time) => {
    if (lastFrameTime === null) {
      lastFrameTime = time;
    }

    const delta = time - lastFrameTime;

    lastFrameTime = time;


    if (!isPaused && !document.hidden) {
      viewport.scrollLeft += pixelsPerSecond * (delta / 1000);

      normalizePosition();
    }


    requestAnimationFrame(animate);
  };


  /* =======================================================
     PAUSA AL PONER EL RATÓN ENCIMA
     ======================================================= */

  carousel.addEventListener('mouseenter', () => {
    isPaused = true;
  });


  carousel.addEventListener('mouseleave', () => {
    isPaused = false;
  });


  /* =======================================================
     PAUSA POR TECLADO
     ======================================================= */

  carousel.addEventListener('focusin', () => {
    isPaused = true;
  });


  carousel.addEventListener('focusout', () => {
    isPaused = false;
  });


  /* =======================================================
     INTERACCIÓN TÁCTIL / RATÓN
     ======================================================= */

  viewport.addEventListener('pointerdown', () => {
    isPaused = true;
  });


  viewport.addEventListener('pointerup', () => {
    isPaused = false;
  });


  viewport.addEventListener('pointercancel', () => {
    isPaused = false;
  });


  /* =======================================================
     MOVIMIENTO MANUAL
     ======================================================= */

  const moveCarousel = (direction) => {
    const step = getCardStep();
    const loopWidth = getLoopWidth();

    if (loopWidth <= 0) {
      return;
    }


    /*
     * Si estamos ya sobre la segunda copia,
     * volvemos instantáneamente a la equivalente
     * de la primera copia.
     */
    if (viewport.scrollLeft >= loopWidth) {
      viewport.scrollLeft -= loopWidth;
    }


    /*
     * Si queremos ir hacia la izquierda estando
     * cerca del inicio, saltamos primero a la
     * segunda copia equivalente.
     */
    if (
      direction < 0 &&
      viewport.scrollLeft < step
    ) {
      viewport.scrollLeft += loopWidth;
    }


    viewport.scrollBy({
      left: step * direction,
      behavior: 'smooth'
    });
  };


  /* =======================================================
     BOTÓN DERECHA
     ======================================================= */

  nextButton?.addEventListener('click', () => {
    isPaused = true;

    moveCarousel(1);
  });


  /* =======================================================
     BOTÓN IZQUIERDA
     ======================================================= */

  prevButton?.addEventListener('click', () => {
    isPaused = true;

    moveCarousel(-1);
  });


  /* =======================================================
     MANTENER EL BUCLE TAMBIÉN EN MOVIMIENTO MANUAL
     ======================================================= */

  let normalizeTimeout = null;

  viewport.addEventListener('scroll', () => {
    clearTimeout(normalizeTimeout);

    /*
     * Esperamos a que termine el scroll suave antes
     * de normalizar la posición.
     *
     * Así evitamos cortar la animación de los botones.
     */
    normalizeTimeout = setTimeout(() => {
      const loopWidth = getLoopWidth();

      if (loopWidth <= 0) {
        return;
      }

      if (viewport.scrollLeft >= loopWidth) {
        viewport.scrollLeft -= loopWidth;
      }
    }, 120);
  }, {
    passive: true
  });


  /* =======================================================
     REANUDAR DESPUÉS DE USAR LAS FLECHAS
     ======================================================= */

  let resumeTimeout = null;

  const scheduleResume = () => {
    clearTimeout(resumeTimeout);

    resumeTimeout = setTimeout(() => {
      /*
       * Solo reanudamos si el ratón ya no está
       * encima del carrusel.
       */
      if (!carousel.matches(':hover')) {
        isPaused = false;
      }
    }, 900);
  };


  nextButton?.addEventListener('click', () => {
    scheduleResume();
  });


  prevButton?.addEventListener('click', () => {
    scheduleResume();
  });


  /* =======================================================
     ACCESIBILIDAD: REDUCIR MOVIMIENTO
     ======================================================= */

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );


  if (!reducedMotion.matches) {
    requestAnimationFrame(animate);
  }
});