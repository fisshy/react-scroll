const pushHash = hash => {
  hash = hash ? (hash.indexOf("#") === 0 ? hash : "#" + hash) : "";

  if (history.pushState) {
    let loc = window.location;
    history.pushState(
      null,
      null,
      hash
        ? loc.pathname + loc.search + hash
        : // remove hash
          loc.pathname + loc.search
    );
  } else {
    location.hash = hash;
  }
};

const getHash = () => {
  return window.location.hash.replace(/^#/, "");
};

const filterElementInContainer = container => element =>
  container.contains
    ? container != element && container.contains(element)
    : !!(container.compareDocumentPosition(element) & 16);

const scrollOffset = (c, t) => {
  return c === document
    ? t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
    : getComputedStyle(c).position !== "static"
    ? t.offsetTop
    : t.offsetTop - c.offsetTop;
};
export default {
  pushHash,
  getHash,
  filterElementInContainer,
  scrollOffset
};
