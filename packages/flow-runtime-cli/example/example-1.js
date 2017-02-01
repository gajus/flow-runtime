/* @flow */

function get (store: Storage, key: string) {
  return store.getItem(key);
}

get(localStorage, 'foo');