# mysql2

## mysql2 简单操作

```js
// 1. npm install mysql2
const mysql = require('mysql');
// 2. 连接数据库
const connection = mysql.createConnectionp({
  host: 'localhost',
  port: 3306, // 不写的话默认为3306
  database: [databaseName]
  user: [username],
  password: [password]
})
// 编写SQL语句
const statement = `SELECT * FROM products`
// 执行
connection.query(statement, (err, results, field) => {
 console.log(results)
})
```

## 预处理语句

## 连接池-connectionPool
