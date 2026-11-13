(() => {
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  const player = document.querySelector('.player');
  const video = player.querySelector('video');
  const small = window.matchMedia('(max-width: 900px)').matches || (navigator.connection && navigator.connection.saveData);
  const src = small ? video.dataset.small : video.dataset.large;
  const play = () => {
    if (!video.getAttribute('src')) video.setAttribute('src', src);
    video.controls = true;
    player.classList.add('playing');
    video.play().catch(() => null);
  };
  player.querySelector('.play').addEventListener('click', play);
  document.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => {
    document.getElementById('film').scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(play, 450);
  }));

  const tabsets = document.querySelectorAll('[data-tabs]');
  tabsets.forEach((set) => {
    const buttons = set.querySelectorAll('[role="tab"]');
    buttons.forEach((b, i) => b.addEventListener('click', () => {
      buttons.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      const target = document.getElementById(set.dataset.tabs);
      if (set.dataset.kind === 'image') {
        const img = target.querySelector('img');
        img.src = b.dataset.src;
        img.alt = b.dataset.alt;
        target.querySelector('.screen-bar span').textContent = b.dataset.url;
        document.getElementById(set.dataset.tabs + '-cap').textContent = b.dataset.cap;
      } else {
        target.querySelectorAll('[role="tabpanel"]').forEach((p, j) => { p.hidden = j !== i; });
      }
    }));
  });

  document.querySelectorAll('.copy').forEach((btn) => btn.addEventListener('click', async () => {
    const panel = btn.closest('.code-body').querySelector('[role="tabpanel"]:not([hidden]) pre') || btn.closest('.code-body').querySelector('pre');
    const text = panel.innerText.split('\n').filter((l) => !l.trim().startsWith('#')).join('\n').trim();
    try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; } catch (e) { btn.textContent = 'Select and copy'; }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
  }));

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }
})();
