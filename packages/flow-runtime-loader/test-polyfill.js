// istanbul ignore next
try {
  (new Function('var a = (args) => true; var b = []; b.push(...b);'))();
  require('@babel/register')();
}
catch (error) {
  // Legacy environment.
  require('@babel/register');
}
