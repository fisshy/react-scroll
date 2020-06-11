const updateHash = (hash, historyUpdate) => {
  const hashVal = hash.indexOf("#") === 0 ? hash.substring(1) : hash
  const hashToUpdate = hashVal ? `#${hashVal}` : '';
  const curLoc = window && window.location;
  const urlToPush = hashToUpdate ? (curLoc.pathname + curLoc.search + hashToUpdate) : (curLoc.pathname + curLoc.search)
  historyUpdate ? (history.pushState(
    null,
    '',
    urlToPush)) : (history.replaceState(
      null,
      '',
      urlToPush));

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
  updateHash,
  getHash,
  filterElementInContainer,
  scrollOffset
};
