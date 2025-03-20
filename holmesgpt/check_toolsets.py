#!/usr/bin/env python3

import logging
from holmes.config import Config
from holmes.core.tools import ToolsetPattern

# 设置日志级别
logging.basicConfig(level=logging.DEBUG)

# 加载配置
config = Config.load_from_env()

# 创建工具执行器
tool_executor = config.create_tool_executor(None)

# 打印所有启用的工具集
print("="*50)
print("ENABLED TOOLSETS:")
for ts in tool_executor.enabled_toolsets:
    print(f"- {ts.name} (from {ts.get_path()})")
    
# 打印所有工具
print("\nAVAILABLE TOOLS:")
for tool_name in tool_executor.tools_by_name.keys():
    print(f"- {tool_name}")

print("="*50) 