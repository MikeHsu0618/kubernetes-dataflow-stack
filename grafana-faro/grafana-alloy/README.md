Grafana Agent installation:
```
helm upgrade --install faro-collector grafana/alloy --values values.yaml -n collector --create-namespace
```