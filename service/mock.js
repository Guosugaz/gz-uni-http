/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:21:05
 * @LastEditTime: 2022-08-28 11:12:04
 */
const Mock = require("better-mock");

module.exports = {
  userList() {
    return Mock.mock({
      "list|10": [
        {
          "id|+1": 1,
          name: Mock.Random.cname()
        }
      ]
    });
  },
  goodsList() {
    return Mock.mock({
      "list|10": [
        {
          "id|+1": 1,
          name: Mock.Random.title(),
          price: Random.float(0.01, 99999, 0, 2)
        }
      ]
    });
  }
};
