Gsonnet-bundler install:
```
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest`
```

Grafonnet install:
```
jb install github.com/grafana/grafonnet/gen/grafonnet-latest@main
```

Render Jsonnet files to Grafana dashboards:
```
jsonnet -J vendor main.libsonnet
```