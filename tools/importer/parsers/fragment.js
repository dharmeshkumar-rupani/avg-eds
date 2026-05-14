/* eslint-disable */
/* global WebImporter */

/**
 * Parser for fragment variant.
 * Base block: fragment
 * Selector: #sidebar .hub-cta-desktop
 * Generated: 2026-05-13
 *
 * The fragment block references a separate content page (fragment) by link.
 * This parser extracts a meaningful fragment path from the sidebar CTA widget
 * and creates a fragment block with a link to that path.
 *
 * Source structure:
 * - .hub-cta-desktop.hub-cta-post > .sidebar-widget
 *   - .sidebar-content > img.logo-cta + .sidebar-text > h4 + p
 *   - .btn-wrapper > a.btn + p (platform links)
 */
export default function parse(element, { document }) {
  // Derive a fragment path from the sidebar CTA content.
  // Use the heading text to generate a slug, falling back to a generic path.
  const heading = element.querySelector('.sidebar-text h4, h4, h3, h2');
  let fragmentSlug = 'sidebar-cta';

  if (heading) {
    fragmentSlug = heading.textContent.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const fragmentPath = `/fragments/${fragmentSlug}`;

  // Create a link element pointing to the fragment path
  const link = document.createElement('a');
  link.href = fragmentPath;
  link.textContent = fragmentPath;

  // Fragment block: single row with the fragment link
  const cells = [
    [link],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'fragment', cells });
  element.replaceWith(block);
}
