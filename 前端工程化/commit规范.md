# commit规范

## commit句式

- `<type>(<scope>): <subject>`

## 例子

- `fix(component): fix bug`
- 注意：冒号后应该跟空格

## 解析

### type

type指commit的类型，总共有以下8个

- `feat`: 新功能（feature）
- `fix`: 修补bug
- `docs`: 文档（documentation）
- `style`： 格式（不影响代码运行的变动
- `refactor`：重构（即不是新增功能，也不是修改bug的代码变动）
- `test`：增加测试
- `chore`：构建过程或辅助工具的变动
- `build`: 本地creator构建

### scope

用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同

### subject

是 commit 目的的简短描述，不超过50个字符。

- 以动词开头，使用第一人称现在时，比如change，而不是changed或changes
- 第一个字母小写
- 结尾不加句号
