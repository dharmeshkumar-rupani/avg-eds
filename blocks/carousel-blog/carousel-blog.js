function getVisibleCount(viewport, cards) {
  if (!cards.length) return 1;
  return Math.round(viewport.offsetWidth / cards[0].offsetWidth) || 1;
}

function getPageCount(cards, visibleCount) {
  return Math.max(1, Math.ceil((cards.length - visibleCount) / visibleCount) + 1);
}

function updateSlides(block, pageIndex) {
  const track = block.querySelector('.carousel-track');
  const viewport = block.querySelector('.carousel-viewport');
  if (!track || !viewport) return;

  const cards = [...track.querySelectorAll('.carousel-card')];
  if (!cards.length) return;

  const visibleCount = getVisibleCount(viewport, cards);
  const cardWidth = cards[0].offsetWidth;
  const maxIndex = Math.max(0, cards.length - visibleCount);
  const slideIndex = Math.min(pageIndex * visibleCount, maxIndex);

  track.style.transform = `translateX(-${slideIndex * cardWidth}px)`;

  const prevBtn = block.querySelector('.carousel-prev');
  const nextBtn = block.querySelector('.carousel-next');
  if (prevBtn) prevBtn.disabled = pageIndex <= 0;
  if (nextBtn) nextBtn.disabled = slideIndex >= maxIndex;

  const dots = block.querySelectorAll('.carousel-dots button');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === pageIndex));
}

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nav.append(prevBtn, nextBtn);

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  const track = document.createElement('div');
  track.className = 'carousel-track';

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    const imgCell = row.children[0];
    const textCell = row.children[1];
    if (imgCell) card.append(imgCell);
    if (textCell) card.append(textCell);
    track.append(card);
  });

  viewport.append(track);

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  block.append(nav, viewport, dotsContainer);

  let activePage = 0;

  function buildDots() {
    const cards = [...track.querySelectorAll('.carousel-card')];
    const visibleCount = getVisibleCount(viewport, cards);
    const pageCount = getPageCount(cards, visibleCount);

    dotsContainer.textContent = '';
    Array.from({ length: pageCount }, (_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      if (i === activePage) dot.classList.add('active');
      dot.addEventListener('click', () => {
        activePage = i;
        updateSlides(block, activePage);
      });
      dotsContainer.append(dot);
      return dot;
    });
  }

  prevBtn.addEventListener('click', () => {
    if (activePage > 0) {
      activePage -= 1;
      updateSlides(block, activePage);
    }
  });

  nextBtn.addEventListener('click', () => {
    const cards = [...track.querySelectorAll('.carousel-card')];
    const visibleCount = getVisibleCount(viewport, cards);
    const pageCount = getPageCount(cards, visibleCount);
    if (activePage < pageCount - 1) {
      activePage += 1;
      updateSlides(block, activePage);
    }
  });

  requestAnimationFrame(() => {
    buildDots();
    updateSlides(block, 0);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      activePage = 0;
      buildDots();
      updateSlides(block, 0);
    }, 200);
  });
}
