const ICONS = {
  security: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="45" height="45"><path fill="none" fill-rule="evenodd" stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" d="M9 8.4v5.362c0 3.35 1.191 6.106 3.5 8.266 1.191 1.117 2.309 1.861 3.5 2.308l1.117-.521c.894-.521 1.638-1.117 2.383-1.787 2.309-2.16 3.5-4.915 3.5-8.266V8.4H9z"/></svg>',
  privacy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="45" height="45"><path fill="none" fill-rule="evenodd" stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" d="M10.9 15.7c.3-.3.5-.5.8-.7v-1c0-1.2.5-2.3 1.4-3.2.8-.9 1.9-1.3 3.1-1.3 1.2 0 2.3.4 3.1 1.3.9.9 1.3 2 1.3 3.2v1c.3.2.6.4.9.7 1 1 1.5 2.1 1.5 3.5V21c0 1.3-.5 2.5-1.5 3.5-.9.9-2.1 1.4-3.4 1.4h-3.7c-1.3 0-2.4-.5-3.4-1.4-1-1-1.5-2.1-1.5-3.5v-1.8c0-1.3.4-2.5 1.4-3.5zm9.9-7.5c-1.3-1.3-2.9-2-4.8-2s-3.6.7-4.9 2m.599 6.8c.8-.5 1.6-.8 2.6-.8h3.7c1 0 1.8.2 2.6.8M22.9 6.2C21 4.3 18.7 3.3 16 3.3s-5 1-6.9 2.9"/></svg>',
  performance: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="45" height="45"><g fill="none" fill-rule="evenodd" transform="translate(6 6)"><path stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" d="M.4 9.8C.4 7.2 1.3 5 3 3.3 4.8 1.5 7 .5 9.6.5c2.6 0 4.8.9 6.5 2.8 1.8 1.8 2.7 4 2.7 6.5s-.9 4.7-2.7 6.5c-1.8 1.8-4 2.7-6.5 2.7-2.6 0-4.8-.9-6.6-2.7-1.7-1.8-2.6-4-2.6-6.5zm3.4 0c0-1.6.6-3 1.7-4.1C6.6 4.5 8 3.9 9.6 3.9c1.6 0 3 .6 4.1 1.8 1.1 1.1 1.7 2.5 1.7 4.1"/><g><path stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" d="M7.1 0.8L1.7 4.8" transform="translate(8 5)"/><g><path stroke="#1E222A" stroke-linecap="round" stroke-linejoin="round" d="M2 1.2c-.1.1-.2.2-.4.2s-.4-.1-.5-.2C1 1.1.9.9.9.7s.1-.3.2-.5.3-.2.5-.2.4.1.4.2c.1.1.2.3.2.5 0 .3 0 .4-.2.5z" transform="translate(8 5) translate(0 4)"/></g></g></g></svg>',
};

export default async function decorate(block) {
  const columns = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'tabs-category-grid';

  columns.forEach((col) => {
    const card = document.createElement('div');
    card.className = 'tabs-category-card';

    const heading = col.firstElementChild;
    const links = col.lastElementChild;
    const name = heading.textContent.trim().toLowerCase();

    const h3 = document.createElement('h3');
    if (ICONS[name]) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'tabs-category-icon';
      iconSpan.innerHTML = ICONS[name];
      h3.append(iconSpan);
    }
    h3.append(document.createTextNode(heading.textContent.trim()));
    card.append(h3);

    const linkList = document.createElement('div');
    linkList.className = 'tabs-category-links';
    while (links.firstElementChild) linkList.append(links.firstElementChild);
    card.append(linkList);

    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
