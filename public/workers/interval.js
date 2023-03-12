/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

// worker to do intervals on different thread

self.onmessage = (e) => {
  if (e.data === 'start') {
    setInterval(() => {
      self.postMessage(Date.now());
    }, 1000);
  }
};
