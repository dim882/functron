const Store = {
  firstname: '',
  lastname: '',
};

const proxyStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;

    return true;
  },
});
