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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(":scope > img");
    const heading = element.querySelector("h1");
    const description = element.querySelector(".body-1.top-text, .top-text");
    const primaryCta = element.querySelector(".js-pc a.button") || element.querySelector(".button-wrapper a.button");
    const availabilityHint = element.querySelector(".js-pc.body-3") || element.querySelector(".top-hint-item-1 .body-3");
    const awardImg = element.querySelector(".top-hint-award img");
    const awardText = element.querySelector(".top-hint-award-text");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentElements = [];
    if (heading) {
      contentElements.push(heading);
    }
    if (description) {
      contentElements.push(description);
    }
    if (primaryCta) {
      const ctaP = document.createElement("p");
      const ctaLink = document.createElement("a");
      ctaLink.href = primaryCta.href;
      ctaLink.textContent = primaryCta.textContent.trim();
      const strong = document.createElement("strong");
      strong.appendChild(ctaLink);
      ctaP.appendChild(strong);
      contentElements.push(ctaP);
    }
    if (availabilityHint) {
      contentElements.push(availabilityHint);
    }
    if (awardImg || awardText) {
      const awardContainer = document.createElement("p");
      if (awardImg) {
        awardContainer.appendChild(awardImg.cloneNode(true));
      }
      if (awardText) {
        const awardSpan = document.createElement("span");
        awardSpan.textContent = awardText.textContent.trim();
        awardContainer.appendChild(awardSpan);
      }
      contentElements.push(awardContainer);
    }
    if (contentElements.length > 0) {
      cells.push([contentElements]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-usp.js
  function parse2(element, { document }) {
    const uspItems = element.querySelectorAll('.usp-stripe-item, [class*="usp-stripe-item"]');
    const row = [];
    uspItems.forEach((item) => {
      const cellContent = [];
      const img = item.querySelector("img");
      if (img) {
        cellContent.push(img);
      }
      const text = item.querySelector('span, p, .usp-text, [class*="text"]');
      if (text) {
        cellContent.push(text);
      }
      if (cellContent.length > 0) {
        row.push(cellContent);
      }
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-usp", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-product.js
  function parse3(element, { document }) {
    const imageContainer = element.querySelector('.span6.img, .img, [class*="img"]');
    const productImage = imageContainer ? imageContainer.querySelector("img.js-pc, img.pc, img:first-of-type") : element.querySelector("img");
    const textContainer = element.querySelector('.span6.text, .text, [class*="text"]');
    const iconProduct = textContainer ? textContainer.querySelector(".icon-product") : element.querySelector(".icon-product");
    let iconImage = null;
    let productName = null;
    if (iconProduct) {
      iconImage = iconProduct.querySelector("img");
      productName = iconProduct.querySelector("span.js-pc, span:first-of-type");
    }
    const headingEl = textContainer ? textContainer.querySelector('h2, h1, h3, [class*="heading"]') : element.querySelector("h2, h1, h3");
    let heading = null;
    if (headingEl) {
      const headingSpan = headingEl.querySelector("span.js-pc, span:first-of-type");
      if (headingSpan) {
        heading = document.createElement("h2");
        heading.textContent = headingSpan.textContent.trim();
      } else {
        heading = headingEl;
      }
    }
    const descEl = textContainer ? textContainer.querySelector('.body-3, .body-2, p, [class*="body"]') : element.querySelector(".body-3, .body-2, p");
    let description = null;
    if (descEl) {
      const descSpan = descEl.querySelector("span.js-pc, span:first-of-type");
      if (descSpan) {
        description = document.createElement("p");
        description.textContent = descSpan.textContent.trim();
      } else {
        description = document.createElement("p");
        description.textContent = descEl.textContent.trim();
      }
    }
    const buttonsContainer = textContainer ? textContainer.querySelector('.buttons, [class*="button"]') : element.querySelector(".buttons");
    const ctaLinks = [];
    if (buttonsContainer) {
      let buttons = Array.from(buttonsContainer.querySelectorAll("a.js-pc"));
      if (buttons.length === 0) {
        buttons = Array.from(buttonsContainer.querySelectorAll('a.button, a[class*="button"]'));
      }
      buttons.forEach((btn) => {
        const link = document.createElement("a");
        link.href = btn.href || btn.getAttribute("href");
        const spanText = btn.querySelector("span");
        link.textContent = spanText ? spanText.textContent.trim() : btn.textContent.trim();
        ctaLinks.push(link);
      });
    }
    const imageCell = [];
    if (productImage) {
      imageCell.push(productImage);
    }
    const textCell = [];
    if (iconImage && productName) {
      const nameP = document.createElement("p");
      const iconClone = iconImage.cloneNode(true);
      nameP.append(iconClone);
      nameP.append(document.createTextNode(" " + productName.textContent.trim()));
      textCell.push(nameP);
    } else if (productName) {
      const nameP = document.createElement("p");
      nameP.textContent = productName.textContent.trim();
      textCell.push(nameP);
    }
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    ctaLinks.forEach((link) => {
      const p = document.createElement("p");
      p.append(link);
      textCell.push(p);
    });
    const cells = [
      [imageCell, textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-awards.js
  function parse4(element, { document }) {
    const awardIcons = element.querySelectorAll(".awards-icon");
    const cells = [];
    const row = [];
    awardIcons.forEach((icon) => {
      const cellContainer = document.createElement("div");
      const img = icon.querySelector("img");
      if (img) {
        cellContainer.appendChild(img.cloneNode(true));
      }
      const description = icon.querySelector(".body-2");
      if (description) {
        cellContainer.appendChild(description.cloneNode(true));
      }
      row.push(cellContainer);
    });
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-awards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll(":scope > .included-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(":scope > img");
      const contentCell = [];
      const titleEl = card.querySelector(".included-card-body .h5");
      if (titleEl) {
        const h5 = document.createElement("h5");
        h5.textContent = titleEl.textContent;
        contentCell.push(h5);
      }
      const descEl = card.querySelector(".included-card-body .body-3");
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent;
        contentCell.push(p);
      }
      const ctaLink = card.querySelector(":scope > a.link");
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href");
        a.textContent = ctaLink.textContent.trim();
        contentCell.push(a);
      }
      cells.push([img || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-blog.js
  function parse6(element, { document }) {
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-product": parse,
    "columns-usp": parse2,
    "columns-product": parse3,
    "columns-awards": parse4,
    "cards-product": parse5,
    "carousel-blog": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AVG product homepage with hero, feature highlights, download CTAs, and platform-specific content",
    urls: [
      "https://www.avg.com/en-ww/homepage#mac"
    ],
    blocks: [
      {
        name: "hero-product",
        instances: ["#top"]
      },
      {
        name: "columns-usp",
        instances: [".section-usp-stripe .usp-stripe"]
      },
      {
        name: "columns-product",
        instances: ["#media-1.media", "#media-2.media", "#media-3.media"]
      },
      {
        name: "columns-awards",
        instances: ["#awards-card .awards-img"]
      },
      {
        name: "cards-product",
        instances: [".included .included-cards-wrapper"]
      },
      {
        name: "carousel-blog",
        instances: ["#blogposts .carousel-slider"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero",
        selector: "#top",
        style: null,
        blocks: ["hero-product"],
        defaultContent: []
      },
      {
        id: "section-usp-stripe",
        name: "USP Stripe",
        selector: ".section-usp-stripe",
        style: null,
        blocks: ["columns-usp"],
        defaultContent: []
      },
      {
        id: "section-media-1",
        name: "Product Feature 1",
        selector: "#media-1",
        style: null,
        blocks: ["columns-product"],
        defaultContent: []
      },
      {
        id: "section-awards",
        name: "Awards",
        selector: "#awards-card",
        style: null,
        blocks: ["columns-awards"],
        defaultContent: ["#awards-card .wrapper > img", "#awards-card .wrapper > h2", "#awards-card .wrapper > .body-2"]
      },
      {
        id: "section-media-2",
        name: "Product Feature 2",
        selector: "#media-2",
        style: null,
        blocks: ["columns-product"],
        defaultContent: []
      },
      {
        id: "section-media-3",
        name: "Product Feature 3",
        selector: "#media-3",
        style: "dark",
        blocks: ["columns-product"],
        defaultContent: []
      },
      {
        id: "section-included",
        name: "Included Products",
        selector: ".inverse.included",
        style: "dark",
        blocks: ["cards-product"],
        defaultContent: [".included .included-title .h4"]
      },
      {
        id: "section-blogposts",
        name: "Blog Posts",
        selector: "#blogposts",
        style: null,
        blocks: ["carousel-blog"],
        defaultContent: ["#blogposts .title h2", "#blogposts .link-all a"]
      },
      {
        id: "section-teaser",
        name: "Download Teaser",
        selector: "#teaser",
        style: "green",
        blocks: [],
        defaultContent: ["#teaser .ico img", "#teaser .ico p", "#teaser .button"]
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
