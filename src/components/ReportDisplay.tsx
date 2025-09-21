'use client';

import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AISummary } from './AISummary';
import { HMPIResults } from './HMPIResults';
import { MetalConcentrationChart } from './MetalConcentrationChart';
import { SampleDetailsTable } from './SampleDetailsTable';
import { CircleDashed, FileWarning } from 'lucide-react';

type ReportDisplayProps = {
  result: AnalysisResult | null;
  isLoading: boolean;
};

function ReportSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-6"><Skeleton className="h-12 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-12 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-12 w-full" /></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-56" /></CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function NoDataPlaceholder() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px] border-dashed">
      <CircleDashed className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-muted-foreground">Awaiting Analysis</h3>
      <p className="text-muted-foreground mt-2">Your report will be displayed here once the analysis is complete.</p>
    </Card>
  );
}

function ErrorDisplay({ message }: { message: string }) {
    return (
        <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px] border-destructive bg-destructive/10">
            <FileWarning className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold text-destructive">Analysis Failed</h3>
            <p className="text-destructive/80 mt-2">{message}</p>
        </Card>
    )
}

export function ReportDisplay({ result, isLoading }: ReportDisplayProps) {
  if (isLoading) {
    return <ReportSkeleton />;
  }

  if (!result) {
    return <NoDataPlaceholder />;
  }

  if (result.error || !result.report) {
      return <ErrorDisplay message={result.error || "An unknown error occurred."} />
  }

  return (
    <div className="space-y-8">
      <AISummary summary={result.report.summary} />
      <HMPIResults report={result.report} />
      <MetalConcentrationChart metals={result.sampleData.metals} />
      <SampleDetailsTable sampleData={result.sampleData} />
    </div>
  );
}
