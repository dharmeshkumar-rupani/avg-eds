/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-awards
 * Base block: columns
 * Source selector: #awards-card .awards-img
 * Generated: 2026-05-13
 *
 * Source structure:
 *   div.awards-img
 *     img.d-sm-none (decorative, skip)
 *     div.awards-icon (repeated 3x)
 *       img (award badge icon)
 *       div.body-2 (year + bold award name)
 *     img.d-sm-none (decorative, skip)
 *
 * Target: columns block with one row, one cell per award icon.
 * Each cell contains the award image and the award description text.
 */
export default function parse(element, { document }) {
  // Extract all award icon containers
  const awardIcons = element.querySelectorAll('.awards-icon');

  // Build one cell per award icon
  const cells = [];
  const row = [];

  awardIcons.forEach((icon) => {
    const cellContainer = document.createElement('div');

    // Extract the award badge image
    const img = icon.querySelector('img');
    if (img) {
      cellContainer.appendChild(img.cloneNode(true));
    }

    // Extract the award description text (e.g., "2024\nTop-Rated Product")
    const description = icon.querySelector('.body-2');
    if (description) {
      cellContainer.appendChild(description.cloneNode(true));
    }

    row.push(cellContainer);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-awards', cells });
  element.replaceWith(block);
}
