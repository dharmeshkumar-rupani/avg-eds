/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-blog
 * Base block: carousel
 * Source selectors: #blogposts .carousel-slider, .article-slider-post .article-slider-carousel
 * Generated: 2026-05-13
 *
 * Extracts blog post carousel slides from the source HTML.
 * Each slide (an <a> element with class tns-item) becomes a row with:
 *   - Column 1: slide image
 *   - Column 2: heading (h4.blog-title), description (p.blog-perex), and CTA link
 */
export default function parse(element, { document }) {
  // Select all slide items - each is an <a> wrapping image, title, description, CTA
  const slides = element.querySelectorAll('a.tns-item, .tns-slider > a, .slider-sliderSliNotiSecSm > a');

  const cells = [];

  slides.forEach((slide) => {
    // Column 1: slide image
    const img = slide.querySelector('img');

    // Column 2: text content - heading, description, CTA link
    const heading = slide.querySelector('h4.blog-title, h4, h3, [class*="title"]');
    const description = slide.querySelector('p.blog-perex, p, [class*="perex"], [class*="description"]');

    // Build the text content cell
    const textContent = [];

    if (heading) {
      // Create an h2 element to match library example heading level
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      textContent.push(h2);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textContent.push(p);
    }

    // Create a CTA link from the slide's href and the "Read More" text
    const slideHref = slide.getAttribute('href');
    if (slideHref) {
      const ctaText = slide.querySelector('.button span, .button, [class*="cta"]');
      const link = document.createElement('a');
      link.href = slideHref;
      link.textContent = ctaText ? ctaText.textContent.trim() : 'Read More';
      textContent.push(link);
    }

    // Only add rows that have at least an image or text content
    if (img || textContent.length > 0) {
      cells.push([img || '', textContent.length > 0 ? textContent : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-blog', cells });
  element.replaceWith(block);
}
