/* @flow */

export default function shouldIgnoreType (name: string): boolean {
  switch (name) {
    case 'Array':
    case 'Date':
    case 'Map':
    case 'Set':
    case 'Promise':
    case 'Object':
    case 'Function':
      return true;
    default:
      return false;
  }
}