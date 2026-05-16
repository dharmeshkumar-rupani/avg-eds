/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-sidebar variant.
 * Base block: tabs
 * Source: https://www.avg.com/en/signal
 * Selectors: .sidebar-homepage .sidebar-category-tab, #sidebar .sidebar-category-tab
 * Generated: 2026-05-13
 *
 * Source structure:
 *   .sidebar-category-tab
 *     .selector
 *       .item.{category} (repeated: security, privacy, performance)
 *         .icon > img (category icon, SVG data URI)
 *         span.category-headline (category label text)
 *     .articles-wrapper
 *       .articles.{category} (repeated, matching tab items)
 *         ul > li > a (article links with href and title text)
 *
 * Target table: One row per tab category.
 *   Each row has one cell containing:
 *     - Category label as a heading
 *     - List of article links as a ul
 *
 * The tab label is derived from the .item category class name and
 * matched to the corresponding .articles panel by that same class.
 */
export default function parse(element, { document }) {
  // Extract tab items from the selector area
  const tabItems = element.querySelectorAll('.selector .item');

  // Extract article panels from the articles wrapper
  const articlePanels = element.querySelectorAll('.articles-wrapper .articles');

  const cells = [];

  tabItems.forEach((item) => {
    // Get the category label from span.category-headline
    const headlineEl = item.querySelector('span.category-headline, .category-headline');
    const label = headlineEl ? headlineEl.textContent.trim() : '';

    if (!label) return;

    // Determine the category class to match the corresponding articles panel
    // The item has classes like "item item-1 security active" - extract the category name
    const itemClasses = Array.from(item.classList);
    const categoryClass = itemClasses.find(
      (cls) => cls !== 'item' && !cls.startsWith('item-') && cls !== 'active',
    );

    // Find the matching articles panel by category class
    let matchingPanel = null;
    if (categoryClass) {
      matchingPanel = element.querySelector(`.articles-wrapper .articles.${categoryClass}`);
    }

    // If no class-based match, fall back to index-based matching
    if (!matchingPanel) {
      const idx = Array.from(tabItems).indexOf(item);
      if (idx < articlePanels.length) {
        matchingPanel = articlePanels[idx];
      }
    }

    // Build the cell content: heading label + article links list
    const contentCell = [];

    // Create heading for the tab label
    const heading = document.createElement('h3');
    heading.textContent = label;
    contentCell.push(heading);

    // Extract article links from the matching panel
    if (matchingPanel) {
      const links = matchingPanel.querySelectorAll('ul li a');
      if (links.length > 0) {
        const ul = document.createElement('ul');
        links.forEach((link) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.getAttribute('href') || '';
          a.textContent = link.textContent.trim();
          li.appendChild(a);
          ul.appendChild(li);
        });
        contentCell.push(ul);
      }
    }

    // Each row is a single cell containing the tab label heading + article links
    cells.push(contentCell);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-sidebar', cells });
  element.replaceWith(block);
}
