# OpenLIT LLM 模拟数据生成工具

这个工具集可以帮助您生成模拟的 LLM 调用遥测数据，直接发送到 OpenLIT 平台，无需实际调用昂贵的 LLM API。

## 功能特点

- 生成符合 OpenTelemetry 标准的 LLM 遥测数据
- 模拟各种 LLM 提供商和模型（如 OpenAI、Anthropic、Meta 等）
- 模拟完整的用户会话工作流，包括嵌套调用和跟踪
- 模拟成本、延迟、token 数等关键指标
- 直接发送到 OpenLIT 的 OpenTelemetry Collector

## 先决条件

- Python 3.8+
- OpenLIT 平台（运行在本地或远程）
- `curl` 命令行工具（用于检查连接）

## 快速开始

1. 确保 OpenLIT 平台正在运行

   ```bash
   # 如果尚未启动 OpenLIT
   cd /path/to/openlit
   docker compose up -d
   ```

2. 运行模拟工具

   ```bash
   # 使用一键运行脚本
   ./run_simulation.sh
   ```

   或者手动运行各个模拟工具：

   ```bash
   # 安装依赖
   pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp-proto-http

   # 运行简单模拟
   python simulate_llm_data.py

   # 运行复杂工作流模拟
   python simulate_complex_workflow.py
   ```

3. 在 OpenLIT 界面查看数据
   
   访问 http://localhost:3000 (默认 OpenLIT 地址)，使用默认凭据登录：
   - 用户名: `user@openlit.io`
   - 密码: `openlituser`

## 工具说明

### 简单 LLM 调用模拟 (`simulate_llm_data.py`)

生成一系列独立的 LLM 调用，模拟基本的 LLM 使用场景。适合测试基本的 OpenLIT 监控功能。

### 复杂工作流模拟 (`simulate_complex_workflow.py`)

模拟完整的用户会话，包括：
- 初始查询和后续跟进问题
- 嵌入模型调用用于语义搜索
- 主要 LLM 和备用 LLM 调用
- 辅助操作（搜索、分析、代码生成等）
- 嵌套跟踪和完整的上下文传递

适合测试 OpenLIT 的高级分析功能和分层可视化。

## 自定义

您可以修改脚本中的以下参数来适应您的需求：

- `OTLP_ENDPOINT`: OpenTelemetry Collector 的端点
- `LLM_MODELS` / `MODELS`: 模拟的 LLM 模型和提供商
- `SAMPLE_PROMPTS` / `SCENARIOS`: 模拟的提示和场景
- 成本、延迟和 token 数的随机范围

## 故障排除

- 确保 OpenTelemetry Collector 正在端口 4318 上运行
- 检查 Python 依赖是否正确安装
- 查看 OpenLIT 的日志以确认数据是否被接收

## 注意

模拟数据仅用于测试和演示目的，不代表真实的 LLM 调用性能或行为。 