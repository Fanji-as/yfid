import { faker } from "@faker-js/faker";

export class Str {
  /**
   * @param {string} title
   */
  static slug(title, separator = "-") {
    return title
      .normalize("NFD") // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, separator);
  }

  static randomAlpha(length = 16) {
    return faker.string.alpha({ length });
  }

  static randomAlphaNumeric(length = 16) {
    return faker.string.alphanumeric({ length });
  }

  static randomString(length = 16) {
    return faker.string.sample(length);
  }

  static uuid() {
    return faker.string.uuid();
  }

  /**
   * @param {string} str
   * @param {string} key
   * @param {string} value
   *
   * @see https://github.com/GrafiteInc/Helpers/blob/main/src/strings.js#L116
   */
  static replaceFirst(str, key, value) {
    let location = str.indexOf(key);

    return (
      str.valueOf().substring(0, location) +
      value +
      str.valueOf().substring(location + key.length)
    );
  }

  /**
   * @param {string} str
   * @param {string} key
   * @param {string} value
   *
   * @see https://github.com/GrafiteInc/Helpers/blob/main/src/strings.js#L124
   */
  static replaceLast(str, key, value) {
    let location = str.lastIndexOf(key);

    return (
      str.valueOf().substring(0, location) +
      value +
      str.valueOf().substring(location + key.length)
    );
  }

  /**
   * @param {{ [key: string]: string }} object
   * @param {string} separator
   * @param {string} join
   */
  static createQueryParams(object, separator = "&", join = "=") {
    return Object.keys(object)
      .filter(key => object[key] !== undefined)
      .map(key => `${key}${join}${object[key]}`)
      .join(separator);
  }
}
