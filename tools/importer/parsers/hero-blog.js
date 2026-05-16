/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-blog variant.
 * Base block: hero
 * Source: https://www.avg.com/en/signal
 * Selector: .hp-hero-banner.hero-banner
 * Generated: 2026-05-13
 *
 * Source HTML structure:
 *   div.hp-hero-banner.hero-banner
 *     div.container
 *       img (background/hero image)
 *       div.row
 *         div.hero-wrapper
 *           h1 (blog title)
 *           p.h1sub (subtitle/description)
 *
 * Target table structure:
 *   Row 1: Background image
 *   Row 2: Heading + description (content cell)
 */
export default function parse(element, { document }) {
  // Extract background/hero image from container
  const bgImage = element.querySelector('.container > img, .container img');

  // Extract heading - validated against source: h1 inside .hero-wrapper
  const heading = element.querySelector('.hero-wrapper h1, h1, h2');

  // Extract subtitle/description - validated against source: p.h1sub inside .hero-wrapper
  const description = element.querySelector('.hero-wrapper p.h1sub, .hero-wrapper p, p.h1sub');

  // Extract any CTA links (not present in current source, but handle variations)
  const ctaLinks = Array.from(element.querySelectorAll('.hero-wrapper a.cta, .hero-wrapper a.button, .hero-wrapper a[class*="btn"]'));

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (optional - include only if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell - heading, description, and CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog', cells });
  element.replaceWith(block);
}
