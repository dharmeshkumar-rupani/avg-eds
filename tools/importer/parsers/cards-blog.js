/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-blog variant.
 * Base block: cards
 * Source: https://www.avg.com/en/signal
 * Selector: #security .hub-wrap, #privacy .hub-wrap, #performance .hub-wrap
 * Generated: 2026-05-13
 *
 * Source structure:
 *   .hub-wrap
 *     .hub-headline
 *       a > h3 (category name, e.g. "Viruses")
 *       .line-separator
 *     .card.card-x-small (repeated, typically 2 per category)
 *       .img-wrapper > a > img.main-feature-image (article thumbnail)
 *       .copy-wrapper > p > a.no-mobile (article title link - desktop)
 *                        > a.no-desktop-inline (article title link - mobile, truncated)
 *     .button-wrapper > a.btn (category "more" link)
 *
 * Target table: One row per card article, two columns:
 *   Column 1: article thumbnail image
 *   Column 2: article title as a linked paragraph
 *
 * Notes:
 *   - Source has duplicate links per article (desktop/mobile variants);
 *     we take the .no-mobile (desktop) version for the full title text.
 *   - The .hub-headline category heading and .button-wrapper "more" link
 *     are section default content (not part of the block table).
 */
export default function parse(element, { document }) {
  // Select all article cards within the hub-wrap
  const cards = element.querySelectorAll(':scope > .card, :scope .card.card-x-small');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Article thumbnail image
    const img = card.querySelector('.img-wrapper img, img.main-feature-image');

    // Column 2: Article title as a linked text
    // Prefer the desktop link (.no-mobile) for full title text;
    // fall back to .no-desktop-inline or any anchor in copy-wrapper
    const contentCell = [];
    const titleLink = card.querySelector('.copy-wrapper a.no-mobile')
      || card.querySelector('.copy-wrapper a.no-desktop-inline')
      || card.querySelector('.copy-wrapper a');

    if (titleLink) {
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = titleLink.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      contentCell.push(p);
    }

    // Build row: [image cell, content cell]
    cells.push([img || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-blog', cells });
  element.replaceWith(block);
}
