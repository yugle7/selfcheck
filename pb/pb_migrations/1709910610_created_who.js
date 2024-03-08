/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9znp6b0e2nq8to8",
    "created": "2024-03-08 15:10:18.012Z",
    "updated": "2024-03-08 15:10:18.012Z",
    "name": "who",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sovhrtel",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9znp6b0e2nq8to8");

  return dao.deleteCollection(collection);
})
