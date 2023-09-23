```
helm repo add clickhouse-operator https://docs.altinity.com/clickhouse-operator/
helm repo update
helm upgrade --install clickhouse-operator clickhouse-operator/altinity-clickhouse-operator -n clickhouse --set fullnameOverride="clickhouse-operator"
```