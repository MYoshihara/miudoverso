const tabList = document.querySelector('[data-profile-tabs]');

if (tabList) {
  const tabs = Array.from(tabList.querySelectorAll('a'), link => ({
    link,
    panel: document.getElementById(link.hash.slice(1))
  }));

  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Seções do perfil profissional');
  for (const { link, panel } of tabs) {
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', link.id);
    panel.tabIndex = 0;
  }

  function showTab(activeTab) {
    for (const tab of tabs) {
      const selected = tab === activeTab;
      tab.link.setAttribute('aria-selected', String(selected));
      tab.link.tabIndex = selected ? 0 : -1;
      tab.panel.hidden = !selected;
    }
  }

  function openTab(tab) {
    if (location.hash !== tab.link.hash) history.pushState(null, '', tab.link.hash);
    showTab(tab);
  }

  function followHash(initial = false) {
    const target = document.getElementById(location.hash.slice(1));
    const tab = tabs.find(entry => entry.panel.contains(target));
    if (tab) {
      const revealed = tab.panel.hidden;
      showTab(tab);
      if (revealed && target !== tab.panel) target.focus({ preventScroll: true });
      if (revealed || (initial && target !== tab.panel)) target.scrollIntoView();
    } else if (initial || !location.hash) {
      showTab(tabs[0]);
    }
  }

  for (const [index, tab] of tabs.entries()) {
    tab.link.addEventListener('click', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      openTab(tab);
    });

    tab.link.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const nextIndex = {
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
        ' ': index
      }[event.key];
      if (nextIndex === undefined) return;
      event.preventDefault();
      const next = tabs[nextIndex];
      openTab(next);
      next.link.focus({ preventScroll: true });
    });
  }

  followHash(true);
  window.addEventListener('hashchange', () => followHash());
}
