#!/usr/bin/env python3

import logging
import os
import yaml
from holmes.config import Config, CUSTOM_TOOLSET_LOCATION
from holmes.core.tools import ToolsetPattern

# 设置日志级别
logging.basicConfig(level=logging.DEBUG)

print("="*50)
print("CONFIG DEBUGGING")
print("="*50)

# 检查配置文件路径
print(f"Default custom toolset location: {CUSTOM_TOOLSET_LOCATION}")
print(f"File exists: {os.path.isfile(CUSTOM_TOOLSET_LOCATION)}")

# 尝试直接打开配置文件并显示内容
if os.path.isfile(CUSTOM_TOOLSET_LOCATION):
    print("\nReading custom toolset file directly:")
    try:
        with open(CUSTOM_TOOLSET_LOCATION, 'r') as f:
            content = f.read()
            print(f"File content:\n{content}")
            
        with open(CUSTOM_TOOLSET_LOCATION, 'r') as f:
            yaml_content = yaml.safe_load(f)
            print(f"YAML parsed content: {yaml_content}")
    except Exception as e:
        print(f"Error reading/parsing file: {e}")

# 加载配置
print("\nLoading config from env:")
config = Config.load_from_env()

# 调用配置加载函数
print("\nCalling load_custom_toolsets_config():")
custom_toolsets = config.load_custom_toolsets_config()
if custom_toolsets:
    print(f"Loaded {len(custom_toolsets)} custom toolsets:")
    for ts in custom_toolsets:
        print(f"- {ts.name} (enabled: {ts.enabled}, path: {ts._path if hasattr(ts, '_path') else None})")
else:
    print("No custom toolsets loaded!")

# 创建工具执行器
print("\nCreating tool executor:")
tool_executor = config.create_tool_executor(None)

# 打印所有启用的工具集
print("\nENABLED TOOLSETS:")
for ts in tool_executor.enabled_toolsets:
    print(f"- {ts.name} (enabled: {ts.get_status().name}, path: {ts._path if hasattr(ts, '_path') else None})")
    if hasattr(ts, 'config') and ts.config:
        print(f"  Config: {ts.config}")
    
print("="*50) 