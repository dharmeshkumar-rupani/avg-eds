/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-product variant.
 * Base block: columns
 * Source: https://www.avg.com/en-ww/homepage#mac
 * Selectors: #media-1.media, #media-2.media, #media-3.media
 * Generated: 2026-05-13
 *
 * Extracts a two-column product feature layout:
 *   Column 1: Product screenshot image (PC variant by default)
 *   Column 2: Icon + product name, heading, description, CTA buttons
 *
 * Source HTML has platform-specific spans (js-pc, js-mac, js-android, js-ios).
 * Parser extracts the first/PC platform content as the default representation.
 */
export default function parse(element, { document }) {
  // --- Column 1: Product image ---
  // Source has multiple platform images in .span6.img; take the first visible (js-pc)
  const imageContainer = element.querySelector('.span6.img, .img, [class*="img"]');
  const productImage = imageContainer
    ? imageContainer.querySelector('img.js-pc, img.pc, img:first-of-type')
    : element.querySelector('img');

  // --- Column 2: Text content ---
  const textContainer = element.querySelector('.span6.text, .text, [class*="text"]');

  // Icon + product name from .icon-product
  const iconProduct = textContainer
    ? textContainer.querySelector('.icon-product')
    : element.querySelector('.icon-product');

  let iconImage = null;
  let productName = null;
  if (iconProduct) {
    iconImage = iconProduct.querySelector('img');
    // Get the PC-specific product name span, fall back to first span
    productName = iconProduct.querySelector('span.js-pc, span:first-of-type');
  }

  // Heading (h2 with platform-specific spans)
  const headingEl = textContainer
    ? textContainer.querySelector('h2, h1, h3, [class*="heading"]')
    : element.querySelector('h2, h1, h3');

  let heading = null;
  if (headingEl) {
    // Extract PC-specific heading text, fall back to first span or full heading
    const headingSpan = headingEl.querySelector('span.js-pc, span:first-of-type');
    if (headingSpan) {
      // Create a clean h2 with just the relevant text
      heading = document.createElement('h2');
      heading.textContent = headingSpan.textContent.trim();
    } else {
      heading = headingEl;
    }
  }

  // Description (.body-3 with platform-specific spans)
  const descEl = textContainer
    ? textContainer.querySelector('.body-3, .body-2, p, [class*="body"]')
    : element.querySelector('.body-3, .body-2, p');

  let description = null;
  if (descEl) {
    const descSpan = descEl.querySelector('span.js-pc, span:first-of-type');
    if (descSpan) {
      description = document.createElement('p');
      description.textContent = descSpan.textContent.trim();
    } else {
      description = document.createElement('p');
      description.textContent = descEl.textContent.trim();
    }
  }

  // CTA buttons - extract PC-specific links
  const buttonsContainer = textContainer
    ? textContainer.querySelector('.buttons, [class*="button"]')
    : element.querySelector('.buttons');

  const ctaLinks = [];
  if (buttonsContainer) {
    // Get PC-specific buttons first, fall back to all buttons
    let buttons = Array.from(buttonsContainer.querySelectorAll('a.js-pc'));
    if (buttons.length === 0) {
      buttons = Array.from(buttonsContainer.querySelectorAll('a.button, a[class*="button"]'));
    }
    buttons.forEach((btn) => {
      const link = document.createElement('a');
      link.href = btn.href || btn.getAttribute('href');
      // Extract text from inner span or direct text
      const spanText = btn.querySelector('span');
      link.textContent = spanText ? spanText.textContent.trim() : btn.textContent.trim();
      ctaLinks.push(link);
    });
  }

  // --- Build cells: 2-column layout matching Columns block library ---
  // Row 1: [image column, text column]
  // Image column: product screenshot
  const imageCell = [];
  if (productImage) {
    imageCell.push(productImage);
  }

  // Text column: icon+name, heading, description, CTAs
  const textCell = [];
  if (iconImage && productName) {
    // Create a small container for icon + product name
    const nameP = document.createElement('p');
    const iconClone = iconImage.cloneNode(true);
    nameP.append(iconClone);
    nameP.append(document.createTextNode(' ' + productName.textContent.trim()));
    textCell.push(nameP);
  } else if (productName) {
    const nameP = document.createElement('p');
    nameP.textContent = productName.textContent.trim();
    textCell.push(nameP);
  }

  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    p.append(link);
    textCell.push(p);
  });

  const cells = [
    [imageCell, textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-product', cells });
  element.replaceWith(block);
}
