const pushHash = (hash) => {
  hash = hash
    ? hash.indexOf('#') === 0
      ? hash
      : '#' + hash
    : '';

  if(history.pushState) {
    let loc = window.location;
    history.pushState(null, null, hash ? loc.pathname + loc.search + hash
      // remove hash
      : loc.pathname + loc.search);
  } else {
    location.hash = hash;
  }
}

const  getHash = () => {
  return window.location.hash.replace(/^#/, '');
}

const filterElementInContainer = (container) => (element) => container.contains ? container != element && container.contains(element) : !!(container.compareDocumentPosition(element) & 16)

const calculatingOffsetParent = (c, t) =>
  t.offsetParent.isEqualNode(c) ? t.offsetTop : t.offsetTop + calculatingOffsetParent(c, t.offsetParent);

const scrollOffset = (c, t) => c === document || c === document.body || c === document.documentElement ?
  t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) : getComputedStyle(c).position === 'static' ? calculatingOffsetParent(c.offsetParent, t.offsetParent) - c.offsetTop : calculatingOffsetParent(c, t);

export default {
  pushHash,
  getHash,
  filterElementInContainer,
  scrollOffset
};
