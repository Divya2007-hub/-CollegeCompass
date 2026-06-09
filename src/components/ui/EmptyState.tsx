// src/components/ui/EmptyState.tsx
// Friendly empty state with icon, title, and optional action

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export default function EmptyState({ icon = "🔍", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>}
      {action && (
        action.href ? (
          <a href={action.href} className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
            {action.label}
          </a>
        ) : (
          <button onClick={action.onClick} className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
