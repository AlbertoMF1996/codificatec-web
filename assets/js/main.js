document.querySelectorAll('[data-year]').forEach((node) => {
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

const topDownloadButton = document.querySelector('#mainDownloadButton');
const bottomDownloadButton = document.querySelector('#bottomDownloadButton');
const stickyDownload = document.querySelector('#stickyDownload');

if (topDownloadButton && bottomDownloadButton && stickyDownload) {
  let isTopVisible = true;
  let isBottomVisible = false;

  const updateSticky = () => {
    stickyDownload.classList.toggle('is-visible', !isTopVisible && !isBottomVisible);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === topDownloadButton) isTopVisible = entry.isIntersecting;
      if (entry.target === bottomDownloadButton) isBottomVisible = entry.isIntersecting;
    });

    updateSticky();
  }, { threshold: 0.2 });

  observer.observe(topDownloadButton);
  observer.observe(bottomDownloadButton);
}
