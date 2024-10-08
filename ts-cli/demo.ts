function spiralOrder(matrix: number[][]): number[] {
  let left: number = 0;
  let right: number = matrix[0].length - 1;
  let top: number = 0;
  let bottom: number = matrix.length - 1;
  const res: number[] = [];
	while(left <= right && top <= bottom) {
		// 从左往右遍历全部
		for(let i = left; i <= right; i ++) {
			res.push(matrix[top][i])
		}
		// 由于最上方一行已经遍历完了，所以top移向下一行
		top ++;
		// 从上到下
		for(let i = top; i <= bottom; i++) {
			res.push(matrix[i][right])
		}
		right --
		// 只剩最后一行或者最后一列，无需遍历剩下的了
		if (left > right || top > bottom) {
			break
		}
		// 从右到左
		for(let i = right; i >= left; i--) {
			res.push(matrix[bottom][i])
		}
		bottom --
		// 从下到上
		for(let i = bottom; i >= top; i--) {
			res.push(matrix[left][i])
		}
		left ++
	}
	return res
};
function spiralOrder(num: number): void {
	console.log(1);
	
}
spiralOrder(1)