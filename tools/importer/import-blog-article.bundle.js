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

  // tools/importer/import-blog-article.js
  var import_blog_article_exports = {};
  __export(import_blog_article_exports, {
    default: () => import_blog_article_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document }) {
    const heroImage = element.querySelector(".hero-image-2 img, .col-lg-6.hero-image-2 img");
    const heading = element.querySelector(".art-title h1, h1.jumbotron-heading");
    const descriptions = [];
    const artTitleParagraphs = element.querySelectorAll(".art-title p, .row.art-title p");
    for (const p of artTitleParagraphs) {
      if (!p.classList.contains("h1sub") && p.textContent.trim().length > 0) {
        descriptions.push(p);
      }
    }
    const ctaLink = element.querySelector(
      ".os-detect.os-pc .btn.btn-orange, .os-detect .btn.btn-orange, .art-cta .btn, a.btn-orange, a.btn"
    );
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const contentContainer = document.createElement("div");
    if (heading) {
      contentContainer.append(heading);
    }
    for (const desc of descriptions) {
      contentContainer.append(desc);
    }
    if (ctaLink) {
      const ctaParagraph = document.createElement("p");
      const cleanLink = document.createElement("a");
      cleanLink.href = ctaLink.href;
      const ctaSpan = ctaLink.querySelector("span");
      cleanLink.textContent = ctaSpan ? ctaSpan.textContent.trim() : ctaLink.textContent.trim();
      ctaParagraph.append(cleanLink);
      contentContainer.append(ctaParagraph);
    }
    if (contentContainer.children.length > 0) {
      cells.push([contentContainer]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/fragment.js
  function parse2(element, { document }) {
    const heading = element.querySelector(".sidebar-text h4, h4, h3, h2");
    let fragmentSlug = "sidebar-cta";
    if (heading) {
      fragmentSlug = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    const fragmentPath = `/fragments/${fragmentSlug}`;
    const link = document.createElement("a");
    link.href = fragmentPath;
    link.textContent = fragmentPath;
    const cells = [
      [link]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "fragment", cells });
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

  // tools/importer/parsers/embed-reviews.js
  function parse4(element, { document }) {
    const iframe = element.querySelector("iframe");
    if (!iframe || !iframe.getAttribute("src")) {
      return;
    }
    const embedUrl = iframe.getAttribute("src");
    const link = document.createElement("a");
    link.href = embedUrl;
    link.textContent = embedUrl;
    const cells = [
      [link]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-reviews", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-blog.js
  function parse5(element, { document }) {
    const slides = element.querySelectorAll("a.tns-item, .tns-slider > a, .slider-sliderSliNotiSecSm > a");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      const heading = slide.querySelector('h4.blog-title, h4, h3, [class*="title"]');
      const description = slide.querySelector('p.blog-perex, p, [class*="perex"], [class*="description"]');
      const textContent = [];
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        textContent.push(h2);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textContent.push(p);
      }
      const slideHref = slide.getAttribute("href");
      if (slideHref) {
        const ctaText = slide.querySelector('.button span, .button, [class*="cta"]');
        const link = document.createElement("a");
        link.href = slideHref;
        link.textContent = ctaText ? ctaText.textContent.trim() : "Read More";
        textContent.push(link);
      }
      if (img || textContent.length > 0) {
        cells.push([img || "", textContent.length > 0 ? textContent : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-blog", cells });
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

  // tools/importer/import-blog-article.js
  var parsers = {
    "hero-article": parse,
    "fragment": parse2,
    "tabs-sidebar": parse3,
    "embed-reviews": parse4,
    "carousel-blog": parse5
  };
  var PAGE_TEMPLATE = {
    name: "blog-article",
    description: "AVG Signal blog detail page with article content, author info, and related articles",
    urls: [
      "https://www.avg.com/en/signal/what-is-malicious-code"
    ],
    blocks: [
      {
        name: "hero-article",
        instances: [".container-fluid.bg-white.center-hero"]
      },
      {
        name: "fragment",
        instances: ["#sidebar .hub-cta-desktop"]
      },
      {
        name: "tabs-sidebar",
        instances: ["#sidebar .sidebar-category-tab"]
      },
      {
        name: "embed-reviews",
        instances: [".tp-carousel .trustpilot-widget"]
      },
      {
        name: "carousel-blog",
        instances: [".article-slider-post .article-slider-carousel"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Article Hero",
        selector: ".container-fluid.bg-white.center-hero",
        style: null,
        blocks: ["hero-article"],
        defaultContent: []
      },
      {
        id: "section-article-body",
        name: "Article Body",
        selector: ".body-grey.article",
        style: null,
        blocks: ["fragment", "tabs-sidebar"],
        defaultContent: [".post-info .hub-topic", ".art-title h1", ".art-title p", ".article-body"]
      },
      {
        id: "section-reviews",
        name: "Trustpilot Reviews",
        selector: ".tp-carousel",
        style: null,
        blocks: ["embed-reviews"],
        defaultContent: [".tp-carousel-heading"]
      },
      {
        id: "section-related",
        name: "Related Articles",
        selector: ".article-slider-post",
        style: null,
        blocks: ["carousel-blog"],
        defaultContent: [".article-slider-headline"]
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
  var import_blog_article_default = {
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
  return __toCommonJS(import_blog_article_exports);
})();
