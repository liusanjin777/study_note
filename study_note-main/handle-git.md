---
title: handle git error
date: 2021-12-22 19:40:25
tags: git-error
---

## 处理git error 10054 443

依次执行下面语句

- git config --global http.sslVerify "false"
- git config --unset --global http.proxy
- git config --unset --global https.proxy

很遗憾，有时候并不是怎么有用

## 终极方案

- 使用clash
- [![HzcuzF.png](https://s4.ax1x.com/2022/02/22/HzcuzF.png)](https://imgtu.com/i/HzcuzF);
- 在git中执行`git config --global http.proxy [url]`
- url为在clash中复制的地址
