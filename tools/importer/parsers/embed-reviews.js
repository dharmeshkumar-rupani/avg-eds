/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-reviews
 * Base block: embed
 * Source: https://www.avg.com/en/signal/what-is-malicious-code
 * Selector: .tp-carousel .trustpilot-widget
 * Generated: 2026-05-13
 *
 * Extracts the Trustpilot widget iframe src URL and produces
 * a single-row embed block with an anchor link to that URL.
 * The embed-reviews block decorate function reads the link href
 * and renders the embed via iframe.
 */
export default function parse(element, { document }) {
  // Extract the iframe src URL from the Trustpilot widget
  const iframe = element.querySelector('iframe');

  if (!iframe || !iframe.getAttribute('src')) {
    // Fallback: if no iframe found, skip this element
    return;
  }

  const embedUrl = iframe.getAttribute('src');

  // Create an anchor element with the embed URL
  // The embed-reviews block expects a link (<a>) with the embed URL as href
  const link = document.createElement('a');
  link.href = embedUrl;
  link.textContent = embedUrl;

  // Single row with the embed link
  const cells = [
    [link],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-reviews', cells });
  element.replaceWith(block);
}
