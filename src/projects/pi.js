// Adapted from https://stackoverflow.com/a/4085325
function* digit_of_pi(N)
{
    let len = Math.floor(10 * N / 3) + 1;
    let A = new Array(len);
    for (let i = 0; i < len; ++i) {
        A[i] = 2;
    }
    let nines = 0;
    let predigit = 0;
    for (let j = 1; j < N + 1; ++j) {
        let q = 0;
        for (let i = len; i > 0; --i) {
            let x = 10 * A[i-1] + q * i;
            A[i-1] = x % (2 * i - 1);
            q = parseInt(x / (2 * i - 1));
        }
        A[0] = q % 10;
        q = parseInt(q / 10);
        if (9 === q) {
            nines += 1;
        }
        else
        if (10 === q) {
            yield predigit + 1;
            for (let k = 0; k < nines; ++k) {
                yield 0;
            }
            predigit = 0;
            nines = 0;
        }
        else {
            yield predigit;
            predigit = q;
            if (0 !== nines) {
                for (let k = 0; k < nines; ++k) {
                    yield 9;
                }
                nines = 0;
            }
        }
    }
    yield predigit;
}
