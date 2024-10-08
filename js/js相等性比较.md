# js相等性比较



## ==

`==`会进行隐式类型转换

- 当两者为Object时，引用地址为同一地址时返回true  
- 当两者为undefined和null时，返回true
- 当两者类型相同时  
  1.当两者为数字时，正常比较，+0和-0被认作是相同的值。  
  2.当两者为字符串时，正常比较
- 当两者类型不同时  
  1.当两者有一个数字和字符串时，将字符串转化为数字，再进行比较。  
  2.当两者有一个为Boolean类型时，true转化为数字1，false转化为数字0。  
  3.当两者有一个为Object类型时，会调用`toString()` or `valueOf()` 函数将Object类型转化为原始值，再根据规则进行比较。

### mdn链接：<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness>
