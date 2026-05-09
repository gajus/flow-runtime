// istanbul ignore next
try {
  (new Function('var a = (args) => true; var b = []; b.push(...b);'))();
  console.log('Using modern ES environment.');
  require("@babel/register")();
}
catch (e) {
  console.log('Using legacy ES environment.');
  // Legacy environment.
  require("@babel/register");
}
