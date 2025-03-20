#!/usr/bin/env python3

import logging
import os
from holmes.config import Config
from holmes.core.tools import ToolsetPattern
from holmes.plugins.prompts import load_and_render_prompt
import holmes.plugins.prompts as prompts

# 设置日志级别
logging.basicConfig(level=logging.DEBUG)

print("="*50)
print("TEMPLATE DEBUGGING")
print("="*50)

# 打印模板目录
print(f"Template directory: {prompts.THIS_DIR}")
template_files = os.listdir(prompts.THIS_DIR)
print(f"Template files: {template_files}")

# 加载配置
config = Config.load_from_env()

# 创建工具执行器
tool_executor = config.create_tool_executor(None)

# 获取启用的工具集
enabled_toolsets = tool_executor.enabled_toolsets
print(f"\nFound {len(enabled_toolsets)} enabled toolsets:")
for ts in enabled_toolsets:
    print(f"- {ts.name} (status: {ts.get_status().name})")

# 检查grafana/loki工具集
loki_toolsets = [ts for ts in enabled_toolsets if ts.name == "grafana/loki"]
if loki_toolsets:
    print("\ngrafana/loki toolset found:")
    loki_toolset = loki_toolsets[0]
    print(f"  Name: {loki_toolset.name}")
    print(f"  Status: {loki_toolset.get_status().name}")
    if hasattr(loki_toolset, "config") and loki_toolset.config:
        print(f"  Config: {loki_toolset.config}")
else:
    print("\ngrafana/loki toolset NOT found!")

# 测试内置模板
print("\nRendering _fetch_logs.jinja2 template:")
context = {"enabled_toolsets": enabled_toolsets}
try:
    template_path = "builtin://_fetch_logs.jinja2"
    rendered = load_and_render_prompt(template_path, context)
    print("\nTemplate rendered successfully:")
    print(rendered)
except Exception as e:
    print(f"Error rendering template: {e}")

print("="*50) 