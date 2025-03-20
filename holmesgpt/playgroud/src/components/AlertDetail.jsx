import React from 'react';
import { formatDateTime } from '../utils/formatters';
import { getSeverityStyles, getStatusStyles } from '../utils/formatters';

function AlertDetail({ alert, onInvestigate, isInvestigating }) {
  if (!alert) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-8 text-center text-gray-500">
        <p>Select an alert to view details</p>
      </div>
    );
  }

  const severityStyles = getSeverityStyles(alert.severity);
  const statusStyles = getStatusStyles(alert.status);

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">{alert.alertname}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{alert.summary}</p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            isInvestigating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
          onClick={onInvestigate}
          disabled={isInvestigating}
        >
          {isInvestigating ? 'Investigating...' : 'LLM Investigate'}
        </button>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white ${statusStyles.badge}`}>
                {alert.status}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Severity</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white ${severityStyles.badge}`}>
                {alert.severity}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Started At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {formatDateTime(alert.startsAt)}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {alert.description}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Labels</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <div className="flex flex-wrap gap-2">
                {Object.entries(alert.labels || {}).map(([key, value]) => (
                  <span key={key} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {key}: {value}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default AlertDetail;