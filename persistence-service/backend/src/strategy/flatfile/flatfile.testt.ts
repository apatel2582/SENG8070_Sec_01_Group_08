import FlatfilePersistence from "./flatfile";
import fs from "fs";
import path from "path";

describe("flatfile", () => {
  describe("constructor", () => {
    beforeEach(() => {
      if (fs.existsSync(getPath("flatfileDb"))) {
        fs.rmdirSync(getPath("flatfileDb"), { recursive: true });
      }
    });

    it("will create a 'flatfileDb' directory in the current folder if one is not present", () => {
      expect(fs.existsSync(getPath("flatfileDb"))).toBeFalsy();
      new FlatfilePersistence();

      expect(fs.existsSync(getPath("flatfileDb"))).toBeTruthy();
    });
  });

  describe("create method", () => {
    beforeEach(() => {
      if (fs.existsSync(getPath("flatfileDb"))) {
        fs.rmdirSync(getPath("flatfileDb"), { recursive: true });
      }
    });

    it("will create a new file if one does not exist", () => {
      expect(
        fs.existsSync(getPath("flatfileDb", "fooExample.json"))
      ).toBeFalsy();
      const flatfilePersistence = new FlatfilePersistence();

      flatfilePersistence.create("fooExample");

      expect(
        fs.existsSync(getPath("flatfileDb", "fooExample.json"))
      ).toBeTruthy();
    });

    it.todo("will not create a new file if one exists already");
  });

  describe("insert method", () => {
    beforeEach(() => {
      if (fs.existsSync(getPath("flatfileDb"))) {
        fs.rmdirSync(getPath("flatfileDb"), { recursive: true });
      }
    });

    it("will insert object", () => {
      const flatfilePersistence = new FlatfilePersistence();

      flatfilePersistence.create("fooExample");
      expect(
        fs.existsSync(getPath("flatfileDb", "fooExample.json"))
      ).toBeTruthy();

      flatfilePersistence.insert<FooExample>(fooData, "fooExample");

      console.log(fs.readFileSync(getPath("flatfileDb", "fooExample.json")));

      expect(
        JSON.parse(
          fs
            .readFileSync(getPath("flatfileDb", "fooExample.json"))
            .toString("utf-8")
        )
      ).toStrictEqual(fooData);
    });

    it.todo("will throw an error if location is not found");
  });

  describe("drop method", () => {
    it.todo("will remove the designated file if exists");
    it.todo(
      "will not impact the file structure designated file does not exist"
    );
  });

  describe("update", () => {
    it.todo("will update an existing entry");
    it.todo("will not update if entry does not exist");
  });

  describe("delete", () => {
    it.todo("will delete an existing entry");
    it.todo("will not delete if entry does not exist");
  });
});

function getPath(...dir: string[]) {
  return path.join(__dirname, ...dir);
}

interface FooExample {
  stringVariable: string;
  numberVariable: number;
  booleanVariable: boolean;
}

const fooData: FooExample = {
  stringVariable: "stringVariable",
  numberVariable: 12345,
  booleanVariable: true,
};
