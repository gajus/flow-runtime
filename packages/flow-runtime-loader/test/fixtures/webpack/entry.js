import {Post} from './types.js.flow';

const value = {
  id: 'post_1',
  title: 'Hello',
  tags: ['flow', 'runtime']
};

Post.assert(value);

export default value;
