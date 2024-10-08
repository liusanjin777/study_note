# elment在项目中遇到的问题总结

## el-table

### 修改滚动条后，表头会有一部分突出

- 原因：边框问题
- 解决方法：

```less
/deep/ .el-table th.el-table__cell {
    broder: none
}
```
