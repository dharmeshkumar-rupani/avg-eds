/*
 * Embed Reviews Block
 * Embeds third-party review widgets (e.g., Trustpilot) directly on the page.
 */

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedTrustpilot = (url) => {
  // Extract height from URL params or hash, default to 240px
  const hashParams = new URLSearchParams(url.hash.replace('#', ''));
  const height = hashParams.get('styleHeight') || '240px';

  return `<div class="embed-reviews-trustpilot">
    <iframe src="${url.href}" style="border: 0; width: 100%; height: ${height}; display: block; overflow: hidden;"
      scrolling="no" allow="encrypted-media" title="Customer reviews powered by Trustpilot" loading="lazy">
    </iframe>
  </div>`;
};

const loadEmbed = (block, link) => {
  if (block.classList.contains('embed-reviews-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['trustpilot'],
      embed: embedTrustpilot,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url);
    block.classList.add(`embed-reviews-${config.match[0]}`);
  } else {
    block.innerHTML = getDefaultEmbed(url);
  }
  block.classList.add('embed-reviews-is-loaded');
};

export default function decorate(block) {
  const link = block.querySelector('a')?.href;
  if (!link) return;

  block.textContent = '';

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, link);
    }
  });
  observer.observe(block);
}
