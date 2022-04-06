---
title: MySQL数据库学习（一）
date: 2022-02-11 09:41:26
tags: MySQL 数据库
---

## 为什么需要数据库

- 任何的软件系统都需要存放大量的数据，这些数据通常是非常复杂和庞大的
- 数据库通俗一点来讲就是一个存储数据的仓库，数据库本质上就是一个软件、一个程序

## 常见的数据库

### 关系型数据库：**MySQL**、Oracle、SQL Server

- 关系型数据库通常我们会创建很多个二维数据表；
- 数据表之间相互关联起来，形成一对一、一对多、多对多等关系；
- 之后可以使用SQL语句在多张表中查询我们所需要的数据；
- 支持事务，对数据的访问更加的安全；

### 非关系型数据库：**MongoDB**、Redis、Memcached、HBse等

- 非关系型数据库的英文是Not Only SQL(NoSQL)；
- 相较于关系型数据库比较简单一点，存储数据更加自由（甚至可以将一个复杂的json对象直接塞入数据库中）；
- NoSQL是基于key-value的对应关系，并且查询的过程中不需要SQL解析，所以性能更高；
- NoSQL通常不支持事务，需要在自己的程序中来保证一些原子性的操作；

## 连接数据库

- `mysql -u root -p`---进入mysql，需输入密码；
- `SHOW DATABASES;`---查看数据库软件里面有哪些数据库(存在四个默认的数据库)；
- `create database databaseName;`---创建一个数据库；
- `select database();`---查看自己正在使用的数据库；
- `use databaseName;`---使用某个数据库；
- `show tables;`--- 查看表;
- `create table tableName;`---创建一个表；
- `create table tableName(name varchar(10),age int,height double);`---创建一个带字段的表；
- `insert into tableName (name,age,height) values {'kobe',20,1.88};`

## GUI工具的介绍

终端操作数据库太过繁琐，来个图形化工具：Navicat，SQLYog，TablePlus

## 认识SQL语句

SQL是Structured Query Language，称为结构化查询语言，简称为SQL

### SQL语句常用规范

- 关键字大写 CREATE、TABELE、SHOW；
- 一条语句结束后，需要以分号（;）结尾；
- 如果遇到关键字作为表明或者字段名称，可以使用``包裹；

### SQL语句的分类

#### DDL：数据定义语言

- 可以通过DDL语句对数据库或者表进行：创建、删除、修改等操作

##### 对数据库进行操作

```sql
# 查看所有的数据库
SHOW DATABASES;

# 选择某一个数据库
USE bili;

# 查看当前正在使用的数据库
SELECT DATABASE();

# 创建一个新的数据库
CREATE DATABASE douyu;
# 真实开发的时候创建数据库
CREATE DATABASE IF NOT EXISTS douyu;
# 指定编格式和排序规则
CREATE DATABASE IF NOT EXISTS huya DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
# 删除数据库
DROP DATABASE IF EXISTS douyu;
# 修改数据库的编码
ALTER DATABASE huya CHARACTER SET = utf8 
COLLATE = utf8_unicode_ci;
```

##### 对表进行操作

```sql
# 查看所有的表
SHOW TABLES;

# 新建表
CREATE TABLE IF NOT EXISTS `students` (
  `name` VARCHAR(10) NOT NULL,
  `age` int,
  `score` int,
  `height` DECIMAL(10,2), -- 表示存储两个小数点
  `birthday` YEAR, -- 年份范围1901-2155
  `phoneNum` VARCHAR(20) UNIQUE
);
-- DATE类型：YYYY-MM-DD
-- DATETIME & TIMESTAMP类型：YYYY-MM-DD hh:mm:ss
# 删除表
DROP TABLE IF EXISTS `moment`;

# 查看表的结构
DESC students;
# 查看创建表的SQL语句
SHOW CREATE TABLE `students`;
-- CREATE TABLE `students` (
--   `name` varchar(10) DEFAULT NULL,
--   `age` int DEFAULT NULL,
--   `score` int DEFAULT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

# 完整的创建表的语法
CREATE TABLE IF NOT EXISTS `users`(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `age` INT DEFAULT 0,
  `phoneNum` VARCHAR(20) UNIQUE DEFAULT '',
  `createTime` TIMESTAMP
);

# 修改表
# 1.修改表的名字
ALTER TABLE `users` RENAME TO `user`;
# 2.添加一个新的列
ALTER TABLE `user` ADD `updateTime` TIMESTAMP;
# 3.修改字段的名称
ALTER TABLE `user` CHANGE `phoneNum` `telPhone` VARCHAR(20);
# 4.修改字段的类型
ALTER TABLE `user` MODIFY `name` VARCHAR(30);
# 5.删除某一个字段
ALTER TABLE `user` DROP `age`;

# 补充
# 根据一个表结构去创建另外一张表
CREATE TABLE `user2` LIKE `user`;
# 根据另外一个表中的所有内容，创建一个新的表
CREATE TABLE `user3` AS (SELECT * FROM `user`); --As可以省略
```

#### DML：数据操作语言

- 可以通过DML语句对数据库或者表进行：添加、删除、修改等操作

```sql
# DML
# 插入数据
INSERT INTO `user` VALUES (110, 'why', '020-110110', '2020-10-20', '2020-11-11');
INSERT INTO `user` (name, telPhone, createTime, updateTime) VALUES ('kobe', '000-1111111', '2020-10-10', '2030-10-20');
      
INSERT INTO `user` (name, telPhone) VALUES ('lilei', '000-1111112');

# 需求：createTime和updateTime可以自动设置值
ALTER TABLE `user` MODIFY `createTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `user` MODIFY `updateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

INSERT INTO `user` (name, telPhone) VALUES ('hmm', '000-1111212');

INSERT INTO `user` (name, telPhone) VALUES ('lucy', '000-1121212');


# 删除数据
# 删除所有的数据
DELETE FROM `user`;
# 删除符合条件的数据
DELETE FROM `user` WHERE id = 110;

# 更新数据
# 更新所有的数据
UPDATE `user` SET name = 'lily', telPhone = '010-110110';
# 更新符合条件的数据
UPDATE `user` SET name = 'lily', telPhone = '010-110110' WHERE id = 115;
```

#### DQL：数据查询语言

- 可以通过DQL语句从数据库中查询记录；（重点）

```sql
# 创建products的表
CREATE TABLE IF NOT EXISTS `products` (
 id INT PRIMARY KEY AUTO_INCREMENT,
 brand VARCHAR(20),
 title VARCHAR(100) NOT NULL,
 price DOUBLE NOT NULL,
 score DECIMAL(2,1),
 voteCnt INT,
 url VARCHAR(100),
 pid INT
);

# 1.基本查询
# 查询表中所有的字段以及所有的数据
SELECT * FROM `products`; -- * 通配符，所有的字段和数据都会被查询
# 查询指定的字段
SELECT title, price FROM `products`;
# 对字段结果起一个别名
SELECT title AS phoneTitle, price AS currentPrice FROM `products`;


# 2.where条件
# 2.1. 条件判断语句
# 案例：查询价格小于1000的手机
SELECT title, price FROM `products` WHERE price < 1000;
# 案例二：价格等于999的手机
SELECT * FROM `products` WHERE price = 999;
# 案例三：价格不等于999的手机
SELECT * FROM `products` WHERE price != 999;
SELECT * FROM `products` WHERE price <> 999;
# 案例四：查询品牌是华为的手机
SELECT * FROM `products` WHERE brand = '华为';

# 2.2. 逻辑运算语句
# 案例一：查询1000到2000之间的手机
SELECT * FROM `products` WHERE price > 1000 AND price < 2000;
SELECT * FROM `products` WHERE price > 1000 && price < 2000;
# BETWEEN AND 包含等于
SELECT * FROM `products` WHERE price BETWEEN 1099 AND 2000;

# 案例二：价格在5000以上或者是品牌是华为的手机
SELECT * FROM `products` WHERE price > 5000 || brand = '华为';

# 将某些值设置为NULL
-- UPDATE `products` SET url = NULL WHERE id >= 85 and id <= 88;
# 查询某一个值为NULL
SELECT * FROM `products` WHERE url IS NULL;
-- SELECT * FROM `products` WHERE url = NULL;
-- SELECT * FROM `products` WHERE url IS NOT NULL;

# 2.3.模糊查询
-- %表示匹配任意个的任意字符
-- _表示匹配一个的任意字符
SELECT * FROM `products` WHERE title LIKE '%M%'; -- 查询所有带M的数据
SELECT * FROM `products` WHERE title LIKE '%P%'; -- 查询所有带P的数据
SELECT * FROM `products` WHERE title LIKE '_P%'; -- 查询第一个字符是任意的，第二个字符必须带P
# 2.4.对结果进行查询
-- IN表示提取多个值中的其中一个即可
SELECT * FROM `products` WHERE brand = '华为' || brand = '小米' || brand = '苹果';
SELECT * FROM `products` WHERE brand IN ('华为', '小米', '苹果')
# 3.对结果进行排序
SELECT * FROM `products` WHERE brand IN ('华为', '小米', '苹果') ORDER BY price ASC, score DESC; --ASC升序  DESC降序

# 4.分页查询
# LIMIT limitNumber OFFSET offsetNumber;
# Limit offsetNumber, limitNumber;
SELECT * FROM `products` LIMIT 20 OFFSET 0; --查询0-20的数据
SELECT * FROM `products` LIMIT 20 OFFSET 20; -- 查询21到40的数据
SELECT * FROM `products` LIMIT 40, 20; -- 查询21到40的数据
```

##### 聚合函数

- 聚合函数表示对值集合进行操作的组（集合）函数
- 聚合函数默认情况下将整张表的数据堪称一组数据，对这一组数据进行操作，这个操作就是聚合函数

```sql
# 1.聚合函数的使用
# 求所有手机的价格的总和
SELECT SUM(price) AS totalPrice FROM `products`; -- AS可以省略
# 求一下华为手机的价格的总和
SELECT SUM(price) FROM `products` WHERE brand = '华为'; 
# 求华为手机的平均价格
SELECT AVG(price) FROM `products` WHERE brand = '华为';
# 最高手机的价格和最低手机的价格
SELECT MAX(price) FROM `products`;
SELECT MIN(price) FROM `products`;

# 求华为手机的个数
SELECT COUNT(*) FROM `products` WHERE brand = '华为';
SELECT COUNT(*) FROM `products` WHERE brand = '苹果';
SELECT COUNT(url) FROM `products` WHERE brand = '苹果';

SELECT COUNT(price) FROM `products`;
SELECT COUNT(DISTINCT price) FROM `products`; -- 价格不重复

# 2.GROUP BY的使用
-- 进行分组
SELECT brand, AVG(price), COUNT(*), AVG(score) FROM `products` GROUP BY brand;


# 3.HAVING的使用
-- HAVING可以对分组查询之后进行筛选，WHERE不可以
SELECT brand, AVG(price) avgPrice, COUNT(*), AVG(score) FROM `products` GROUP BY brand HAVING avgPrice > 2000;


# 4.需求：求评分score > 7.5的手机的，平均价格是多少？
SELECT AVG(price) FROM `products` WHERE score > 7.5
# 4.1 升级：平均分大于7.5的手机，按照品牌进行分类，求出平均价格。
SELECT brand, AVG(price) FROM `products` WHERE score > 7.5 GROUP BY brand;
```

##### 多表查询

```sql
# 1.创建brand的表和插入数据
CREATE TABLE IF NOT EXISTS `brand`(
 id INT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(20) NOT NULL,
 website VARCHAR(100),
 phoneRank INT
);

INSERT INTO `brand` (name, website, phoneRank) VALUES ('华为', 'www.huawei.com', 2);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('苹果', 'www.apple.com', 10);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('小米', 'www.mi.com', 5);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('oppo', 'www.oppo.com', 12);

INSERT INTO `brand` (name, website, phoneRank) VALUES ('京东', 'www.jd.com', 8);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('Google', 'www.google.com', 9);


# 2.给brand_id设置引用brand中的id的外键约束
# 添加一个brand_id字段
ALTER TABLE `products` ADD `brand_id` INT;
-- ALTER TABLE `products` DROP `brand_id`;

# 修改brand_id为外键
-- 可以在创建表的时候表示
ALTER TABLE `products` ADD FOREIGN KEY(brand_id) REFERENCES brand(id);

# 设置brand_id的值
UPDATE `products` SET `brand_id` = 1 WHERE `brand` = '华为';
UPDATE `products` SET `brand_id` = 2 WHERE `brand` = '苹果';
UPDATE `products` SET `brand_id` = 3 WHERE `brand` = '小米';
UPDATE `products` SET `brand_id` = 4 WHERE `brand` = 'oppo';

# 3.修改和删除外键引用的id
UPDATE `brand` SET `id` = 100 WHERE `id` = 1; -- 报错，被外键引用，无法修改无法删除
# 4.修改brand_id关联外键时的action
-- 分3步走
# 4.1.获取到目前的外键的名称
SHOW CREATE TABLE `products`;
-- CREATE TABLE `products` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `brand` varchar(20) DEFAULT NULL,
--   `title` varchar(100) NOT NULL,
--   `price` double NOT NULL,
--   `score` decimal(2,1) DEFAULT NULL,
--   `voteCnt` int DEFAULT NULL,
--   `url` varchar(100) DEFAULT NULL,
--   `pid` int DEFAULT NULL,
--   `brand_id` int DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   KEY `brand_id` (`brand_id`),
--   CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

# 4.2.根据名称将外键删除掉
ALTER TABLE `products` DROP FOREIGN KEY products_ibfk_1;

# 4.3.重新添加外键约束
ALTER TABLE `products` ADD FOREIGN KEY (brand_id) REFERENCES brand(id) ON UPDATE CASCADE ON DELETE RESTRICT; -- 删除最好使用RESTRICT，其他的非常危险
UPDATE `brand` SET `id` = 100 WHERE `id` = 1;
```

###### 如何进行多表查询呢

- 使用SQL JOIN 进行多表查询

```sql
# 1.获取到的是笛卡尔乘积
SELECT * FROM `products`, `brand`;
# 获取到的是笛卡尔乘积进行筛选
SELECT * FROM `products`, `brand` WHERE products.brand_id = brand.id;


-- 使用SQL JOIN
# 2.左连接
# 2.1. 查询所有的手机（包括没有品牌信息的手机）以及对应的品牌 null
SELECT * FROM `products` LEFT OUTER JOIN `brand` ON products.brand_id = brand.id;

# 2.2. 查询没有对应品牌数据的手机
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE brand.id IS NULL;
-- SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE brand_id IS NULL;  这样写有些情况会有问题


# 3.右连接
# 3.1. 查询所有的品牌（没有对应的手机数据，品牌也显示）以及对应的手机数据；
SELECT * FROM `products` RIGHT OUTER JOIN `brand` ON products.brand_id = brand.id;

# 3.2. 查询没有对应手机的品牌信息
SELECT * FROM `products` RIGHT JOIN `brand` ON products.brand_id = brand.id WHERE products.brand_id IS NULL;


# 4.内连接
## INNER JOIN or CROSS JOIN or JOIN
SELECT * FROM `products` JOIN `brand` ON products.brand_id = brand.id;
SELECT * FROM `products` JOIN `brand` ON products.brand_id = brand.id WHERE price = 8699;

# 5.全连接
## mysql是不支持 FULL OUTER JOIN
SELECT * FROM `products` FULL OUTER JOIN `brand` ON products.brand_id = brand.id; -- put error

## 左连接和右连接进行联合
(SELECT * FROM `products` LEFT OUTER JOIN `brand` ON products.brand_id = brand.id)
UNION
(SELECT * FROM `products` RIGHT OUTER JOIN `brand` ON products.brand_id = brand.id)

(SELECT * FROM `products` LEFT OUTER JOIN `brand` ON products.brand_id = brand.id WHERE brand.id IS NULL)
UNION
(SELECT * FROM `products` RIGHT OUTER JOIN `brand` ON products.brand_id = brand.id WHERE products.brand_id IS NULL)

```

#### DCL：数据控制语言

- 可以通过DCL语句对数据库、表的权限进行相关访问控制操作；

### 表约束

#### 主键

- 一张表中，为了区分每一条记录的唯一性，必须有一个字段是永远不会重复和为空的，这个字段我们通常会将它设置为主键；
- 主键是表中唯一的索引；
- 主键必须是NOT NULL,如果没有设置NOT NULL，MySQL也会隐性的设置为NOT NULL；
- 主键也可以是多列索引，PRIMARY KEY(key_part,...),一般称之为联合主键
- **主键应该是和业务无关的，尽量不要使用业务字段来作为主键**

#### 唯一UNIQUE

- 不能重复

#### 不能为空

- NOT NULL

#### DEFAULT

- 设置默认值

#### 自动递增AUTO_INCREMENT

### 多对多的关系

比如学生可以选择多门课程，一个课程也可以被多个学生选择,多对多的表中，一般会建立一个关系表

```sql
# 1.基本数据的模拟
CREATE TABLE IF NOT EXISTS students(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  age INT
);

CREATE TABLE IF NOT EXISTS courses(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  price DOUBLE
);

INSERT INTO `students` (name, age) VALUES('why', 18);
INSERT INTO `students` (name, age) VALUES('tom', 22);
INSERT INTO `students` (name, age) VALUES('lilei', 25);
INSERT INTO `students` (name, age) VALUES('lucy', 16);
INSERT INTO `students` (name, age) VALUES('lily', 20);

INSERT INTO `courses` (name, price) VALUES ('英语', 100);
INSERT INTO `courses` (name, price) VALUES ('语文', 666);
INSERT INTO `courses` (name, price) VALUES ('数学', 888);
INSERT INTO `courses` (name, price) VALUES ('历史', 80);
INSERT INTO `courses` (name, price) VALUES ('物理', 888);
INSERT INTO `courses` (name, price) VALUES ('地理', 333);


# 2.建立关系表
CREATE TABLE IF NOT EXISTS `students_select_courses`(
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON UPDATE CASCADE
);

# 3.学生选课
# why选择了英文、数学、历史
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 1);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 3);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 4);


INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 2);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 4);


INSERT INTO `students_select_courses` (student_id, course_id) VALUES (5, 2);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (5, 3);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (5, 4);


# 4.查询的需求
# 4.1. 查询所有有选课的学生，选择了哪些课程
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
JOIN `courses` cs ON ssc.course_id = cs.id;


# 4.2. 查询所有的学生的选课情况
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
LEFT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id;

# 4.3. 哪些学生是没有选课
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
LEFT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
LEFT JOIN `courses` cs ON ssc.course_id = cs.id
WHERE cs.id IS NULL;

# 4.4. 查询哪些课程是没有被选择的
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
RIGHT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
RIGHT JOIN `courses` cs ON ssc.course_id = cs.id
WHERE stu.id IS NULL;;

# 4.5. 某一个学生选了哪些课程（why）
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
LEFT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
LEFT JOIN `courses` cs ON ssc.course_id = cs.id
WHERE stu.id = 2;
```

### mysql2

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
