import path from "path";
import fs from "fs";
import { load } from "cheerio";
import JSON5 from "json5";
import { Inject, Service } from "typedi";
import axios from "axios";
import { GoogleAlbum } from "../interfaces/google-album";
import { GooglePhoto } from "../interfaces/google-photo";
import { Logger } from "../interfaces";

@Service()
export class GoogleAlbumService {
  @Inject("Logger")
  private readonly logger: Logger;

  private albumScript: string;

  constructor() {
    const scriptsPath = path.join(__dirname, "..", "scripts");
    const filename = `${scriptsPath}/album.js`;
    this.albumScript = fs.readFileSync(filename, "utf8");
  }

  async getAlbum(url: string): Promise<GoogleAlbum> {
    const parsedUrl = new URL(url);
    const [, id] = parsedUrl.pathname.split("/");

    this.logger.info("getAlbum", { url });

    this.logger.debug("loading album content", { url });
    const res = await axios.get(url);
    const data = res.data;

    const parsedHTML = load(data);

    const canonicalUrl = parsedHTML("link[rel='canonical']").attr("href") || "";
    const albumUrl = new URL(canonicalUrl);
    const key = albumUrl.searchParams.get("key");
    const title = parsedHTML("title").text().replace(" - Google Photos", "");

    const scripts = parsedHTML("script").get().map((item) => {
      const { data } = item.children[0] as { data: string };
      return data;
    });

    const result = {
      id,
      key,
      title,
      items: [],
      url,
    } as GoogleAlbum;
    const filtered = scripts.filter(
      (item) => item.startsWith("AF_initDataCallback")
    );

    filtered.forEach((item) => {
      item.replace("AF_initDataCallback(", "").replace(/$/, "");
      const txt = item.substring(20, item.length - 2);
      const obj = JSON5.parse(txt);
      if (obj.data &&
        Array.isArray(obj.data[1]) &&
        Array.isArray(obj.data[1][0])) {
        const rows = obj.data[1];
        const info = rows.map((item) => {
          const [id, itemData] = item;
          const [url] = itemData;
          return { id, url };
        });
        result.items.push(...info);
      }
    });

    this.logger.debug("album data extracted", { url });
    return result;
  }

  async getPhoto(
    photoId: string,
    key: string
  ): Promise<GooglePhoto | undefined> {
    const rpcid = "fDcn4b";
    const qReq = [[[rpcid, JSON.stringify([photoId, 1, key]), null, "1"]]];
    const bodyData = `f.req=${JSON.stringify(qReq)}`;
    this.logger.debug(bodyData);

    const res = await axios.post(
      "https://photos.google.com/_/PhotosUi/data/batchexecute",
      bodyData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );
    let data = res.data.replace(")]}'", "");
    data = JSON.parse(data);
    data = JSON.parse(data[0][2]);
    const [id, description, filename, createdAt, , size, width, height] =
      data[0];

    return {
      id,
      description,
      filename,
      createdAt,
      size,
      width,
      height,
    };
  }

  async getPhotosByIds(
    key: string,
    photoIds: string[],
  ): Promise<GooglePhoto[]> {
    const rpcid = "fDcn4b";
    const queryData = photoIds.map(
      (photoId) => [rpcid, JSON.stringify([photoId, null, key])]
    );

    const bodyData = `f.req=${JSON.stringify([queryData])}`;
    const res = await axios.post(
      "https://photos.google.com/_/PhotosUi/data/batchexecute",
      bodyData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );

    const data = res.data.replace(")]}'", "");
    const list = JSON.parse(data);
    return list.filter((item: string[]) => item[1] === rpcid)
      .map((item: string[]) => {
        const [, , responseText] = item;
        const jsonObj = JSON.parse(responseText);
        const [id, description, filename, createdAt, , size, width, height] =
          jsonObj[0];
        return {
          id,
          description,
          filename,
          createdAt,
          size,
          width,
          height,
        };
      });
  }
}
