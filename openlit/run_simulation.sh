#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}OpenLIT LLM 模拟数据生成工具${NC}"
echo "========================================="

# 检查 OpenLIT 是否正在运行
echo -e "${BLUE}[1/5]${NC} 检查 OpenTelemetry Collector 是否运行在端口 4318..."
if curl -s http://localhost:4318 > /dev/null; then
  echo -e "${GREEN}✓${NC} OpenTelemetry Collector 正在运行"
else
  echo -e "${YELLOW}⚠${NC} 无法连接到 OpenTelemetry Collector。确保 OpenLIT 堆栈已启动。"
  echo "运行: cd /path/to/openlit && docker compose up -d"
  exit 1
fi

# 创建虚拟环境
echo -e "\n${BLUE}[2/5]${NC} 创建 Python 虚拟环境..."
if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo -e "${GREEN}✓${NC} 虚拟环境已创建"
else
  echo -e "${GREEN}✓${NC} 虚拟环境已存在"
fi

# 激活虚拟环境
echo -e "\n${BLUE}[3/5]${NC} 激活虚拟环境..."
source venv/bin/activate
echo -e "${GREEN}✓${NC} 虚拟环境已激活"

# 安装依赖
echo -e "\n${BLUE}[4/5]${NC} 安装所需的 Python 依赖..."
pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp-proto-http

# 运行模拟
echo -e "\n${BLUE}[5/5]${NC} 运行 LLM 调用模拟..."

echo -e "\n${YELLOW}运行简单的 LLM 调用模拟...${NC}"
python simulate_llm_data.py

echo -e "\n${YELLOW}运行复杂的工作流模拟...${NC}"
python simulate_complex_workflow.py

# 停用虚拟环境
deactivate

echo -e "\n${GREEN}模拟完成!${NC}"
echo -e "您现在可以在 OpenLIT 界面 (http://localhost:3000) 查看模拟数据" 