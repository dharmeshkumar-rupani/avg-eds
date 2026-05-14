/**
 * Section Metadata block — reads key/value pairs from the authored table
 * and applies them to the parent section element.
 *
 * Supported keys:
 *   style  — space-separated class names added to the section
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (!section) return;

  const meta = {};
  [...block.children].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase();
    const value = row.children[1]?.textContent?.trim();
    if (key && value) meta[key] = value;
  });

  if (meta.style) {
    meta.style.split(/\s+/).forEach((cls) => section.classList.add(cls));
  }

  // hide the metadata table
  block.closest('.section-metadata-wrapper')?.remove();
}
