// Returns a sorted array in ascending order (using bubble sort)
// Note: use reverse(sort(...)) to get a descending order
function sort(arr) const {
    const N = size(arr);
    if(N <= 1) {
        return arr;
    }
    const N_1 = N - 1;
    for(var i = 0; i < N_1; i++) {
        const M = N_1 - i;
        for(var j = 0; j < M; j++) {
            const k = j + 1;
            const L = arr[j];
            const R = arr[k];
            if(L > R) {
                arr[j] = R;
                arr[k] = L;
            }
        }
    }
    return arr;
}
