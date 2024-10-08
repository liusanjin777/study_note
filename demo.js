function myFlat(arr) {
  let newArr = []
  const handleArr = (target) => {
    if (Array.isArray(target)) {
      target.forEach(v => {
        handleArr(v)
      })
    } else {
      newArr.push(target)
    }
  }
  handleArr(arr)
  return newArr
}
const arr = [1, [2, 3]]

console.log(myFlat(arr));