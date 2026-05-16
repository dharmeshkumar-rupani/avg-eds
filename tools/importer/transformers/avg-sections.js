/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AVG section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on template sections.
 * All section selectors verified from captured DOM across homepage, blog-homepage, and blog-article templates.
 *
 * Section selectors by template:
 *   homepage: #top, .section-usp-stripe, #media-1, #awards-card, #media-2, #media-3,
 *             .inverse.included, #blogposts, #teaser
 *   blog-homepage: .hp-hero-banner.hero-banner, #security.category-wrapper,
 *                  #privacy.category-wrapper, #performance.category-wrapper, .sidebar-homepage
 *   blog-article: .container-fluid.bg-white.center-hero, .body-grey.article,
 *                 .tp-carousel, .article-slider-post
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);

      if (!sectionEl) {
        continue;
      }

      // Add Section Metadata block if the section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        // Insert section metadata after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before each section that is not the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
