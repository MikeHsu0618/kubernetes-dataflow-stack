

x6-kafka
```
https://k6.io/blog/load-test-your-kafka-producers-and-consumers-using-k6/

https://github.com/mostafa/xk6-kafka/tree/main/scripts
```

Build xk6-kafka：
```
go install go.k6.io/xk6/cmd/xk6@latest

xk6 build --with github.com/mostafa/xk6-kafka@latest
```

Run K6 Script：
```
./k6 run --vus 50 --duration 5s test_string.js
```