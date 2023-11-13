
Docker 下載:
```
docker pull timberio/vector:0.28.1-debian
```

GeoLite2-City.mmdb 下載:
```
## 登入後手動下載，放置目標路徑
https://dev.maxmind.com/geoip/geolite2-free-geolocation-data
```


Demo Configure:
```
cat <<-EOF > $PWD/vector.toml
[api]
enabled = true
address = "0.0.0.0:8686"

[sources.demo_logs]
type = "demo_logs"
interval = 1.0
format = "json"

[sinks.console]
inputs = ["demo_logs"]
target = "stdout"
type = "console"
encoding.codec = "json"
EOF

```

Docker Run:
```
docker run \
  -d \
  -v $PWD/vector.toml:/etc/vector/vector.toml:ro \
  --name vector \
  -p 8686:8686 \
  timberio/vector:0.28.1-debian
```

Observe:
```
docker logs -f $(docker ps -aqf "name=vector")
```

To access metrics from your Vector image:
```
docker exec -it $(docker ps -aqf "name=vector") bash

vector top
```

Remove:
```
docker rm -f $(docker ps -aqf "name=vector")
```