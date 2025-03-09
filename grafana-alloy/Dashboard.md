# Alloy Mixin Dashboard Generation Guide

這個指南說明如何使用 jsonnet 從 alloy-mixin 產生 Grafana dashboard JSON 檔案。

## 前置需求

1. 安裝必要的工具：
```bash
# 安裝 jsonnet
brew install jsonnet

# 安裝 jsonnet-bundler (用於管理相依套件)
brew install jsonnet-bundler
```

## 步驟

1. 建立 generate-dashboards.jsonnet 檔案：
```bash
cat > generate-dashboards.jsonnet << 'EOF'
local config = import 'config.libsonnet';
local dashboards = import 'dashboards.libsonnet';
local merged = config + dashboards;

{
  [if std.isObject(merged.grafanaDashboards[name]) then 'dashboards/%s' % std.strReplace(name, '.json.json', '.json')]: merged.grafanaDashboards[name]
  for name in std.objectFields(merged.grafanaDashboards)
}
EOF
```

2. 安裝相依套件：
```bash
# 清理舊的 vendor 目錄（如果存在）
rm -rf vendor

# 安裝相依套件
jb install
```

3. 產生 dashboard JSON 檔案：
```bash
# 建立輸出目錄
rm -rf output/* && mkdir -p output/dashboards

# 產生 dashboard JSON 檔案
jsonnet -J vendor -m output generate-dashboards.jsonnet
```

## 輸出結果

執行完成後，你會在 `output/dashboards/` 目錄下找到以下檔案：
- alloy-cluster-node.json
- alloy-cluster-overview.json
- alloy-controller.json
- alloy-logs.json
- alloy-opentelemetry.json
- alloy-prometheus-remote-write.json
- alloy-resources.json

## 使用產生的檔案

這些 JSON 檔案可以：
1. 直接匯入到 Grafana（通過 UI 或 API）
2. 用於 Grafana 的 provisioning 設定
3. 納入版本控制系統

## 自訂 Dashboard

如果需要修改 dashboard：
1. 修改 `config.libsonnet` 來調整全域設定
2. 修改 `dashboards/` 目錄下的各個 dashboard 定義檔
3. 重新執行上述步驟 3 來產生新的 JSON 檔案

## 檔案結構說明

- `config.libsonnet`: 包含全域設定
- `dashboards.libsonnet`: 主要的 dashboard 組合檔案
- `dashboards/`: 包含各個 dashboard 的定義檔
  - `alloy-logs.libsonnet`
  - `cluster-node.libsonnet`
  - `cluster-overview.libsonnet`
  - `resources.libsonnet`
  - `controller.libsonnet`
  - `prometheus.libsonnet`
  - `opentelemetry.libsonnet`

## 注意事項

- 確保執行命令時在 alloy-mixin 目錄下
- 如果遇到相依性問題，可以嘗試重新執行 `jb install`
- 產生的 JSON 檔案會覆蓋輸出目錄中的既有檔案