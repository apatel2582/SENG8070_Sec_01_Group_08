import PersistenceService from "../../persistenceService";
import fs from "fs";
import path from "path";

export default class FlatfilePersistence implements PersistenceService {
  constructor() {
    if (!fs.existsSync(this.getPath("flatfileDb"))) {
      fs.mkdirSync(this.getPath("flatfileDb"));
    }
  }

  create(name: string) {
    if (fs.existsSync(this.getPath(`flatfileDb`, `${name}.json`))) {
      return;
    }

    fs.writeFileSync(this.getPath(`flatfileDb`, `${name}.json`), "");
  }

  insert<T = unknown>(content: T, location: string) {
    fs.appendFileSync(
      this.getPath("flatfileDb", `${location}.json`),
      JSON.stringify(content)
    );
  }

  private getPath(...dir: string[]) {
    return path.join(__dirname, ...dir);
  }
}
