# tag String

## 替换空格 剑指offer 05

- 思路1：暴力破解

```ts
function replaceSpace(s: string): string {
  const length: number = s.length;
  let newS: string = ''
  for (let index: number = 0; index < length; index++) {
    newS += s[index] === ' ' ? '%20' : s[index]
  }
  return newS
}
```

- 思路2: replace + 正则

```ts
function replaceSpace(s: string): string {
  return s.replace(/\s/ig, '%20')
}
```

- 思路3: split + jion

```ts
function replaceSpace(s: string): string {
  return s.spilt(' ').join('%20')
}
```

## 选出第一个不重复的字符 剑指offer 50

- 思路：利用map结构，判断是否重复

```ts
function firstUniqChar(s: string): string {
  const length: number = s.length;
  let map = new Map()
  for (let i: number = 0; i < length; i++) {
    if (map.has(s[i])) {
      map.set(s[i], map.get(s[i]) + 1); //将已经存在map中的字符数量加1
    } else {
      map.set(s[i], 1);
    }
  }
  for (let i: number = 0; i < length; i++) {
    if (map.get(s[i]) === 1) {
      return s[i]
    }
  }
  return ' '
}
```

## 剑指 Offer 58 - I. 翻转单词顺序

- 思路1：利用spilt让字符串变换为数组，利用filter删除多余的空字符串，reverse反转数组，再利用join转化为字符串

```ts
function reverseWords(s: string): string {
  return s.split(' ').filter(v => v !== '').reverse().join(' ')
};
```

- 思路2：利用trim和replace+正则删除多余的空格，利用双指针反转数组

```ts
function reverseWords(s: string): string {
  const arr: string[] = s.trim().replace(/\s+/g, ' ').split(' ');
  let left: number = 0;
  let right: number = arr.length - 1;
  while(right > left) {
    let temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr.join(' ')
};
```

## 剑指 Offer 58 - II. 左旋转字符串

- 思路1：利用slice截取

```ts
function reverseLeftWords(s: string, n: number): string {
  return s.slice(n) + s.slice(0,n)
};
```

- 暴力解法

```ts
function reverseLeftWords(s: string, n: number): string {
  let newS: string = ''
  for(let i: number = n; i< s.length; i++) {
    newS += s[i]
  }
  for(let i: number = 0; i< n; i++) {
    newS += s[i]
  }
  return newS
};
/*利用取余简化代码 */
function reverseLeftWords(s: string, n: number): string {
  let newS: string = ''
  const length: number = s.length
  for(let i: number = n; i< length + n; i++) {
    newS += s[i % length]
  }
  return newS
};
```

## 剑指 Offer 20. 表示数值的字符串

- 思路：逐个判断，并且确定成功的状态  
  1. 去除首尾空格字符，初始化 数字标识符、小数点标识符、eE标识符
  2. e、E只能出现一次，且前后需要有数字
  3. `'.123'` or `'1.23'` or `'123.'` 都是被允许的
  4. `+-` 符号只能出现在首位和eE后面第一位

```ts
function isNumber(s: string): boolean {
  if (!s) {
    return false
  }
  s = s.trim();
  let numFlag: boolean = false; // 数字标识符
  let eFlag: boolean = false; // eE标识符
  let dotFlag: boolean = false; // 小数点标识符
  let length: number = s.length;
  for (let i: number = 0; i < length; i++) {
  //出现数字
  if ('0' <= s[i] && s[i] <= '9') {
     numFlag = true 
  //出现小数点，且前面没有出现过小数点和eE后不出现小数点
  } else if (s[i] === '.' && !dotFlag && !eFlag) {
     dotFlag = true
  // eE只能出现一次且前后都有数字
  } else if ((s[i] === 'e' || s[i] ==='E') && numFlag && !eFlag) {
     eFlag = true
     // 避免eE后没有数字
     numFlag = false
  // +-符合只能出现在首尾或者前一位为eE
  } else if ((s[i] === '+' || s[i] === '-') && (s[i - 1] === 'e' || s[i - 1] ==='E' || i === 0)) {
    continue;
  } else {
    return false
  }
  }
  return numFlag
};
```
