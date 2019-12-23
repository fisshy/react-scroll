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

const scrollOffset = (c, t) => c === document ?
  t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) : getComputedStyle(c).position !== 'static' ? calculatingOffsetParent(c, t) : calculatingOffsetParent(c.offsetParent, t.offsetParent) - c.offsetTop;

export default {
  pushHash,
  getHash,
  filterElementInContainer,
  scrollOffset
};
