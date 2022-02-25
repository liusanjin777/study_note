---
title: window增加hyper-v
date: 2022-02-09 10:34:54
tags:
---

## 为windows增加hyper-v的方法

- 新建hyper-v.txt
- 输入以下内容

```txt
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
for /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
del hyper-v.txt
Dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL
```

- 将hyper-v.txt的后缀名更改为.cmd
- 以管理员身份运行
