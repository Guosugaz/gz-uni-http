/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:21:00
 * @LastEditTime: 2022-09-03 21:59:19
 */
const { userList, goodsList } = require("./mock.js");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 6780;

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/userList", (req, res) => {
  // res.sendStatus(500);
  // setTimeout(() => {
  res.send({
    code: 200,
    data: userList().list
  });
  // }, 2000);
});

app.post("/goodsList", (req, res) => {
  if (req.body.test === "111111111") {
    res.send({
      code: 200,
      data: goodsList().list
    });
  } else {
    res.sendStatus(500);
  }
});

app.get("/error", (req, res) => {
  res.sendStatus(500);
  res.send({
    code: 500,
    data: null
  });
});

app.get("/file/:name", (req, res) => {
  const fileName = req.params.name;
  res.sendFile(
    fileName,
    {
      root: path.join(__dirname, "static")
    },
    (err) => {
      if (err) {
        res.sendStatus(500);
        res.send({
          code: 0,
          data: err
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
