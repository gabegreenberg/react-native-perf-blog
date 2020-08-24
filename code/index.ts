const fib = (n: number): number => {
	let dp = [];
	dp.push(0);
	dp.push(1);
	let isFibEven = true;
	for (let i = 2; i <= n; i++) {
		dp.push(dp[i - 1] + dp[i - 2]);
		isFibEven = dp[i] % 2 === 0;
	}
	return dp[n];
};

fib(1000000);
