/* eslint-disable */
/* global WebImporter */

import heroBlogParser from './parsers/hero-blog.js';
import cardsBlogParser from './parsers/cards-blog.js';
import tabsSidebarParser from './parsers/tabs-sidebar.js';

import avgCleanupTransformer from './transformers/avg-cleanup.js';
import avgSectionsTransformer from './transformers/avg-sections.js';

const parsers = {
  'hero-blog': heroBlogParser,
  'cards-blog': cardsBlogParser,
  'tabs-sidebar': tabsSidebarParser,
};

const PAGE_TEMPLATE = {
  name: 'blog-homepage',
  description: 'AVG Signal blog listing page with featured articles, category navigation, and article cards',
  urls: [
    'https://www.avg.com/en/signal',
  ],
  blocks: [
    {
      name: 'hero-blog',
      instances: ['.hp-hero-banner.hero-banner'],
    },
    {
      name: 'cards-blog',
      instances: ['#security .hub-wrap', '#privacy .hub-wrap', '#performance .hub-wrap'],
    },
    {
      name: 'tabs-sidebar',
      instances: ['.sidebar-homepage .sidebar-category-tab'],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero Banner',
      selector: '.hp-hero-banner.hero-banner',
      style: null,
      blocks: ['hero-blog'],
      defaultContent: [],
    },
    {
      id: 'section-security',
      name: 'Security Category',
      selector: '#security.category-wrapper',
      style: null,
      blocks: ['cards-blog'],
      defaultContent: ['#security .category-link-homepage-listing', '#security h2'],
    },
    {
      id: 'section-privacy',
      name: 'Privacy Category',
      selector: '#privacy.category-wrapper',
      style: null,
      blocks: ['cards-blog'],
      defaultContent: ['#privacy .category-link-homepage-listing', '#privacy h2'],
    },
    {
      id: 'section-performance',
      name: 'Performance Category',
      selector: '#performance.category-wrapper',
      style: null,
      blocks: ['cards-blog'],
      defaultContent: ['#performance .category-link-homepage-listing', '#performance h2'],
    },
    {
      id: 'section-sidebar',
      name: 'Sidebar',
      selector: '.sidebar-homepage',
      style: 'sidebar',
      blocks: ['tabs-sidebar'],
      defaultContent: ['.sidebar-homepage .homepage-tags-desktop h4', '.sidebar-homepage .homepage-tags-desktop .tags'],
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
