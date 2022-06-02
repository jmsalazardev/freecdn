import {Service} from "typedi";
import fs from "fs";
import path from "path";

interface GenericOptions {
  [prop: string]: unknown;
}

@Service()
export class ConfigService {
    private cache = new Map<string, GenericOptions>();
    private basepath: string;
    constructor() {
      this.basepath = path.join(__dirname, "..", "..", "config");
    }

    async getOptions(configFile: string): Promise<GenericOptions> {
      return new Promise((resolve, reject) => {
        const filename = `${this.basepath}/${configFile}.json`;

        const content = this.cache.get(filename);
        if (content) return resolve(content);

        fs.readFile(filename, "utf8", (err, data) => {
          if (err) return reject(err);

          const options = JSON.parse(data) as GenericOptions;
          this.cache.set(filename, options);

          resolve(options);
        });
      });
    }
}


