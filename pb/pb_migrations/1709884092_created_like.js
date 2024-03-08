/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "v4ijj65ff5xd7mj",
    "created": "2024-03-08 07:48:10.896Z",
    "updated": "2024-03-08 07:48:10.929Z",
    "name": "like",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ckk2ylo4",
        "name": "p0",
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
        "id": "1p7yskn0",
        "name": "p1",
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
        "id": "hi8kxjfm",
        "name": "p2",
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
      "query": "SELECT\n  id,\n  SUM((r = 0) * c) AS p0,\n  SUM((r = 1) * c) AS p1,\n  SUM((r = 2) * c) AS p2\nFROM (\n  SELECT\n    id, r,\n    COUNT(*) AS c\n  FROM (\n    SELECT\n      poll_id AS id,\n      react as r\n    FROM poll_reacts\n  )\n  GROUP BY id, r\n)\nGROUP BY id"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("v4ijj65ff5xd7mj");

  return dao.deleteCollection(collection);
})
