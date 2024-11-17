import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change: string;
}

export function MetricCard({ title, value, icon: Icon, change }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <Icon className="h-8 w-8 text-blue-500" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {change}
        </span>
      </div>
      <h2 className="text-xl font-semibold mt-4">{value}</h2>
      <p className="text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );
} 