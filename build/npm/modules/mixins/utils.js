"use strict";

function getScrollParent(element, includeHidden) {
  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === "absolute";
  var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (style.position === "fixed") {
    return document;
  }
  for (var parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }

  return document;
}

function pushHash(hash) {
  hash = hash ? hash.indexOf('#') === 0 ? hash : '#' + hash : '';

  if (history.pushState) {
    var loc = window.location;
    history.pushState(null, null, hash ? hash
    // remove hash
    : loc.pathname + loc.search);
  } else {
    location.hash = hash;
  }
}

function getHash() {
  return window.location.hash.replace(/^#/, '');
}

module.exports = {
  getScrollParent: getScrollParent,
  pushHash: pushHash,
  getHash: getHash
};