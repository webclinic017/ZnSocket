import { createClient, Dict } from "znsocket";

let client;
let dct;

beforeEach(async () => {
  client = createClient({ url: process.env.ZNSOCKET_URL });
  client.on("error", (err) => console.error("Redis Client Error", err));
  await client.connect();
  dct = new Dict({ client: client, key: "dict:test" });
});

afterEach(async () => {
  await client.disconnect();
});

test("test_dict_keys_single_znsocket", async () => {
  expect(await dct.keys()).toEqual(["a"]);
});

test("test_dict_keys_multiple_znsocket", async () => {
  expect(await dct.keys()).toEqual(["a", "c"]);
});

test("test_dict_values_single_znsocket", async () => {
  expect(await dct.values()).toEqual(["string"]);
});

test("test_dict_values_multiple_znsocket", async () => {
  expect(await dct.values()).toEqual([{ lorem: "ipsum" }, 25]);
});

test("test_dict_entries_znsocket", async () => {
  expect(await dct.entries()).toEqual([["a", { lorem: "ipsum" }], ["b", 25]]);
});

test("test_dict_get_znsocket", async () => {
  expect(await dct.get("b")).toBe(25);
  expect(await dct.get("a")).toEqual({ lorem: "ipsum" });
});

test("test_dict_set_znsocket", async () => {
  await dct.set("b", "25");
  await dct.set("a", { lorem: "ipsum" });
  expect(await dct.get("b")).toBe("25");
  expect(await dct.get("a")).toEqual({ lorem: "ipsum" });
});
