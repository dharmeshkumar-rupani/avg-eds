import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero') || h1.closest('.hero-article') || picture.closest('.hero-article')) {
      return;
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
const CATEGORY_ICONS = {
  security: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40"><path fill="none" fill-rule="evenodd" stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 8.4v5.362c0 3.35 1.191 6.106 3.5 8.266 1.191 1.117 2.309 1.861 3.5 2.308l1.117-.521c.894-.521 1.638-1.117 2.383-1.787 2.309-2.16 3.5-4.915 3.5-8.266V8.4H9z"/></svg>',
  privacy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40"><path fill="none" fill-rule="evenodd" stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.9 15.7c.3-.3.5-.5.8-.7v-1c0-1.2.5-2.3 1.4-3.2.8-.9 1.9-1.3 3.1-1.3 1.2 0 2.3.4 3.1 1.3.9.9 1.3 2 1.3 3.2v1c.3.2.6.4.9.7 1 1 1.5 2.1 1.5 3.5V21c0 1.3-.5 2.5-1.5 3.5-.9.9-2.1 1.4-3.4 1.4h-3.7c-1.3 0-2.4-.5-3.4-1.4-1-1-1.5-2.1-1.5-3.5v-1.8c0-1.3.4-2.5 1.4-3.5zm9.9-7.5c-1.3-1.3-2.9-2-4.8-2s-3.6.7-4.9 2m.599 6.8c.8-.5 1.6-.8 2.6-.8h3.7c1 0 1.8.2 2.6.8M22.9 6.2C21 4.3 18.7 3.3 16 3.3s-5 1-6.9 2.9"/></svg>',
  performance: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40"><g fill="none" fill-rule="evenodd" transform="translate(6 6)"><path stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M.4 9.8C.4 7.2 1.3 5 3 3.3 4.8 1.5 7 .5 9.6.5c2.6 0 4.8.9 6.5 2.8 1.8 1.8 2.7 4 2.7 6.5s-.9 4.7-2.7 6.5c-1.8 1.8-4 2.7-6.5 2.7-2.6 0-4.8-.9-6.6-2.7-1.7-1.8-2.6-4-2.6-6.5zm3.4 0c0-1.6.6-3 1.7-4.1C6.6 4.5 8 3.9 9.6 3.9c1.6 0 3 .6 4.1 1.8 1.1 1.1 1.7 2.5 1.7 4.1"/><path stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.1 0.8L1.7 4.8" transform="translate(8 5)"/></g></svg>',
};

const SUBTOPICS = {
  security: [
    ['Viruses', '/en/signal/topic/viruses'], ['Ransomware', '/en/signal/topic/ransomware'],
    ['Threats', '/en/signal/topic/threats'], ['Security Tips', '/en/signal/topic/security-tips'],
    ['Internet', '/en/signal/topic/internet'], ['Scams', '/en/signal/topic/scams'],
    ['Phishing', '/en/signal/topic/phishing'], ['IoT', '/en/signal/topic/internet-of-things'],
    ['AVG News', '/en/signal/topic/avg-news'], ['Business', '/en/signal/topic/business'],
  ],
  privacy: [
    ['VPN', '/en/signal/topic/vpn'], ['IP Address', '/en/signal/topic/ip-address'],
    ['Hackers', '/en/signal/topic/hackers'], ['Passwords', '/en/signal/topic/passwords'],
    ['Social Media', '/en/signal/topic/social-media'], ['Privacy Tips', '/en/signal/topic/privacy-tips'],
  ],
  performance: [
    ['Speed', '/en/signal/topic/speed'], ['Gaming', '/en/signal/topic/gaming'],
    ['Hardware', '/en/signal/topic/hardware'], ['Apps', '/en/signal/topic/performance-tips'],
  ],
};

function addSubtopicHeadings(main) {
  const blogMain = main.querySelector('.blog-main-col');
  if (!blogMain) return;

  Object.entries(SUBTOPICS).forEach(([category, topics]) => {
    const catH2 = blogMain.querySelector(`h2 a[href*="signal-${category}"]`);
    if (!catH2) return;

    const cardBlocks = [];
    let el = catH2.closest('.default-content-wrapper')?.nextElementSibling;
    while (el && el.classList.contains('cards-blog-wrapper')) {
      cardBlocks.push(el);
      el = el.nextElementSibling;
    }

    cardBlocks.forEach((block, i) => {
      if (i < topics.length) {
        const [name, href] = topics[i];

        const wrapper = document.createElement('div');
        wrapper.className = 'subtopic-group';

        const h3 = document.createElement('h3');
        h3.id = name.toLowerCase().replace(/\s+/g, '-');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = name;
        h3.append(a);

        const more = document.createElement('p');
        more.className = 'more-about';
        const moreA = document.createElement('a');
        moreA.href = href;
        moreA.textContent = `More about ${name}`;
        more.append(moreA);

        block.before(wrapper);
        wrapper.append(h3, block, more);

        const cardsBlog = wrapper.querySelector('.cards-blog');
        if (cardsBlog) cardsBlog.classList.add('small');
      }
    });
  });
}

function addCategoryIcons(main) {
  main.querySelectorAll('h2').forEach((h2) => {
    const link = h2.querySelector('a');
    if (!link) return;
    const text = link.textContent.trim().toLowerCase();
    if (CATEGORY_ICONS[text]) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'category-icon';
      iconSpan.innerHTML = CATEGORY_ICONS[text];
      h2.prepend(iconSpan);
    }
  });
}

function wrapArticleCards(main) {
  main.querySelectorAll('.default-content-wrapper').forEach((dcw) => {
    const imgParas = dcw.querySelectorAll(':scope > p > a > picture');
    imgParas.forEach((pic) => {
      const imgP = pic.closest('p');
      const titleP = imgP.nextElementSibling;
      if (titleP && titleP.tagName === 'P' && !titleP.querySelector('picture') && !titleP.querySelector('a[href*="/topic/"]')) {
        const card = document.createElement('div');
        card.className = 'article-card';
        imgP.before(card);
        card.append(imgP, titleP);
      }
    });
  });
}

function buildArticleTocSidebar(main) {
  const heroSection = main.querySelector('.hero-article-container');
  if (!heroSection) return;

  const dcw = [...heroSection.querySelectorAll('.default-content-wrapper')].find(
    (d) => [...d.querySelectorAll('p')].some((p) => p.textContent.trim().toLowerCase() === 'this article contains'),
  );
  if (!dcw) return;

  const tocPs = [...dcw.querySelectorAll('p')].filter(
    (p) => p.textContent.trim().toLowerCase() === 'this article contains',
  );
  const tocHeading = tocPs[0];
  if (!tocHeading) return;

  if (tocPs.length > 1) tocPs.slice(1).forEach((p) => p.remove());

  const tocList = tocHeading.nextElementSibling;
  if (!tocList || tocList.tagName !== 'UL') return;

  tocHeading.textContent = 'This article contains:';

  const h2s = [...dcw.querySelectorAll('h2')];
  const tocLinks = [...tocList.querySelectorAll('a')];
  tocLinks.forEach((a, i) => {
    if (h2s[i]) {
      const id = h2s[i].id || `topic-${i + 1}`;
      h2s[i].id = id;
      a.href = `#${id}`;
    }
  });

  const tocSidebar = document.createElement('aside');
  tocSidebar.className = 'article-toc';
  tocSidebar.append(tocHeading, tocList);

  const articleMain = document.createElement('div');
  articleMain.className = 'article-main-col';
  while (dcw.firstChild) articleMain.append(dcw.firstChild);

  const socialPlaceholder = document.createElement('div');
  socialPlaceholder.className = 'article-social-col';

  const sidebarCol = document.createElement('div');
  sidebarCol.className = 'article-sidebar-col';

  const ctaFragment = main.querySelector('.fragment-wrapper .default-content-wrapper h4');
  if (ctaFragment) {
    const fragmentDcw = ctaFragment.closest('.default-content-wrapper');
    const ctaWidget = document.createElement('div');
    ctaWidget.className = 'article-sidebar-cta';
    while (fragmentDcw.firstChild) ctaWidget.append(fragmentDcw.firstChild);
    const ctaBtn = ctaWidget.querySelector('a[href*="download"]');
    if (ctaBtn) {
      ctaBtn.className = 'sidebar-cta-btn';
      const appleIcon = document.createElement('span');
      appleIcon.className = 'cta-icon';
      appleIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>';
      ctaBtn.prepend(appleIcon);
    }
    sidebarCol.append(ctaWidget);
  }

  sidebarCol.append(tocSidebar);
  dcw.append(socialPlaceholder, articleMain, sidebarCol);
  heroSection.classList.add('article-layout');

  const tocItems = [...tocList.querySelectorAll('li')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = h2s.indexOf(entry.target);
        if (idx >= 0) {
          tocItems.forEach((li) => li.classList.remove('active'));
          if (tocItems[idx]) tocItems[idx].classList.add('active');
        }
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  h2s.forEach((h2) => observer.observe(h2));
}

const SOCIAL_ICONS = {
  facebook: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4,5.82 L6,5.82 L6,4.5 C6,3.54 6.29,2.72 6.88,2.03 C7.47,1.34 8.17,1 9,1 L11,1 L11,3.64 L9,3.64 C8.87,3.64 8.76,3.72 8.65,3.89 C8.55,4.06 8.5,4.25 8.5,4.47 L8.5,5.83 L11,5.83 L11,8.51 L8.5,8.51 L8.5,15.02 L6,15.02 L6,8.51 L4,8.51 L4,5.82 Z" fill="currentColor"/></svg>',
  twitter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.4538 5H18.8288L13.6402 10.9303L19.7442 19H14.9648L11.2214 14.1057L6.93812 19H4.56171L10.1114 12.6569L4.25586 5H9.15658L12.5403 9.47354L16.4538 5ZM15.6203 17.5785H16.9363L8.4415 6.34687H7.0293L15.6203 17.5785Z" fill="currentColor"/></svg>',
  linkedin: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2.46,1.47 C2.15,1.78 2,2.16 2,2.6 C2,3.04 2.15,3.42 2.46,3.72 C2.77,4.03 3.15,4.18 3.6,4.18 C4.06,4.18 4.44,4.03 4.76,3.72 C5.07,3.42 5.23,3.04 5.23,2.6 C5.23,2.16 5.07,1.78 4.76,1.47 C4.45,1.16 4.06,1 3.6,1 C3.15,1 2.77,1.16 2.46,1.47 Z M6.2,14 L8.84,14 L8.84,8.32 C9.04,8.14 9.26,7.99 9.5,7.88 C9.7,7.79 9.93,7.73 10.18,7.7 C10.43,7.67 10.69,7.72 10.96,7.86 C11.07,7.89 11.17,7.99 11.27,8.16 C11.36,8.33 11.41,8.47 11.41,8.59 L11.41,14 L14,14 L14,8.59 C14,8.01 13.84,7.44 13.52,6.89 C13.2,6.34 12.77,5.92 12.23,5.63 C11.73,5.39 11.16,5.25 10.53,5.22 C9.9,5.19 9.34,5.3 8.83,5.54 L8.83,5.13 L6.2,5.13 L6.2,14 Z M4.93,14 L4.93,5.13 L2.29,5.13 L2.29,14 L4.93,14 Z" fill="currentColor"/></svg>',
  copylink: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5,7 L11,7 C11.5522847,7 12,7.44771525 12,8 C12,8.55228475 11.5522847,9 11,9 L5,9 C4.44771525,9 4,8.55228475 4,8 C4,7.44771525 4.44771525,7 5,7 Z M6,3 C6.55228475,3 7,3.44771525 7,4 C7,4.55228475 6.55228475,5 6,5 C5.16666667,5 5.16666667,5 5.01568434,4.99987699 C3.3359076,5.02622643 2,6.354044 2,8 C2,9.65685425 3.34314575,11 5,11 L6,11 C6.55228475,11 7,11.4477153 7,12 C7,12.5522847 6.55228475,13 6,13 L5,13 C2.23857625,13 0,10.7614237 0,8 C0,5.25190133 2.2219018,3.04345499 5,3 L6,3 Z M10,3 L11,3 C13.7780982,3.04345499 16,5.25190133 16,8 C16,10.7614237 13.7614237,13 11,13 L10,13 C9.44771525,13 9,12.5522847 9,12 C9,11.4477153 9.44771525,11 10,11 L11,11 C12.6568542,11 14,9.65685425 14,8 C14,6.354044 12.6640924,5.02622643 10.9843157,4.99987699 C10.8333333,5 10.8333333,5 10,5 C9.44771525,5 9,4.55228475 9,4 C9,3.44771525 9.44771525,3 10,3 Z" fill="currentColor"/></svg>',
};

function buildArticleMeta(main) {
  const articleMain = main.querySelector('.article-main-col');
  if (!articleMain) return;

  const children = [...articleMain.children];
  const firstH2 = children.findIndex((el) => el.tagName === 'H2');
  if (firstH2 < 0) return;

  const metaEls = children.slice(0, firstH2);
  if (metaEls.length === 0) return;

  let fbHref = '';
  let twHref = '';
  let liHref = '';
  let writtenBy = '';
  let authorName = '';
  let publishDate = '';

  metaEls.forEach((el) => {
    const link = el.querySelector('a');
    const text = el.textContent.trim();
    if (link?.href?.includes('facebook')) fbHref = link.href;
    else if (link?.href?.includes('twitter')) twHref = link.href;
    else if (link?.href?.includes('linkedin')) liHref = link.href;
    else if (text === 'Written by') writtenBy = text;
    else if (text.startsWith('Published on')) publishDate = text;
    else if (text && text !== 'Copy article link' && text !== 'Link copied'
      && !text.startsWith('[ ]') && text.length > 1 && !link) {
      authorName = text;
    }
    el.remove();
  });

  const metaWrapper = document.createElement('div');
  metaWrapper.className = 'article-meta';

  const socialBar = document.createElement('div');
  socialBar.className = 'article-social';
  const socialData = [
    { icon: 'facebook', href: fbHref },
    { icon: 'twitter', href: twHref },
    { icon: 'linkedin', href: liHref },
    { icon: 'copylink', href: '' },
  ];
  socialData.forEach(({ icon, href }) => {
    const a = document.createElement('a');
    a.className = 'social-icon';
    if (href) {
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = '#';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href);
      });
    }
    a.innerHTML = SOCIAL_ICONS[icon];
    socialBar.append(a);
  });

  const authorArea = document.createElement('div');
  authorArea.className = 'article-author';
  authorArea.innerHTML = `<p class="author-byline">${writtenBy} <span class="author-name">${authorName}</span></p><p class="author-date">${publishDate}</p>`;

  metaWrapper.append(authorArea);
  articleMain.prepend(metaWrapper);

  const socialCol = main.querySelector('.article-social-col');
  if (socialCol) socialCol.append(socialBar);
}

function buildArticleFooter(main) {
  const articleMain = main.querySelector('.article-main-col');
  if (!articleMain) return;

  const children = [...articleMain.children];
  const lastH2Idx = children.findLastIndex((el) => el.tagName === 'H2');
  if (lastH2Idx < 0) return;

  const afterLastH2 = children.slice(lastH2Idx + 1);
  let ctaLink = null;
  let getItFor = null;
  const extraCtas = [];
  let tagsP = null;
  const bottomSocial = [];
  const toRemove = [];

  afterLastH2.forEach((el) => {
    const text = el.textContent.trim();
    const link = el.querySelector('a');
    if (!ctaLink && link && (text.startsWith('Install free') || text.startsWith('Download AVG'))) {
      ctaLink = el;
    } else if (!getItFor && text.startsWith('Get it for')) {
      getItFor = el;
    } else if ((text.startsWith('Install free') || text.startsWith('Download AVG')) && link) {
      extraCtas.push(el);
    } else if (text.startsWith('Get it for') && getItFor) {
      extraCtas.push(el);
    } else if (link && (link.href.includes('tag-desktop') || link.href.includes('tag-mobile'))) {
      tagsP = el;
    } else if (link && (link.href.includes('facebook') || link.href.includes('twitter') || link.href.includes('linkedin'))) {
      bottomSocial.push(el);
    } else if (text === 'Copy article link' || text === 'Link copied' || text === '[ ]') {
      toRemove.push(el);
    }
  });

  extraCtas.forEach((el) => el.remove());
  toRemove.forEach((el) => el.remove());
  bottomSocial.forEach((el) => el.remove());

  if (ctaLink) {
    const link = ctaLink.querySelector('a');
    if (link) {
      link.classList.add('button', 'primary');
      const icon = document.createElement('span');
      icon.className = 'cta-icon';
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>';
      link.prepend(icon);
    }
    ctaLink.classList.add('article-footer-cta');
  }

  if (getItFor) getItFor.classList.add('article-footer-getit');

  const separator = document.createElement('hr');
  separator.className = 'article-footer-sep';

  if (tagsP) {
    tagsP.classList.add('article-footer-tags');
    tagsP.querySelectorAll('a').forEach((a) => a.classList.add('tag-pill'));
  }

  const footerRow = document.createElement('div');
  footerRow.className = 'article-footer-bottom';

  const bottomSocialBar = document.createElement('div');
  bottomSocialBar.className = 'article-footer-social';
  const socialData = [
    { icon: 'facebook', href: bottomSocial[0]?.querySelector('a')?.href || '' },
    { icon: 'twitter', href: bottomSocial[1]?.querySelector('a')?.href || '' },
    { icon: 'linkedin', href: bottomSocial[2]?.querySelector('a')?.href || '' },
    { icon: 'copylink', href: '' },
  ];
  socialData.forEach(({ icon, href }) => {
    const a = document.createElement('a');
    a.className = 'social-icon';
    if (href) { a.href = href; a.target = '_blank'; a.rel = 'noopener'; } else { a.href = '#'; }
    a.innerHTML = SOCIAL_ICONS[icon];
    bottomSocialBar.append(a);
  });

  if (tagsP) footerRow.append(tagsP);
  footerRow.append(bottomSocialBar);

  const insertPoint = getItFor || ctaLink;
  if (insertPoint) insertPoint.after(separator, footerRow);
}

function buildSidebarLayout(main) {
  const sidebarSection = main.querySelector('.section.sidebar');
  if (!sidebarSection) return;

  const sidebarH4 = sidebarSection.querySelector('h4#tags');
  if (!sidebarH4) return;

  const sidebarDCW = sidebarH4.closest('.default-content-wrapper');
  if (!sidebarDCW) return;

  const mainDCW = document.createElement('div');
  mainDCW.className = 'default-content-wrapper';
  const sideDCW = document.createElement('div');
  sideDCW.className = 'default-content-wrapper';

  const dcwChildren = [...sidebarDCW.children];
  let reachedTags = false;
  dcwChildren.forEach((el) => {
    if (el === sidebarH4) reachedTags = true;
    if (reachedTags) {
      sideDCW.append(el);
    } else {
      mainDCW.append(el);
    }
  });

  sidebarDCW.before(mainDCW);
  if (mainDCW.children.length === 0) mainDCW.remove();
  sidebarDCW.replaceWith(sideDCW);

  const mainCol = document.createElement('div');
  mainCol.className = 'blog-main-col';
  const sideCol = document.createElement('div');
  sideCol.className = 'blog-side-col';

  const children = [...sidebarSection.children];
  children.forEach((child) => {
    if (child === sideDCW || child.classList.contains('tabs-sidebar-wrapper')) {
      sideCol.append(child);
    } else if (child.classList.contains('section-metadata-container')) {
      // skip
    } else {
      mainCol.append(child);
    }
  });

  sidebarSection.prepend(mainCol);
  mainCol.after(sideCol);
  sidebarSection.classList.add('blog-layout');
}

function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Removes empty top-level sections that authors may leave behind as content artifacts
 * (e.g. a stray trailing empty paragraph in a Google Doc becomes <div></div>).
 * @param {Element} main The main container element
 */
function removeEmptySections(main) {
  [...main.children].forEach((section) => {
    if (section.tagName !== 'DIV') return;
    if (section.children.length === 0 && section.textContent.trim() === '') {
      section.remove();
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  removeEmptySections(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  wrapArticleCards(main);
  addCategoryIcons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);
  buildSidebarLayout(main);
  buildArticleTocSidebar(main);
  buildArticleMeta(main);
  buildArticleFooter(main);
  addSubtopicHeadings(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
