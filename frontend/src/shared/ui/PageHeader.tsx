import type { ReactNode } from 'react';
import { Link } from 'react-router';

type Breadcrumb = {
  label: string;
  to?: string;
};

type PageHeaderProps = {
  breadcrumb?: Breadcrumb[];
  title: string;
  badge?: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ breadcrumb, title, badge, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
      <div>
        {breadcrumb && breadcrumb.length > 0 ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {breadcrumb.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {crumb.to ? (
                  <Link to={crumb.to} className="font-medium hover:text-blue-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-700">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        ) : null}

        <div className={`flex flex-wrap items-center gap-3 ${breadcrumb?.length ? 'mt-4' : ''}`}>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
          {badge}
        </div>

        {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
      </div>

      {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </div>
  );
}
