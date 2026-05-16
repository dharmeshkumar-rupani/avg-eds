/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-article
 * Base block: hero
 * Source: https://www.avg.com/en/signal/what-is-malicious-code
 * Selector: .container-fluid.bg-white.center-hero
 * Generated: 2026-05-13
 *
 * Extracts article hero content: hero image, article title (h1),
 * description paragraph, and primary CTA button.
 */
export default function parse(element, { document }) {
  // --- Extract hero image ---
  // Validated selector: .hero-image-2 img (col-lg-6 container with article hero image)
  const heroImage = element.querySelector('.hero-image-2 img, .col-lg-6.hero-image-2 img');

  // --- Extract article title ---
  // Validated selector: h1.jumbotron-heading inside .art-title
  const heading = element.querySelector('.art-title h1, h1.jumbotron-heading');

  // --- Extract description paragraph ---
  // Validated: .art-title contains h1, then p.h1sub (empty), then description p(s)
  // Strategy: find all p elements inside .art-title, skip .h1sub and empty ones
  const descriptions = [];
  const artTitleParagraphs = element.querySelectorAll('.art-title p, .row.art-title p');
  for (const p of artTitleParagraphs) {
    if (!p.classList.contains('h1sub') && p.textContent.trim().length > 0) {
      descriptions.push(p);
    }
  }

  // --- Extract primary CTA button ---
  // Validated: .os-detect containers each have a .btn download link
  // Prefer PC variant, fallback to any .btn found
  const ctaLink = element.querySelector(
    '.os-detect.os-pc .btn.btn-orange, .os-detect .btn.btn-orange, .art-cta .btn, a.btn-orange, a.btn'
  );

  // --- Build cells array ---
  // Row 1: Hero image
  // Row 2: Single content cell with title, description, and CTA
  const cells = [];

  // Image row (if hero image exists)
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Content row: wrap all content in a single container div so it stays in one cell
  const contentContainer = document.createElement('div');

  if (heading) {
    contentContainer.append(heading);
  }
  for (const desc of descriptions) {
    contentContainer.append(desc);
  }
  if (ctaLink) {
    // Create a clean paragraph with anchor (strip inline icon img)
    const ctaParagraph = document.createElement('p');
    const cleanLink = document.createElement('a');
    cleanLink.href = ctaLink.href;
    const ctaSpan = ctaLink.querySelector('span');
    cleanLink.textContent = ctaSpan ? ctaSpan.textContent.trim() : ctaLink.textContent.trim();
    ctaParagraph.append(cleanLink);
    contentContainer.append(ctaParagraph);
  }

  if (contentContainer.children.length > 0) {
    cells.push([contentContainer]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
