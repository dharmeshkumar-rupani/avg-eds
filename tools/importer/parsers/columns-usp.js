/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-usp
 * Base block: columns
 * Source selector: .section-usp-stripe .usp-stripe
 * Generated: 2026-05-13
 *
 * Extracts USP stripe items (icon + text) into a single-row Columns block
 * where each column represents one USP item.
 * Source structure: .usp-stripe > .usp-stripe-item (img + span) x4
 */
export default function parse(element, { document }) {
  // Extract all USP items from the stripe
  const uspItems = element.querySelectorAll('.usp-stripe-item, [class*="usp-stripe-item"]');

  // Build one cell per USP item, each containing the icon image and descriptive text
  const row = [];
  uspItems.forEach((item) => {
    const cellContent = [];

    // Extract icon image
    const img = item.querySelector('img');
    if (img) {
      cellContent.push(img);
    }

    // Extract descriptive text (span or fallback to any text node container)
    const text = item.querySelector('span, p, .usp-text, [class*="text"]');
    if (text) {
      cellContent.push(text);
    }

    if (cellContent.length > 0) {
      row.push(cellContent);
    }
  });

  const cells = [];

  // Single row with all USP items as columns
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-usp', cells });
  element.replaceWith(block);
}
