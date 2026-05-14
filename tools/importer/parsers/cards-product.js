/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product variant.
 * Base block: cards
 * Source: https://www.avg.com/en-ww/homepage#mac
 * Selector: .included .included-cards-wrapper
 * Generated: 2026-05-13
 *
 * Source structure:
 *   .included-cards-wrapper
 *     .included-card (repeated)
 *       img (product icon)
 *       .included-card-body
 *         .h5 (product title)
 *         .body-3 (product description)
 *       a.link (CTA - "Learn more"; some cards have multiple platform-specific links)
 *
 * Target table: One row per card, two columns:
 *   Column 1: product icon image
 *   Column 2: heading (h5) + description (p) + CTA link
 */
export default function parse(element, { document }) {
  // Select all individual product cards within the wrapper
  const cards = element.querySelectorAll(':scope > .included-card');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Product icon image
    const img = card.querySelector(':scope > img');

    // Column 2: Title + description + CTA link
    const contentCell = [];

    // Extract title from .included-card-body .h5
    const titleEl = card.querySelector('.included-card-body .h5');
    if (titleEl) {
      // Convert the .h5 div to an actual h5 heading for semantic correctness
      const h5 = document.createElement('h5');
      h5.textContent = titleEl.textContent;
      contentCell.push(h5);
    }

    // Extract description from .included-card-body .body-3
    const descEl = card.querySelector('.included-card-body .body-3');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent;
      contentCell.push(p);
    }

    // Extract CTA link - take the first link per card
    // Some cards have multiple platform-specific links (.js-pc, .js-mac, etc.)
    // We take the first one as the primary CTA for import
    const ctaLink = card.querySelector(':scope > a.link');
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href');
      a.textContent = ctaLink.textContent.trim();
      contentCell.push(a);
    }

    // Build row: [image cell, content cell]
    cells.push([img || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
