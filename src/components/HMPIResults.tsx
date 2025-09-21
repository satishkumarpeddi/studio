'use client';

import type { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

type HMPIResultsProps = {
  report: Report;
};

const IndexCard = ({ title, value, description }: { title: string; value: number; description: string; }) => (
  <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export function HMPIResults({ report }: HMPIResultsProps) {
  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-tight mb-4">Calculated Indices</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <IndexCard title="Heavy Metal Pollution Index" value={report.hpi} description="Overall pollution status" />
        <IndexCard title="Metal Index" value={report.mi} description="Total metal content" />
        <IndexCard title="Pollution Load Index" value={report.pli} description="Contribution to toxicity" />
      </div>
    </div>
  );
}
