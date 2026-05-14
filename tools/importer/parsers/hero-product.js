/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product
 * Base block: hero
 * Source selector: #top
 * Source URL: https://www.avg.com/en-ww/homepage#mac
 * Generated: 2026-05-13
 *
 * Source HTML structure:
 * - Background image: #top > img (hero background/product image)
 * - Heading: h1 (main product heading)
 * - Description: .body-1.top-text (body text with inline link)
 * - Download CTAs: .buttons .button-wrapper a.button (platform-specific download links)
 * - Availability hints: .top-hint-item-1 .body-3 (also available for other platforms)
 * - Trust elements: .top-hint-item-2 (Trustpilot widget + award badge)
 *
 * Target table structure (2 rows):
 * Row 1: Background/hero image (single cell, optional if rendered via CSS)
 * Row 2: Content cell with heading, description, CTA, availability hint, award badge
 */
export default function parse(element, { document }) {
  // --- Extract background/hero image ---
  // Direct child img of #top only; do NOT fallback to nested images (e.g. award badge)
  // On some pages this may be rendered as CSS background instead of an img element
  const bgImage = element.querySelector(':scope > img');

  // --- Extract heading ---
  const heading = element.querySelector('h1');

  // --- Extract description text ---
  const description = element.querySelector('.body-1.top-text, .top-text');

  // --- Extract primary download CTA ---
  // Multiple platform-specific buttons exist (.js-pc, .js-mac, .js-android, .js-ios)
  // Extract the PC version as default primary CTA, fallback to first .button link
  const primaryCta = element.querySelector('.js-pc a.button')
    || element.querySelector('.button-wrapper a.button');

  // --- Extract "also available for" hint text ---
  // Take the PC platform hint as default
  const availabilityHint = element.querySelector('.js-pc.body-3')
    || element.querySelector('.top-hint-item-1 .body-3');

  // --- Extract award badge ---
  const awardImg = element.querySelector('.top-hint-award img');
  const awardText = element.querySelector('.top-hint-award-text');

  // --- Build cells array ---
  // Each entry in cells is a row. Each row is an array of cells.
  // To put multiple elements in ONE cell, wrap them in an array inside the row array.
  const cells = [];

  // Row 1: Hero/background image (single cell)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: All content stacked in a single cell
  // Wrap the content elements array inside another array to create one row with one cell
  const contentElements = [];

  if (heading) {
    contentElements.push(heading);
  }

  if (description) {
    contentElements.push(description);
  }

  if (primaryCta) {
    // Create a styled CTA link (strong > a = EDS button pattern)
    const ctaP = document.createElement('p');
    const ctaLink = document.createElement('a');
    ctaLink.href = primaryCta.href;
    ctaLink.textContent = primaryCta.textContent.trim();
    const strong = document.createElement('strong');
    strong.appendChild(ctaLink);
    ctaP.appendChild(strong);
    contentElements.push(ctaP);
  }

  if (availabilityHint) {
    contentElements.push(availabilityHint);
  }

  // Award badge: image + text combined in a paragraph
  if (awardImg || awardText) {
    const awardContainer = document.createElement('p');
    if (awardImg) {
      awardContainer.appendChild(awardImg.cloneNode(true));
    }
    if (awardText) {
      const awardSpan = document.createElement('span');
      awardSpan.textContent = awardText.textContent.trim();
      awardContainer.appendChild(awardSpan);
    }
    contentElements.push(awardContainer);
  }

  if (contentElements.length > 0) {
    // [[...elements]] = one row with one cell containing all elements
    cells.push([contentElements]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
