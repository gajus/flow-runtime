const t = {
  array: type => ({assert: value => value, type}),
  property: (key, type) => ({key, type}),
  string: () => 'string',
  type: (name, body) => ({
    assert: value => value,
    body,
    name
  })
};

export default t;
