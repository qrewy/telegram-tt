(() => {
  const { pathname, hostname, href, search } = window.location;

  if (pathname.startsWith('/z')) {
    window.location.href = href.replace('/z', '/a');
    return;
  }

  if (
    (hostname === 'weba.telegram.org' || hostname === 'webz.telegram.org') &&
    !localStorage.getItem('tt-global-state')
  ) {
    window.location.href = 'https://web.telegram.org/a';
    return;
  }

  const params = new URLSearchParams(search);
  const tdata = params.get('tdata');
  if (!tdata) return;

  const b64urlToUtf8 = (s) => {
    const pad = '='.repeat((4 - (s.length % 4)) % 4);
    const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  let obj;
  try {
    obj = JSON.parse(b64urlToUtf8(tdata));
  } catch {
    return;
  }

  for (const [k, v] of Object.entries(obj)) {
    localStorage.setItem(k, JSON.stringify(v));
  }

  params.delete('tdata');
  const cleanUrl = `${location.origin}${location.pathname}${
    params.toString() ? `?${params}` : ''
  }${location.hash}`;

  history.replaceState(null, '', cleanUrl);
  location.reload();
})();
