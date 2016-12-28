# Type Inference

`flow-runtime` can infer types from JavaScript values. These types can then be inspected just like any other:

```js

import t from 'flow-runtime';

const input = {
  id: 123,
  name: 'Sally',
  addresses: [
    {
      line1: '123 Fake Street',
      isActive: true
    }
  ]
};

const inputType = t.typeOf(input);

console.log(String(inputType));
// {
//   id: number;
//   name: string;
//   addresses: Array<{
//     line1: string;
//     isActive: boolean;
//   }>;
// }


inputType.getProperty('id').assert(456); // ok
inputType.getProperty('name').assert(false); // throws
```