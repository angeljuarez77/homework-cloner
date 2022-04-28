#! ./node_modules/.bin/ts-node
import HomeworkCloner from "./src/HomeworkCloner.js";

const hwCloner = new HomeworkCloner();

await hwCloner.run();