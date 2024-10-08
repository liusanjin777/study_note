# 剑指 Offer 

## 48. 最长不含重复字符的子字符串

- 采用滑动窗口 + hash 的方式进行解决

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  let map = new Map() // 利用map判断是否有重复
  let res = 0
  // 遍历s字符串
  for(let fast = 0, slow = 0;fast < s.length; fast ++) {
      // 当map中存在当前字符时，依次删除存在map中的字符，直至将当前字符删除
      // 确保在遍历字符串的时候，不会将字符重复存入map中
  	 while(map.get(s[fast])) {
         map.delete(s[slow])
         slow ++
     }
      map.set(s[fast], 1)
      // 记录 map.size zui'chang
      res = Math.max(res, map.size)
  }
   return res
};
```

