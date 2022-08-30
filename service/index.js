/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:21:00
 * @LastEditTime: 2022-08-30 17:12:09
 */
const { userList, goodsList } = require("./mock.js");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 6780;

app.use(cors());

app.get("/userList", (req, res) => {
  // res.sendStatus(500);
  // setTimeout(() => {
  res.send({
    code: 200,
    data: userList().list
  });
  // }, 2000);
});

app.get("/userList", (req, res) => {
  // res.sendStatus(500);
  res.send({
    code: 200,
    data: goodsList().list
  });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
