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
    "service.name": "k8s-assistant-app",
    "service.version": "1.0.0",
    "deployment.environment": "production"
})

# 创建和配置 TracerProvider
tracer_provider = TracerProvider(resource=resource)
otlp_exporter = OTLPSpanExporter(endpoint=OTLP_ENDPOINT)
span_processor = BatchSpanProcessor(otlp_exporter)
tracer_provider.add_span_processor(span_processor)
trace.set_tracer_provider(tracer_provider)

# 获取 tracer
tracer = trace.get_tracer("k8s.assistant", "1.0.0")

# 模拟的 LLM 模型
MODELS = {
    "primary": {
        "name": "gpt-4-turbo",
        "provider": "openai", 
        "cost_per_1k_input": 0.01,
        "cost_per_1k_output": 0.03
    },
    "embedding": {
        "name": "text-embedding-3-large",
        "provider": "openai",
        "cost_per_1k_input": 0.00125,
        "cost_per_1k_output": 0
    },
    "fallback": {
        "name": "claude-3-sonnet",
        "provider": "anthropic",
        "cost_per_1k_input": 0.015,
        "cost_per_1k_output": 0.045
    }
}

# 模拟的用户会话场景
SCENARIOS = [
    {
        "name": "Debugging CrashLoopBackOff",
        "initial_query": "My pod is in CrashLoopBackOff status, how can I debug it?",
        "follow_up_queries": [
            "How do I check the container logs?",
            "The logs show 'out of memory', what should I do?",
            "How do I set memory limits for my pod?"
        ]
    },
    {
        "name": "Setting up Network Policies",
        "initial_query": "How do I secure my Kubernetes cluster with network policies?",
        "follow_up_queries": [
            "Can you show an example of a deny-all policy?",
            "How do I allow traffic just from a specific namespace?",
            "How do I test if my network policy is working?"
        ]
    },
    {
        "name": "Optimizing Resource Usage",
        "initial_query": "My Kubernetes cluster is using a lot of resources, how can I optimize it?",
        "follow_up_queries": [
            "How do I check which pods are using the most CPU?",
            "Can I set up automatic scaling based on CPU usage?",
            "What's the best practice for setting resource limits?"
        ]
    }
]

def calculate_cost(model_info, input_tokens, output_tokens):
    """计算 LLM 调用的成本"""
    input_cost = (input_tokens / 1000) * model_info["cost_per_1k_input"]
    output_cost = (output_tokens / 1000) * model_info["cost_per_1k_output"]
    return input_cost + output_cost

def simulate_llm_call(model_key, prompt, parent_span=None):
    """模拟一个 LLM 调用，带有追踪上下文"""
    model_info = MODELS[model_key]
    
    # 生成随机的评估指标
    latency = random.uniform(0.5, 3.0)
    tokens_input = len(prompt.split()) * random.randint(3, 6)
    tokens_output = random.randint(50, 500)
    
    # 计算成本
    cost = calculate_cost(model_info, tokens_input, tokens_output)
    
    # 模拟成功率
    is_success = random.random() > 0.05  # 95% 成功率
    
    # 创建 LLM 调用的 span
    span_name = f"llm.{model_info['provider']}.completion"
    
    # 如果是 embedding 调用，使用不同的名称
    if model_key == "embedding":
        span_name = f"llm.{model_info['provider']}.embedding"
    
    with tracer.start_as_current_span(
        name=span_name,
        kind=trace.SpanKind.CLIENT
    ) as span:
        # 设置通用属性
        span.set_attribute("llm.vendor", model_info["provider"])
        span.set_attribute("llm.model", model_info["name"])
        span.set_attribute("llm.request.type", "completion" if model_key != "embedding" else "embedding")
        span.set_attribute(SpanAttributes.HTTP_METHOD, "POST")
        span.set_attribute(SpanAttributes.HTTP_URL, f"https://api.{model_info['provider']}.com/v1/chat/completions")
        span.set_attribute("llm.request.id", str(uuid.uuid4()))
        
        # 设置 LLM 特定属性
        span.set_attribute("llm.request.model", model_info["name"])
        span.set_attribute("llm.request.prompt", prompt[:1000])  # 截断过长的提示
        
        if model_key != "embedding":
            span.set_attribute("llm.request.temperature", random.uniform(0, 1))
            span.set_attribute("llm.request.max_tokens", random.randint(500, 2000))
        
        span.set_attribute("llm.tokens.input", tokens_input)
        span.set_attribute("llm.cost.total", cost)
        span.set_attribute("llm.cost.currency", "USD")
        
        # 模拟延迟
        time.sleep(latency)
        
        # 设置响应属性
        if is_success:
            span.set_attribute(SpanAttributes.HTTP_STATUS_CODE, 200)
            
            if model_key != "embedding":
                span.set_attribute("llm.response.content", f"Response to: {prompt[:50]}..." if len(prompt) > 50 else f"Response to: {prompt}")
                span.set_attribute("llm.tokens.output", tokens_output)
                span.set_attribute("llm.usage.total_tokens", tokens_input + tokens_output)
                span.set_attribute("llm.response.finish_reason", "stop")
            else:
                # 嵌入模型的响应不包含文本内容
                span.set_attribute("llm.tokens.output", 0)
                span.set_attribute("llm.usage.total_tokens", tokens_input)
                span.set_attribute("llm.response.finish_reason", "complete")
        else:
            span.set_attribute(SpanAttributes.HTTP_STATUS_CODE, 429)
            span.set_status(trace.Status(trace.StatusCode.ERROR, "Rate limit exceeded"))
            span.record_exception(Exception("Rate limit exceeded"))
        
        # 设置延迟属性
        span.set_attribute("llm.latency", latency)
        
        return {
            "is_success": is_success,
            "tokens_input": tokens_input,
            "tokens_output": tokens_output,
            "cost": cost,
            "latency": latency,
            "span": span
        }

def simulate_user_session():
    """模拟一个完整的用户会话，包括多个查询和 LLM 调用"""
    # 随机选择一个场景
    scenario = random.choice(SCENARIOS)
    session_id = str(uuid.uuid4())
    user_id = f"user_{random.randint(1000, 9999)}"
    
    with tracer.start_as_current_span(
        name=f"user.session.{scenario['name'].lower().replace(' ', '_')}",
        kind=trace.SpanKind.SERVER
    ) as session_span:
        # 设置会话属性
        session_span.set_attribute("session.id", session_id)
        session_span.set_attribute("user.id", user_id)
        session_span.set_attribute("scenario.name", scenario["name"])
        
        # 处理初始查询
        with tracer.start_as_current_span(
            name="process.user.query",
            kind=trace.SpanKind.INTERNAL
        ) as query_span:
            # 设置查询属性
            query_span.set_attribute("query.text", scenario["initial_query"])
            query_span.set_attribute("query.type", "initial")
            query_span.set_attribute("query.timestamp", datetime.now(timezone.utc).isoformat())
            
            # 先进行文本嵌入
            embedding_result = simulate_llm_call(
                "embedding", 
                scenario["initial_query"]
            )
            
            # 然后进行主要的 LLM 调用
            primary_result = simulate_llm_call(
                "primary", 
                scenario["initial_query"]
            )
            
            # 如果主要模型失败，使用备用模型
            if not primary_result["is_success"]:
                fallback_result = simulate_llm_call(
                    "fallback", 
                    scenario["initial_query"]
                )
        
        # 处理跟进查询
        for i, follow_up in enumerate(scenario["follow_up_queries"]):
            # 模拟用户思考时间
            time.sleep(random.uniform(2.0, 5.0))
            
            with tracer.start_as_current_span(
                name="process.user.query",
                kind=trace.SpanKind.INTERNAL
            ) as follow_up_span:
                # 设置查询属性
                follow_up_span.set_attribute("query.text", follow_up)
                follow_up_span.set_attribute("query.type", "follow_up")
                follow_up_span.set_attribute("query.number", i + 1)
                follow_up_span.set_attribute("query.timestamp", datetime.now(timezone.utc).isoformat())
                
                # 进行文本嵌入
                embedding_result = simulate_llm_call(
                    "embedding", 
                    follow_up
                )
                
                # 进行主要的 LLM 调用
                primary_result = simulate_llm_call(
                    "primary", 
                    follow_up
                )
                
                # 随机决定是否需要执行进一步的操作（如搜索、分析等）
                if random.random() > 0.5:
                    with tracer.start_as_current_span(
                        name="process.supplementary.operation",
                        kind=trace.SpanKind.INTERNAL
                    ) as op_span:
                        op_type = random.choice(["search", "analyze", "generate_code"])
                        op_span.set_attribute("operation.type", op_type)
                        op_span.set_attribute("operation.timestamp", datetime.now(timezone.utc).isoformat())
                        
                        # 模拟操作延迟
                        time.sleep(random.uniform(0.5, 1.5))
                        
                        if op_type == "search":
                            op_span.set_attribute("search.query", f"kubernetes {follow_up.split()[0:3]}")
                            op_span.set_attribute("search.results_count", random.randint(5, 20))
                        elif op_type == "analyze":
                            op_span.set_attribute("analyze.target", "log output")
                            op_span.set_attribute("analyze.findings_count", random.randint(2, 8))
                        elif op_type == "generate_code":
                            op_span.set_attribute("code.language", random.choice(["yaml", "bash", "python"]))
                            op_span.set_attribute("code.lines", random.randint(5, 25))

def main():
    """主函数，模拟多个用户会话"""
    print(f"Starting complex workflow simulation, sending data to {OTLP_ENDPOINT}")
    
    # 模拟多个用户会话
    for i in range(5):
        print(f"Simulating user session {i+1}/5...")
        simulate_user_session()
        # 在会话之间暂停
        time.sleep(random.uniform(1.0, 3.0))
    
    # 确保所有 span 都被处理
    span_processor.force_flush()
    print("Complex workflow simulation complete!")

if __name__ == "__main__":
    main() 