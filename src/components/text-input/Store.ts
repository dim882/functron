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
    console.log('setting ', property);

    return true;
  },
});

export default proxyStore;
