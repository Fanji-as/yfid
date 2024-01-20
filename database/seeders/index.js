import { model } from "../../app/models/index.js";

try {
  //
} catch (error) {
  console.error(error);

  process.exit(1);
} finally {
  await model.$disconnect();
}
