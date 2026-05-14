/* eslint-disable */
/* global WebImporter */

import heroProductParser from './parsers/hero-product.js';
import columnsUspParser from './parsers/columns-usp.js';
import columnsProductParser from './parsers/columns-product.js';
import columnsAwardsParser from './parsers/columns-awards.js';
import cardsProductParser from './parsers/cards-product.js';
import carouselBlogParser from './parsers/carousel-blog.js';

import avgCleanupTransformer from './transformers/avg-cleanup.js';
import avgSectionsTransformer from './transformers/avg-sections.js';

const parsers = {
  'hero-product': heroProductParser,
  'columns-usp': columnsUspParser,
  'columns-product': columnsProductParser,
  'columns-awards': columnsAwardsParser,
  'cards-product': cardsProductParser,
  'carousel-blog': carouselBlogParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AVG product homepage with hero, feature highlights, download CTAs, and platform-specific content',
  urls: [
    'https://www.avg.com/en-ww/homepage#mac',
  ],
  blocks: [
    {
      name: 'hero-product',
      instances: ['#top'],
    },
    {
      name: 'columns-usp',
      instances: ['.section-usp-stripe .usp-stripe'],
    },
    {
      name: 'columns-product',
      instances: ['#media-1.media', '#media-2.media', '#media-3.media'],
    },
    {
      name: 'columns-awards',
      instances: ['#awards-card .awards-img'],
    },
    {
      name: 'cards-product',
      instances: ['.included .included-cards-wrapper'],
    },
    {
      name: 'carousel-blog',
      instances: ['#blogposts .carousel-slider'],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero',
      selector: '#top',
      style: null,
      blocks: ['hero-product'],
      defaultContent: [],
    },
    {
      id: 'section-usp-stripe',
      name: 'USP Stripe',
      selector: '.section-usp-stripe',
      style: null,
      blocks: ['columns-usp'],
      defaultContent: [],
    },
    {
      id: 'section-media-1',
      name: 'Product Feature 1',
      selector: '#media-1',
      style: null,
      blocks: ['columns-product'],
      defaultContent: [],
    },
    {
      id: 'section-awards',
      name: 'Awards',
      selector: '#awards-card',
      style: null,
      blocks: ['columns-awards'],
      defaultContent: ['#awards-card .wrapper > img', '#awards-card .wrapper > h2', '#awards-card .wrapper > .body-2'],
    },
    {
      id: 'section-media-2',
      name: 'Product Feature 2',
      selector: '#media-2',
      style: null,
      blocks: ['columns-product'],
      defaultContent: [],
    },
    {
      id: 'section-media-3',
      name: 'Product Feature 3',
      selector: '#media-3',
      style: 'dark',
      blocks: ['columns-product'],
      defaultContent: [],
    },
    {
      id: 'section-included',
      name: 'Included Products',
      selector: '.inverse.included',
      style: 'dark',
      blocks: ['cards-product'],
      defaultContent: ['.included .included-title .h4'],
    },
    {
      id: 'section-blogposts',
      name: 'Blog Posts',
      selector: '#blogposts',
      style: null,
      blocks: ['carousel-blog'],
      defaultContent: ['#blogposts .title h2', '#blogposts .link-all a'],
    },
    {
      id: 'section-teaser',
      name: 'Download Teaser',
      selector: '#teaser',
      style: 'green',
      blocks: [],
      defaultContent: ['#teaser .ico img', '#teaser .ico p', '#teaser .button'],
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
