import React from 'react';
import ReactMarkdown from 'react-markdown';

function AnalysisResult({ analysis, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-700">AI is analyzing the alert...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message || 'An error occurred during analysis'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-8 text-center text-gray-500">
        <p>Click "LLM Investigate" to analyze the selected alert</p>
      </div>
    );
  }

  // 從 API 響應中提取分析結果
  const analysisText = analysis.analysis || analysis.result || analysis.answer || '';
  
  // 提取工具調用信息（如果有）
  const toolCalls = analysis.tool_calls || [];
  const toolCallResults = analysis.tool_call_results || [];

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">AI Analysis</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Root cause analysis and recommendations
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="prose prose-indigo max-w-none markdown-content">
          <ReactMarkdown>{analysisText}</ReactMarkdown>
        </div>
        
        {/* 顯示工具調用信息（如果有） */}
        {toolCalls.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900">Tools Used</h4>
            <div className="mt-2 space-y-4">
              {toolCalls.map((tool, index) => (
                <div key={index} className="rounded-md bg-gray-50 p-4">
                  <p className="font-medium text-gray-700">{tool.name || 'Tool'}</p>
                  <pre className="mt-1 text-sm text-gray-600 overflow-auto">
                    {JSON.stringify(tool.arguments || {}, null, 2)}
                  </pre>
                  {toolCallResults[index] && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Result:</p>
                      <pre className="mt-1 text-sm text-gray-600 overflow-auto">
                        {typeof toolCallResults[index] === 'object' 
                          ? JSON.stringify(toolCallResults[index], null, 2)
                          : toolCallResults[index]}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisResult; 