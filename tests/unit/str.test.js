import { Validator } from "../../app/http/validators/Validator.js";
import { Str } from "../../app/supports/Str.js";
import { faker } from "@faker-js/faker";

describe("when use str", () => {
  it("can create slug", () => {
    const titles = [
      "Elegant Frozen Towels",
      "Fantastic Wooden Table",
      "Generic Metal Computer",
      "Gorgeous Plastic Chair",
      "Sleek Metal Computer",
      "Gorgeous Frozen Tuna",
      "Incredible Fresh Gloves",
      "Small Fresh Mouse",
      "Oriental Fresh Chair",
      "Handcrafted Rubber Bacon",
      "Ergonomic Steel Bacon",
      "Unbranded Wooden Sausage",
      "Rustic Cotton Pizza",
      "Sleek Concrete Soap",
      "Incredible Cotton Gloves",
      "Exportação de _ peças - avícolas para Você",
      "Café é o combustível para programação!!",
    ];

    const slugs = [
      "elegant-frozen-towels",
      "fantastic-wooden-table",
      "generic-metal-computer",
      "gorgeous-plastic-chair",
      "sleek-metal-computer",
      "gorgeous-frozen-tuna",
      "incredible-fresh-gloves",
      "small-fresh-mouse",
      "oriental-fresh-chair",
      "handcrafted-rubber-bacon",
      "ergonomic-steel-bacon",
      "unbranded-wooden-sausage",
      "rustic-cotton-pizza",
      "sleek-concrete-soap",
      "incredible-cotton-gloves",
      "exportacao-de-pecas-avicolas-para-voce",
      "cafe-e-o-combustivel-para-programacao",
    ];

    for (let index = 0; index < titles.length; index++) {
      const title = titles[index];
      const slug = slugs[index];

      const result = Str.slug(title);

      expect(typeof result).toBe("string");
      expect(result).toEqual(slug);
    }
  });

  it("can create randomAlpha", () => {
    const length = faker.number.int({ min: 1, max: 16 });
    const result = Str.randomAlpha(length);

    expect(typeof result).toBe("string");
    expect(result.length).toBe(length);
  });

  it("can create randomAlphaNumeric", () => {
    const length = faker.number.int({ min: 1, max: 16 });
    const result = Str.randomAlphaNumeric(length);

    expect(typeof result).toBe("string");
    expect(result.length).toBe(length);
  });

  it("can create randomString", () => {
    const length = faker.number.int({ min: 1, max: 16 });
    const result = Str.randomString(length);

    expect(typeof result).toBe("string");
    expect(result.length).toBe(length);
  });

  it("can create uuid", () => {
    const result = Str.uuid();
    const { value, error } = new Validator().joi
      .string()
      .uuid()
      .required()
      .validate(result);

    expect(typeof value).toBe("string");
    expect(error).toBeUndefined();
  });
});
