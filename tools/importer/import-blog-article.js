/* eslint-disable */
/* global WebImporter */

import heroArticleParser from './parsers/hero-article.js';
import fragmentParser from './parsers/fragment.js';
import tabsSidebarParser from './parsers/tabs-sidebar.js';
import embedReviewsParser from './parsers/embed-reviews.js';
import carouselBlogParser from './parsers/carousel-blog.js';

import avgCleanupTransformer from './transformers/avg-cleanup.js';
import avgSectionsTransformer from './transformers/avg-sections.js';

const parsers = {
  'hero-article': heroArticleParser,
  'fragment': fragmentParser,
  'tabs-sidebar': tabsSidebarParser,
  'embed-reviews': embedReviewsParser,
  'carousel-blog': carouselBlogParser,
};

const PAGE_TEMPLATE = {
  name: 'blog-article',
  description: 'AVG Signal blog detail page with article content, author info, and related articles',
  urls: [
    'https://www.avg.com/en/signal/what-is-malicious-code',
  ],
  blocks: [
    {
      name: 'hero-article',
      instances: ['.container-fluid.bg-white.center-hero'],
    },
    {
      name: 'fragment',
      instances: ['#sidebar .hub-cta-desktop'],
    },
    {
      name: 'tabs-sidebar',
      instances: ['#sidebar .sidebar-category-tab'],
    },
    {
      name: 'embed-reviews',
      instances: ['.tp-carousel .trustpilot-widget'],
    },
    {
      name: 'carousel-blog',
      instances: ['.article-slider-post .article-slider-carousel'],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Article Hero',
      selector: '.container-fluid.bg-white.center-hero',
      style: null,
      blocks: ['hero-article'],
      defaultContent: [],
    },
    {
      id: 'section-article-body',
      name: 'Article Body',
      selector: '.body-grey.article',
      style: null,
      blocks: ['fragment', 'tabs-sidebar'],
      defaultContent: ['.post-info .hub-topic', '.art-title h1', '.art-title p', '.article-body'],
    },
    {
      id: 'section-reviews',
      name: 'Trustpilot Reviews',
      selector: '.tp-carousel',
      style: null,
      blocks: ['embed-reviews'],
      defaultContent: ['.tp-carousel-heading'],
    },
    {
      id: 'section-related',
      name: 'Related Articles',
      selector: '.article-slider-post',
      style: null,
      blocks: ['carousel-blog'],
      defaultContent: ['.article-slider-headline'],
    },
  ],
};

const transformers = [
  avgCleanupTransformer,
  avgSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
