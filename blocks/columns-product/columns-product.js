function isIconOnlyParagraph(p) {
  if (p.children.length !== 1) return false;
  if (p.firstElementChild.tagName !== 'PICTURE') return false;
  return p.textContent.trim() === '';
}

function isEmptyParagraph(p) {
  return p.children.length === 0 && p.textContent.trim() === '';
}

function consolidatePlatformIcons(col) {
  const directParagraphs = [...col.children].filter((el) => el.tagName === 'P');
  const iconParagraphs = directParagraphs.filter(isIconOnlyParagraph);
  if (iconParagraphs.length < 2) return;

  const target = iconParagraphs[0];
  target.classList.add('columns-product-platforms');
  for (let i = 1; i < iconParagraphs.length; i += 1) {
    const p = iconParagraphs[i];
    while (p.firstChild) target.appendChild(p.firstChild);
    p.remove();
  }

  [...col.children]
    .filter((el) => el.tagName === 'P' && isEmptyParagraph(el))
    .forEach((p) => p.remove());
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-product-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-product-img-col');
        }
      }

      if (!col.classList.contains('columns-product-img-col')) {
        consolidatePlatformIcons(col);
      }
    });
  });
}
