/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "cd762m3lmdhskpd",
    "created": "2024-03-08 07:48:10.896Z",
    "updated": "2024-03-08 07:48:10.928Z",
    "name": "username",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4iqx5dpi",
        "name": "which",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "jtnmkp3x",
        "name": "who",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT who.id, which, who FROM (\n  SELECT '000000000000000' as id, name as which FROM which\n  ORDER BY RANDOM()\n  LIMIT 1) as which\nJOIN (\n  SELECT '000000000000000' as id, name as who FROM who\n  ORDER BY RANDOM()\n  LIMIT 1) as who\nON which.id = who.id"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cd762m3lmdhskpd");

  return dao.deleteCollection(collection);
})
