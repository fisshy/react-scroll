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

const isPositioned = (element) =>
  getComputedStyle(element).position !== "static";

const getElementOffsetInfoUntil = (element, predicate) => {
  let offsetTop = element.offsetTop;
  let currentOffsetParent = element.offsetParent;

  while (currentOffsetParent && !predicate(currentOffsetParent)) {
    offsetTop += currentOffsetParent.offsetTop;
    currentOffsetParent = currentOffsetParent.offsetParent;
  }

  return { offsetTop, offsetParent: currentOffsetParent };
};

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

    // The offsetParent of an element, according to MDN, is its nearest positioned
    // (an element whose position is anything other than static) ancestor. The offsetTop
    // of an element is taken with respect to its offsetParent which may not neccessarily
    // be its parentElement except the parent itself is positioned.

    // So if containerElement is positioned, then it must be an offsetParent somewhere
    // If it happens that targetElement is a descendant of the containerElement, and there
    // is not intermediate positioned element between the two of them, i.e.
    // targetElement"s offsetParent is the same as the containerElement, then the
    // distance between the two will be the offsetTop of the targetElement.
    // If, on the other hand, there are intermediate positioned elements between the
    // two entities, the distance between the targetElement and the containerElement
    // will be the accumulation of the offsetTop of the element and that of its
    // subsequent offsetParent until the containerElement is reached, since it
    // will also be an offsetParent at some point due to the fact that it is positioned.

    // If the containerElement is not positioned, then it can"t be an offsetParent,
    // which means that the offsetTop of the targetElement would not be with respect to it.
    // However, if the two of them happen to have the same offsetParent, then
    // the distance between them will be the difference between their offsetTop
    // since they are both taken with respect to the same entity.
    // The last resort would be to accumulate their offsetTop until a common
    // offsetParent is reached (usually the document) and taking the difference
    // between the accumulated offsetTops

    if (isPositioned(c)) {
      if (t.offsetTop > c.offsetTop) {
        throw new Error("Element must be a descendant of containerElement");
      }

      if (t.offsetParent !== c) {
        const isContainerElementOrDocument = (e) => e === c || e === document;
        const { offsetTop, offsetParent } = getElementOffsetInfoUntil(
          t,
          isContainerElementOrDocument
        );

        if (offsetParent !== c) {
          throw new Error(
            "Seems containerElement is not an ancestor of the Element"
          );
        }

        return offsetTop;
      }

      return t.offsetTop;
    }

    if (t.offsetParent === c.offsetParent) {
      return t.offsetTop - c.offsetTop;
    }

    const isDocument = (e) => e === document;
    return (
      getElementOffsetInfoUntil(t, isDocument).offsetTop -
      getElementOffsetInfoUntil(c, isDocument).offsetTop
    );
  }
};

export default {
  updateHash,
  getHash,
  filterElementInContainer,
  scrollOffset,
};
