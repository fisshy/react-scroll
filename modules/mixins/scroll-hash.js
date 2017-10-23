const addPassiveEventListener = require('./passive-event-listeners');
const utils = require('./utils');

const scrollHash = {
  mountFlag: false,
  initialized: false,
  scroller: null,

  mount(scroller) {
    this.scroller = scroller;

    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange);

    this.initStateFromHash();
    this.mountFlag = true;
  },

  isMounted() {
    return this.mountFlag;
  },

  isInitialized() {
    return this.initialized;
  },

  initStateFromHash() {
    let hash = this.getHash();
    if (hash) {
      // time to all component Elements can registered in componentDidMount phase
      window.setTimeout(() => {
        this.scrollTo(hash, true);
        this.initialized = true;
      }, 10);
    } else {
      this.initialized = true;
    }
  },

  scrollTo(to, isInit) {
    let scroller = this.scroller;
    let element = scroller.get(to);
    if (element && (isInit || to !== scroller.getActiveLink())) {
      let container = utils.getScrollParent(element);
      // scroller.setActiveLink(to);
      scroller.scrollTo(to, { container });
    }
  },

  getHash() {
    return utils.getHash();
  },

  changeHash(to) {
    if (this.isInitialized()) {
      utils.pushHash(to);
    }
  },

  handleHashChange() {
    this.scrollTo(this.getHash());
  },

  // todo - think about when unmount? (it can work without Links, while any element with id exists)
  unmount() {
    this.scroller = null;
    window.removeEventListener('hashchange', this.handleHashChange);
  },
};

module.exports = scrollHash;
