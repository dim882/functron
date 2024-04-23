const Store = {
  firstname: '',
  lastname: '',
};

const proxyStore = new Proxy(Store, {
  get(target, property) {
    return target[property];
  },

  set(target, property, value) {
    target[property] = value;

    return true;
  },
});

export default proxyStore;
