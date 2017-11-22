const getScrollParent = (element, includeHidden) => {
  let style = getComputedStyle(element);
  let excludeStaticParent = style.position === "absolute";
  let overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (style.position === "fixed") {
    return document;
  }
  for (let parent = element; (parent = parent.parentElement);) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow)) {
      return parent;
    }
  }

  return document;
}

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

module.exports = {
  getScrollParent,
  pushHash,
  getHash,
  filterElementInContainer
};