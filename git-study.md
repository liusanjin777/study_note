---
title: git-study
date: 2021-12-22 19:40:25
tags:
---

## git的结构

- 工作区（写代码的文件夹）
  `| git add`
- 暂存区（临时存储）
  `| git commit`
- 本地库（历史版本）
  
## git和代码托管中心

- 局域网环境：gitlab
- 外网环境（GitHub，Gitee）

## git命令行操作

### 本地库初始化

- git init  
  .git目录中存放的是本地库相关的子目录和文件，不要删除，也不要胡乱修改
- 设置签名

  用户名：xxxx；Email地址：xxxx（主要用来区分不同开发人员的身份）  
  这里设置的签名和登录远程库的账号密码没有关系  
  项目级别/仓库级别：仅在当前本地库范围内有效（优先级较高)  
    `git config user.name xxx`  
    `git config user.email xxx`  
  系统用户级别：登录当前操作系统的用户范围(基本上都设置这个)  
    `git config --global user.name xxx`  
    ` git config --global user.email xxx `  
  二者必须至少得有一个  
  信息保存在 `./.git/config`

## git命令

- git status  
  查看状态
- git add filesName
  添加文件到暂存区
- git rm --cached filesName  
  撤回提交的文件
- git commit filesName  -m "提交的消息"
  提交到本地库
- git log  
  查看日志  
  多屏显示控制方式：space向下翻页，b向上翻页，q退出
- git log --pretty=oneline
  用简洁的方式显示版本信息
- git reflog  
  在oneline的基础上显示了要回到某个版本需要多少步
- git resrt --hard [index]  
  根据索引值（hash值）回到该索引值所对应的版本
- git reset --hard HEAD^  
  只能后退 一个^表示后退一步
- git reset --hard HEAD~n  
  表示后退n步

### 永久删除文件后找回

- 直接回退 （前提：删除前，文件存在时的状态提交到了本地库）  
  删除操作已经提交到了本地库
- git resert --hard HEAD  
  只add未commit的时候

### 比较文件的差异

- git diff filesName
  将工作区中的文件和暂存区进行比较
- git diff HEAD filesName
- git diff HEAD filesName
  
### git的分支

master是主分支

#### git的分支操作

- git branch [分支名]  创建分支
- git branch -v 查看分支
- git checkout [分支名] 切换分支
- 合并分支  
  1.切换到接收修改的分支上 `git checkout [接收修改的分支]`
  2.执行`git merge [有新内容的分支]`命令

#### 解决冲突

```js
<<<<<<<<<HEAD
hhhhhhhh  edit by hot_fix   // 当前分支修改的内容
=========
aaaaaaaa  edit by  master   //另一分支修改的内容
>>>>>>>>> master
```

- 解决冲突  
  1.编辑文件，删除特殊符号  
  2.把文件修改到满意的成都，保存退出
  3.git add [fileName]
  4.git commit -m "日志信息"     注意：此时commit一定不要带具体的文件名

## git的原理

### hash

### 指针
