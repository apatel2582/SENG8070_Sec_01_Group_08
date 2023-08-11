import { Express } from "express";
import { DataSource } from "typeorm";
import { Photo } from "./photo";

export default class PhotoApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/photo/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Photo, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/photo", async (req, res) => {
      const { body } = req;
      console.log(body);

      const photo = new Photo();

      photo.name = body.name;
      photo.description = body.description;
      photo.filename = body.filename;
      photo.views = 0;
      photo.isPublished = true;

      try {
        await this.#dataSource.manager.save(photo);
        console.log(`photo has been created with id: ${photo.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Photo creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: photo.id,
      });
    });
  }
}
