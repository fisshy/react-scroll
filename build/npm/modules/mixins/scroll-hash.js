'use strict';

var addPassiveEventListener = require('./passive-event-listeners');
var utils = require('./utils');

var scrollHash = {
  mountFlag: false,
  initialized: false,
  scroller: null,

  mount: function mount(scroller) {
    this.scroller = scroller;

    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange);

    this.initStateFromHash();
    this.mountFlag = true;
  },
  isMounted: function isMounted() {
    return this.mountFlag;
  },
  isInitialized: function isInitialized() {
    return this.initialized;
  },
  initStateFromHash: function initStateFromHash() {
    var hash = this.getHash();
    if (hash) {
      // time to all component Elements can registered in componentDidMount phase
      window.setTimeout(function () {
        this.scrollTo(hash, true);
        this.initialized = true;
      }.bind(this), 10);
    } else {
      this.initialized = true;
    }
  },
  scrollTo: function scrollTo(to, isInit) {
    var scroller = this.scroller;
    var element = scroller.get(to);
    if (element && (isInit || to !== scroller.getActiveLink())) {
      var container = utils.getScrollParent(element);
      // scroller.setActiveLink(to);
      scroller.scrollTo(to, { container: container });
    }
  },
  getHash: function getHash() {
    return utils.getHash();
  },
  changeHash: function changeHash(to) {
    if (this.isInitialized()) {
      utils.pushHash(to);
    }
  },
  handleHashChange: function handleHashChange() {
    this.scrollTo(this.getHash());
  },


  // todo - think about when unmount? (it can work without Links, while any element with id exists)
  unmount: function unmount() {
    this.scroller = null;
    window.removeEventListener('hashchange', this.handleHashChange);
  }
};

module.exports = scrollHash;