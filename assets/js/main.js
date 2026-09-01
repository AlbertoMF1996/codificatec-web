const yearNodes = document.querySelectorAll('[data-year]');
yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const header = document.querySelector('[data-header]');
if (header) {
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

const screenshots = [
  {
    title: 'Panel de facturas',
    src: 'assets/img/screenshots/facturas.webp',
    alt: 'Panel de facturas de FacturApp'
  },
  {
    title: 'Clientes y empresas',
    src: 'assets/img/screenshots/clientes.webp',
    alt: 'Gestión de clientes y empresas en FacturApp'
  },
  {
    title: 'Vista previa PDF',
    src: 'assets/img/screenshots/pdf.webp',
    alt: 'Vista previa de factura PDF en FacturApp'
  },
];

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');
const lightboxPrev = document.querySelector('[data-lightbox-prev]');
const lightboxNext = document.querySelector('[data-lightbox-next]');
const screenButtons = document.querySelectorAll('[data-lightbox-index]');
let activeScreenshotIndex = 0;

const renderLightbox = () => {
  const current = screenshots[activeScreenshotIndex];
  if (!current || !lightboxImage || !lightboxCaption) return;

  lightboxImage.src = current.src;
  lightboxImage.alt = current.alt;
  lightboxCaption.textContent = current.title;
};

const openLightbox = (index) => {
  if (!lightbox) return;
  activeScreenshotIndex = index;
  renderLightbox();
  lightbox.hidden = false;
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const moveLightbox = (direction) => {
  activeScreenshotIndex = (activeScreenshotIndex + direction + screenshots.length) % screenshots.length;
  renderLightbox();
};

screenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.getAttribute('data-lightbox-index'));
    openLightbox(Number.isNaN(index) ? 0 : index);
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', () => moveLightbox(-1));
lightboxNext?.addEventListener('click', () => moveLightbox(1));

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox || lightbox.hidden) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

const topDownloadButton = document.querySelector('#mainDownloadButton');
const bottomDownloadButton = document.querySelector('#bottomDownloadButton');
const stickyDownload = document.querySelector('#stickyDownload');

let isTopVisible = true;
let isBottomVisible = false;

function updateSticky() {
  const shouldShowSticky = !isTopVisible && !isBottomVisible;
  stickyDownload.classList.toggle('is-visible', shouldShowSticky);
}

if (topDownloadButton && bottomDownloadButton && stickyDownload) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === topDownloadButton) {
          isTopVisible = entry.isIntersecting;
        }

        if (entry.target === bottomDownloadButton) {
          isBottomVisible = entry.isIntersecting;
        }
      });

      updateSticky();
    },
    { threshold: 0.2 }
  );

  observer.observe(topDownloadButton);
  observer.observe(bottomDownloadButton);
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const summary = item.querySelector("summary");
  const answer = item.querySelector(".faq-answer");

  if (!summary || !answer) {
    return;
  }

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    const isOpen = item.open;

    if (isOpen) {
      const startHeight = answer.scrollHeight;

      answer.style.height = `${startHeight}px`;

      requestAnimationFrame(() => {
        answer.style.height = "0px";
        answer.style.opacity = "0";
        answer.style.transform = "translateY(-8px)";
      });

      const onCloseEnd = (transitionEvent) => {
        if (transitionEvent.propertyName !== "height") {
          return;
        }

        answer.removeEventListener("transitionend", onCloseEnd);

        item.open = false;
        answer.style.height = "";
        answer.style.opacity = "";
        answer.style.transform = "";
      };

      answer.addEventListener("transitionend", onCloseEnd);

      return;
    }

    item.open = true;
    item.classList.add("is-opening");

    answer.style.height = "0px";

    requestAnimationFrame(() => {
      answer.style.height = `${answer.scrollHeight}px`;
      answer.style.opacity = "1";
      answer.style.transform = "translateY(0)";
    });

    const onOpenEnd = (transitionEvent) => {
      if (transitionEvent.propertyName !== "height") {
        return;
      }

      answer.removeEventListener("transitionend", onOpenEnd);

      answer.style.height = "auto";
      item.classList.remove("is-opening");
    };

    answer.addEventListener("transitionend", onOpenEnd);
  });
});