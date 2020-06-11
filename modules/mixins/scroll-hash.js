import { addPassiveEventListener } from './passive-event-listeners';
import utils from './utils';

const scrollHash = {
  mountFlag: false,
  initialized: false,
  scroller: null,
  containers: {},

  mount(scroller) {
    this.scroller = scroller;

    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange);

    this.initStateFromHash();
    this.mountFlag = true;
  },

  mapContainer(to, container) {
    this.containers[to] = container;
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
      let container = this.containers[to] || document;
      scroller.scrollTo(to, { container });
    }
  },

  getHash() {
    return utils.getHash();
  },

  changeHash(to, saveHashHistory) {
    if (this.isInitialized() && utils.getHash() !== to) {
      utils.updateHash(to, saveHashHistory);
    }
  },

  handleHashChange() {
    this.scrollTo(this.getHash());
  },

  unmount() {
    this.scroller = null;
    this.containers = null;
    window.removeEventListener('hashchange', this.handleHashChange);
  },
};

export default scrollHash;
