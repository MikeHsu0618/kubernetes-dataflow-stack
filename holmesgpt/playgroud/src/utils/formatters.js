import { format, formatDistanceToNow, parseISO } from 'date-fns';

// 格式化日期時間
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};

// 格式化相對時間
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

// 獲取告警嚴重性的樣式
export const getSeverityStyles = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        badge: 'bg-red-600',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        badge: 'bg-yellow-500',
      };
    case 'info':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        badge: 'bg-blue-500',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
        badge: 'bg-gray-500',
      };
  }
};

// 獲取告警狀態的樣式
export const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case 'firing':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        badge: 'bg-red-600',
      };
    case 'resolved':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        badge: 'bg-green-600',
      };
    case 'pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        badge: 'bg-yellow-500',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
        badge: 'bg-gray-500',
      };
  }
}; 