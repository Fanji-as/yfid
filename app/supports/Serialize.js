import serialize from "serialize-javascript";

export class Serialize {
  /**
   * @param {any} value
   * @param {import("serialize-javascript").SerializeJSOptions | number | string} options
   */
  static serialize(value, options = {}) {
    return serialize(value, options);
  }

  /**
   * @param {string} serialized
   */
  static deserialize(serialized) {
    return eval("(" + serialized + ")");
  }
}
