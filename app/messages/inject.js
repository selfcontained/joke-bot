/**
 * Injects values into a string
 *
 * Examples:
 * inject('{.foo}stool', { foo: 'bar' }); // returns 'barstool'
 * inject('div { height: {.0}px; width: {.0}px; padding: {.length}px; }', [10]); // returns 'div { height: 10px; width: 10px; padding: 1px; }'
 * inject('{.dir}\\{.file}', { dir: '~', file: 'index.htm' }); // returns '~\index.htm'
 * inject('{.dir}{\\.file}', { dir: '~', file: 'index.htm' }); // returns '~{.file}'
 *
 * @param str {String} The string to receive injections
 * @param obj {Object|Array} An object or an array with the values to inject
 * @returns {String} The injected string
 */
module.exports = function (str, obj) {
  return str.replace(/\{(\\|)\.([^{}]+)\}/g, function (a, b, c) {
    return b ? '{' + a.substr(2) : (c in obj ? obj[c] : a)
  })
}
