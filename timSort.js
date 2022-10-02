<script>

// Javascript program to perform TimSort.
let MIN_MERGE = 32;

function minRunLength(n)
{
	
	// Becomes 1 if any 1 bits are shifted off
	let r = 0;
	while (n >= MIN_MERGE)
	{
		r |= (n & 1);
		n >>= 1;
	}
	return n + r;
}

// This function sorts array from left index to
// to right index which is of size atmost RUN
function insertionSort(arr,left,right)
{
	for(let i = left + 1; i <= right; i++)
	{
		let temp = arr[i];
		let j = i - 1;
		
		while (j >= left && arr[j] > temp)
		{
			arr[j + 1] = arr[j];
			j--;
		}
		arr[j + 1] = temp;
	}
}

// Merge function merges the sorted runs
function merge(arr, l, m, r)
{
	
	// Original array is broken in two parts
	// left and right array
	let len1 = m - l + 1, len2 = r - m;
	let left = new Array(len1);
	let right = new Array(len2);
	for(let x = 0; x < len1; x++)
	{
		left[x] = arr[l + x];
	}
	for(let x = 0; x < len2; x++)
	{
		right[x] = arr[m + 1 + x];
	}

	let i = 0;
	let j = 0;
	let k = l;

	// After comparing, we merge those two
	// array in larger sub array
	while (i < len1 && j < len2)
	{
		if (left[i] <= right[j])
		{
			arr[k] = left[i];
			i++;
		}
		else
		{
			arr[k] = right[j];
			j++;
		}
		k++;
	}

	// Copy remaining elements
	// of left, if any
	while (i < len1)
	{
		arr[k] = left[i];
		k++;
		i++;
	}

	// Copy remaining element
	// of right, if any
	while (j < len2)
	{
		arr[k] = right[j];
		k++;
		j++;
	}
}

// Iterative Timsort function to sort the
// array[0...n-1] (similar to merge sort)
function timSort(arr, n)
{
	let minRun = minRunLength(MIN_MERGE);
		
	// Sort individual subarrays of size RUN
	for(let i = 0; i < n; i += minRun)
	{
		insertionSort(arr, i, Math.min(
			(i + MIN_MERGE - 1), (n - 1)));
	}

	// Start merging from size
	// RUN (or 32). It will
	// merge to form size 64,
	// then 128, 256 and so on
	// ....
	for(let size = minRun; size < n; size = 2 * size)
	{
		
		// Pick starting point
		// of left sub array. We
		// are going to merge
		// arr[left..left+size-1]
		// and arr[left+size, left+2*size-1]
		// After every merge, we
		// increase left by 2*size
		for(let left = 0; left < n;
						left += 2 * size)
		{

			// Find ending point of left sub array
			// mid+1 is starting point of right sub
			// array
			let mid = left + size - 1;
			let right = Math.min((left + 2 * size - 1),
									(n - 1));

			// Merge sub array arr[left.....mid] &
			// arr[mid+1....right]
			if(mid < right)
				merge(arr, left, mid, right);
		}
	}
}

// Utility function to print the Array
function printArray(arr,n)
{
	for(let i = 0; i < n; i++)
	{
		document.write(arr[i] + " ");
	}
	document.write("<br>");
}

// Driver code
let arr = [ -2, 7, 15, -14, 0, 15, 0, 7,
			-7, -4, -13, 5, 8, -14, 12 ];
let n = arr.length;
document.write("Given Array is<br>");
printArray(arr, n);
timSort(arr, n);

document.write("After Sorting Array is<br>");
printArray(arr, n);

// This code is contributed by rag2127

</script>
