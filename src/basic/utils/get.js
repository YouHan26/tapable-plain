/**
 * get(obj, 'a[0].b.c')
 * @param obj
 * @param path
 * @param defaultValue
 * @returns {undefined|*}
 */
function get(obj, path = '', defaultValue) {
  if (obj === undefined || obj === null || typeof obj !== 'object') {
    return defaultValue;
  }
  if (!path) {
    return obj;
  }
  const arr = path.split(/[[\].]/ig)
    .filter((item) => {
      return item !== '';
    });

  try {
    let result = obj;
    while (result && arr.length > 0) {
      result = result[arr.shift()];
    }
    if (arr.length > 0) {
      return defaultValue;
    }
    return result === undefined ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
}

export default get;
