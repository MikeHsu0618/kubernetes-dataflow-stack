#!/usr/bin/env python3
import time
import random
import uuid
import json
from datetime import datetime, timezone

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.semconv.trace import SpanAttributes

# OpenLIT 遥测配置
OTLP_ENDPOINT = "http://localhost:4318/v1/traces"

# 配置 OpenTelemetry
resource = Resource.create({
    "service.name": "llm-simulation",
    "service.version": "1.0.0",
    "deployment.environment": "simulation"
})

# 创建和配置 TracerProvider
tracer_provider = TracerProvider(resource=resource)
otlp_exporter = OTLPSpanExporter(endpoint=OTLP_ENDPOINT)
span_processor = BatchSpanProcessor(otlp_exporter)
tracer_provider.add_span_processor(span_processor)
trace.set_tracer_provider(tracer_provider)

# 获取 tracer
tracer = trace.get_tracer("llm.simulation", "1.0.0")

# 模拟的 LLM 模型和提供商
LLM_MODELS = ["gpt-4", "gpt-3.5-turbo", "claude-2", "llama-2-70b", "mistral-7b"]
LLM_PROVIDERS = ["openai", "anthropic", "meta", "mistral"]

# 模拟的用户提示和 LLM 响应
SAMPLE_PROMPTS = [
    "Tell me about Kubernetes architecture",
    "How to debug a pod that's stuck in CrashLoopBackOff?",
    "What's the difference between a Deployment and a StatefulSet?",
    "How to configure resource limits for a container?",
    "Explain how to set up a blue-green deployment in Kubernetes",
    "What are the best practices for Kubernetes security?",
    "How to implement autoscaling in Kubernetes?",
    "Explain Kubernetes network policies",
    "How to monitor Kubernetes clusters?",
    "What's the purpose of a Service Account in Kubernetes?"
]

SAMPLE_RESPONSES = [
    "Kubernetes is a container orchestration platform that...",
    "To debug a pod in CrashLoopBackOff, first check the logs using kubectl logs...",
    "Deployments are designed for stateless applications, while StatefulSets...",
    "Resource limits can be configured in the pod spec under the resources section...",
    "Blue-green deployments in Kubernetes can be implemented using services with selectors...",
    "Kubernetes security best practices include using RBAC, network policies...",
    "Autoscaling in Kubernetes can be configured using the Horizontal Pod Autoscaler...",
    "Network policies in Kubernetes allow you to control traffic flow between pods...",
    "Monitoring Kubernetes clusters can be done using tools like Prometheus and Grafana...",
    "Service Accounts in Kubernetes provide an identity for processes running in pods..."
]

def generate_llm_call():
    """生成一个模拟的 LLM 调用"""
    model = random.choice(LLM_MODELS)
    provider = random.choice(LLM_PROVIDERS)
    prompt_idx = random.randint(0, len(SAMPLE_PROMPTS) - 1)
    prompt = SAMPLE_PROMPTS[prompt_idx]
    response = SAMPLE_RESPONSES[prompt_idx]
    
    # 生成随机的评估指标
    latency = random.uniform(0.5, 3.0)
    tokens_input = len(prompt.split()) * random.randint(2, 4)
    tokens_output = len(response.split()) * random.randint(2, 4)
    
    # 模拟成功率
    is_success = random.random() > 0.1  # 90% 成功率
    
    return {
        "model": model,
        "provider": provider,
        "prompt": prompt,
        "response": response,
        "latency": latency,
        "tokens_input": tokens_input,
        "tokens_output": tokens_output,
        "is_success": is_success,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

def simulate_llm_call():
    """模拟一个 LLM 调用并发送遥测数据到 OpenLIT"""
    call_data = generate_llm_call()
    
    with tracer.start_as_current_span(
        name=f"llm.{call_data['provider']}.completion",
        kind=trace.SpanKind.CLIENT
    ) as span:
        # 设置通用属性
        span.set_attribute("llm.vendor", call_data["provider"])
        span.set_attribute("llm.model", call_data["model"])
        span.set_attribute("llm.request.type", "completion")
        span.set_attribute(SpanAttributes.HTTP_METHOD, "POST")
        span.set_attribute(SpanAttributes.HTTP_URL, f"https://api.{call_data['provider']}.com/v1/chat/completions")
        
        # 设置 LLM 特定属性
        span.set_attribute("llm.request.model", call_data["model"])
        span.set_attribute("llm.request.prompt", call_data["prompt"])
        span.set_attribute("llm.request.temperature", random.uniform(0, 1))
        span.set_attribute("llm.request.max_tokens", random.randint(500, 2000))
        span.set_attribute("llm.tokens.input", call_data["tokens_input"])
        
        # 模拟延迟
        time.sleep(call_data["latency"])
        
        # 设置响应属性
        if call_data["is_success"]:
            span.set_attribute(SpanAttributes.HTTP_STATUS_CODE, 200)
            span.set_attribute("llm.response.content", call_data["response"])
            span.set_attribute("llm.tokens.output", call_data["tokens_output"])
            span.set_attribute("llm.usage.total_tokens", call_data["tokens_input"] + call_data["tokens_output"])
            span.set_attribute("llm.response.finish_reason", "stop")
        else:
            span.set_attribute(SpanAttributes.HTTP_STATUS_CODE, 429)
            span.set_status(trace.Status(trace.StatusCode.ERROR, "Rate limit exceeded"))
            span.record_exception(Exception("Rate limit exceeded"))
        
        # 设置完成时间
        span.set_attribute("llm.latency", call_data["latency"])

def main():
    """主函数，模拟多个 LLM 调用"""
    print(f"Starting LLM simulation, sending data to {OTLP_ENDPOINT}")
    
    # 模拟一系列调用
    for i in range(20):
        print(f"Simulating LLM call {i+1}/20...")
        simulate_llm_call()
        # 随机暂停
        time.sleep(random.uniform(0.5, 2.0))
    
    # 确保所有 span 都被处理
    span_processor.force_flush()
    print("Simulation complete!")

if __name__ == "__main__":
    main() 