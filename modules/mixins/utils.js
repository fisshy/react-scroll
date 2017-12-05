const pushHash = (hash) => {
  hash = hash
    ? hash.indexOf('#') === 0
      ? hash
      : '#' + hash
    : '';

  if(history.pushState) {
    let loc = window.location;
    history.pushState(null, null, hash
      ? hash
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

const scrollOffset = (c, t) => c === document ? 
      t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) : getComputedStyle(c).position === "relative" ? t.offsetTop : (t.offsetTop - c.offsetTop)

export default {
  pushHash,
  getHash,
  filterElementInContainer,
  scrollOffset
};