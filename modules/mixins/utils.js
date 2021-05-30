const updateHash = (hash, historyUpdate) => {
  const hashVal = hash.indexOf("#") === 0 ? hash.substring(1) : hash;
  const hashToUpdate = hashVal ? `#${hashVal}` : "";
  const curLoc = window && window.location;
  const urlToPush = hashToUpdate
    ? curLoc.pathname + curLoc.search + hashToUpdate
    : curLoc.pathname + curLoc.search;
  historyUpdate
    ? history.pushState(null, "", urlToPush)
    : history.replaceState(null, "", urlToPush);
};

const getHash = () => {
  return window.location.hash.replace(/^#/, "");
};

const filterElementInContainer = (container) => (element) =>
  container.contains
    ? container != element && container.contains(element)
    : !!(container.compareDocumentPosition(element) & 16);

const scrollOffset = (c, t, horizontal) => {
  if (horizontal) {
    return c === document
      ? t.getBoundingClientRect().left + (window.scrollX || window.pageXOffset)
      : getComputedStyle(c).position !== "static"
      ? t.offsetLeft
      : t.offsetLeft - c.offsetLeft;
  } else {
    if (c === document) {
      return (
        t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
      );
    }

    let parent = t.offsetParent;
    let tOffsetTop = t.offsetTop;
    let cOffsetTop = 0;

    while (parent != c && parent !== document) {
      tOffsetTop += parent.offsetTop;
      cOffsetTop += parent.offsetTop;
      parent = parent.offsetParent;
    }

    return getComputedStyle(c).position !== "static"
      ? tOffsetTop
      : tOffsetTop - cOffsetTop;
  }
};
export default {
  updateHash,
  getHash,
  filterElementInContainer,
  scrollOffset,
};
