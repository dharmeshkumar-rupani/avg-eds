import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  footer.querySelectorAll(':scope > meta, :scope > link, :scope > script, :scope > style').forEach((el) => el.remove());
  footer.querySelectorAll('meta, link[rel="stylesheet"], link[rel="preconnect"], script').forEach((el) => el.remove());

  block.append(footer);
}
