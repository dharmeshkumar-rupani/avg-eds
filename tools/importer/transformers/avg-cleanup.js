/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AVG site-wide cleanup.
 * Removes non-authorable content (navigation, footer, cookie consent, modals, etc.)
 * All selectors verified from captured DOM across homepage, blog-article, and blog-homepage templates.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent mini bar (found across all templates: <div id="cheqMini">)
    // Cookie consent modal dialog (found across all templates: <dialog id="ensModalWrapper">)
    // Cookie dev tools (found on homepage: <div id="cheq-dev">)
    // Cookie bar (found on blog templates: <div class="js-cookie-bar cookie-bar visible">)
    // Image lightbox modal (found on blog-article: <div id="modal"> with id="closeimg" and id="modal-image")
    // Language selector modal (found on homepage: <div class="language-selector modal fade" id="language-selector">)
    WebImporter.DOMUtils.remove(element, [
      '#cheqMini',
      '#ensModalWrapper',
      '#cheq-dev',
      '.js-cookie-bar',
      'div#modal',
      '.language-selector.modal',
    ]);
  }

  if (hookName === H.after) {
    // === Homepage navigation and chrome ===
    // Promo message bar (found on homepage: <section class="message-bar green-rebranding">)
    // Main navigation (found on homepage: <nav id="menu" class="navigation global-navigation">)
    // Sticky download bars (found on homepage: <div class="sticky-bar is-sticky">)
    // Header parsys (found on homepage: <div class="header-parsys">)

    // === Blog header/navigation ===
    // Blog header (found on blog-article and blog-homepage: <div class="header header-hidden-desktop" id="main-header-new">)
    // Breadcrumb navigation (found on blog-article: <div class="container breadcrumb-container">)

    // === Footer areas ===
    // Bottom/footer container (found across all templates: <div id="bottom">)
    // Blog footer (found on blog templates: <div id="footer-signal-v2">)
    // Social connect (found on blog-article: <div class="social-connect">)

    // === Hidden data elements ===
    // Hidden SDL ID (found on blog templates: <div class="hide" id="sdl-id">)
    // Hidden metadata divs (found on blog-article: hub-dl, category-dl, author-dl, date-dl)

    WebImporter.DOMUtils.remove(element, [
      '.message-bar',
      'nav#menu',
      '.sticky-bar',
      '.header-parsys',
      '#main-header-new',
      '.breadcrumb-container',
      '#bottom',
      '#footer-signal-v2',
      '.social-connect',
      '#sdl-id',
      '#hub-dl',
      '#category-dl',
      '#author-dl',
      '#date-dl',
    ]);
  }
}
