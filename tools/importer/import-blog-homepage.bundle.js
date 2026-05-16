/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-blog-homepage.js
  var import_blog_homepage_exports = {};
  __export(import_blog_homepage_exports, {
    default: () => import_blog_homepage_default
  });

  // tools/importer/parsers/hero-blog.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".container > img, .container img");
    const heading = element.querySelector(".hero-wrapper h1, h1, h2");
    const description = element.querySelector(".hero-wrapper p.h1sub, .hero-wrapper p, p.h1sub");
    const ctaLinks = Array.from(element.querySelectorAll('.hero-wrapper a.cta, .hero-wrapper a.button, .hero-wrapper a[class*="btn"]'));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-blog.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(":scope > .card, :scope .card.card-x-small");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".img-wrapper img, img.main-feature-image");
      const contentCell = [];
      const titleLink = card.querySelector(".copy-wrapper a.no-mobile") || card.querySelector(".copy-wrapper a.no-desktop-inline") || card.querySelector(".copy-wrapper a");
      if (titleLink) {
        const a = document.createElement("a");
        a.href = titleLink.getAttribute("href");
        a.textContent = titleLink.textContent.trim();
        const p = document.createElement("p");
        p.append(a);
        contentCell.push(p);
      }
      cells.push([img || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-sidebar.js
  function parse3(element, { document }) {
    const tabItems = element.querySelectorAll(".selector .item");
    const articlePanels = element.querySelectorAll(".articles-wrapper .articles");
    const cells = [];
    tabItems.forEach((item) => {
      const headlineEl = item.querySelector("span.category-headline, .category-headline");
      const label = headlineEl ? headlineEl.textContent.trim() : "";
      if (!label) return;
      const itemClasses = Array.from(item.classList);
      const categoryClass = itemClasses.find(
        (cls) => cls !== "item" && !cls.startsWith("item-") && cls !== "active"
      );
      let matchingPanel = null;
      if (categoryClass) {
        matchingPanel = element.querySelector(`.articles-wrapper .articles.${categoryClass}`);
      }
      if (!matchingPanel) {
        const idx = Array.from(tabItems).indexOf(item);
        if (idx < articlePanels.length) {
          matchingPanel = articlePanels[idx];
        }
      }
      const contentCell = [];
      const heading = document.createElement("h3");
      heading.textContent = label;
      contentCell.push(heading);
      if (matchingPanel) {
        const links = matchingPanel.querySelectorAll("ul li a");
        if (links.length > 0) {
          const ul = document.createElement("ul");
          links.forEach((link) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link.getAttribute("href") || "";
            a.textContent = link.textContent.trim();
            li.appendChild(a);
            ul.appendChild(li);
          });
          contentCell.push(ul);
        }
      }
      cells.push(contentCell);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-sidebar", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/avg-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#cheqMini",
        "#ensModalWrapper",
        "#cheq-dev",
        ".js-cookie-bar",
        "div#modal",
        ".language-selector.modal"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".message-bar",
        "nav#menu",
        ".sticky-bar",
        ".header-parsys",
        "#main-header-new",
        ".breadcrumb-container",
        "#bottom",
        "#footer-signal-v2",
        ".social-connect",
        "#sdl-id",
        "#hub-dl",
        "#category-dl",
        "#author-dl",
        "#date-dl"
      ]);
    }
  }

  // tools/importer/transformers/avg-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-blog-homepage.js
  var parsers = {
    "hero-blog": parse,
    "cards-blog": parse2,
    "tabs-sidebar": parse3
  };
  var PAGE_TEMPLATE = {
    name: "blog-homepage",
    description: "AVG Signal blog listing page with featured articles, category navigation, and article cards",
    urls: [
      "https://www.avg.com/en/signal"
    ],
    blocks: [
      {
        name: "hero-blog",
        instances: [".hp-hero-banner.hero-banner"]
      },
      {
        name: "cards-blog",
        instances: ["#security .hub-wrap", "#privacy .hub-wrap", "#performance .hub-wrap"]
      },
      {
        name: "tabs-sidebar",
        instances: [".sidebar-homepage .sidebar-category-tab"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero Banner",
        selector: ".hp-hero-banner.hero-banner",
        style: null,
        blocks: ["hero-blog"],
        defaultContent: []
      },
      {
        id: "section-security",
        name: "Security Category",
        selector: "#security.category-wrapper",
        style: null,
        blocks: ["cards-blog"],
        defaultContent: ["#security .category-link-homepage-listing", "#security h2"]
      },
      {
        id: "section-privacy",
        name: "Privacy Category",
        selector: "#privacy.category-wrapper",
        style: null,
        blocks: ["cards-blog"],
        defaultContent: ["#privacy .category-link-homepage-listing", "#privacy h2"]
      },
      {
        id: "section-performance",
        name: "Performance Category",
        selector: "#performance.category-wrapper",
        style: null,
        blocks: ["cards-blog"],
        defaultContent: ["#performance .category-link-homepage-listing", "#performance h2"]
      },
      {
        id: "section-sidebar",
        name: "Sidebar",
        selector: ".sidebar-homepage",
        style: "sidebar",
        blocks: ["tabs-sidebar"],
        defaultContent: [".sidebar-homepage .homepage-tags-desktop h4", ".sidebar-homepage .homepage-tags-desktop .tags"]
      }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_blog_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_blog_homepage_exports);
})();
