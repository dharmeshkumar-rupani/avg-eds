import { toClassName } from '../../scripts/aem.js';

const TAB_ICONS = {
  security: '<svg viewBox="0 0 20 20"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 2l8 2.3c.1 5-.4 8.4-1.5 10.2-.5.9-1.3 1.6-2.2 2.3-.8.5-2.2 1.3-4.2 2.2-2-.9-3.5-1.7-4.3-2.2-1-.6-1.7-1.4-2.2-2.3C2.5 12.7 2 9.3 2 4.3L10 2z"/></svg>',
  privacy: '<svg viewBox="0 0 20 20"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 1c1.1 0 2.1.4 2.9 1.1.8.7 1.1 1.5 1.2 2.5V7H5.9V4.5c0-1 .5-1.8 1.2-2.5C7.9 1.4 8.9 1 10 1zM6.7 7.6c.3-.3.5-.5.8-.7M13.5 6.9c.3.2.6.4.9.7 1 1 1.5 2.1 1.5 3.5V13c0 1.3-.5 2.5-1.5 3.5-.9.9-2.1 1.4-3.4 1.4h-2c-1.3 0-2.4-.5-3.4-1.4-1-1-1.5-2.1-1.5-3.5v-1.8c0-1.3.4-2.5 1.4-3.5"/></svg>',
  performance: '<svg viewBox="0 0 20 20"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 10.8c0-2.6-.9-4.8-2.6-6.5C13.6 2.5 11.5 1.5 9 1.5S4.4 2.5 2.6 4.3C.9 6 0 8.2 0 10.8c0 2.5.9 4.7 2.6 6.5 1.8 1.8 4 2.7 6.4 2.7s4.6-.9 6.4-2.7c1.7-1.8 2.6-4 2.6-6.5z" transform="translate(1 -1)"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.4 10.8c0-1.6.6-3 1.7-4.1C6.2 5.5 7.6 4.9 9 4.9s2.8.6 3.9 1.8c1.1 1.1 1.7 2.5 1.7 4.1" transform="translate(1 -1)"/><line x1="16" y1="6" x2="11" y2="10" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>',
};

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-sidebar-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);
    const name = tab.textContent.trim().toLowerCase();

    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-sidebar-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-sidebar-tab';
    button.id = `tab-${id}`;

    if (TAB_ICONS[name]) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'tab-icon';
      iconSpan.innerHTML = TAB_ICONS[name];
      button.append(iconSpan);
    }

    const label = document.createElement('span');
    label.textContent = tab.textContent.trim();
    button.append(label);

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}
