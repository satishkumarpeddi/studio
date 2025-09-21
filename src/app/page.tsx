'use client';

import { useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { DataInputForm } from '@/components/DataInputForm';
import { ReportDisplay } from '@/components/ReportDisplay';
import { InteractiveMap } from '@/components/InteractiveMap';
import type { SampleData, AnalysisResult } from '@/lib/types';
import { getAnalysisReport } from '@/app/actions';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const { toast } = useToast();

  const handleAnalyze = async (data: SampleData) => {
    setIsLoading(true);
    setAnalysisResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await getAnalysisReport(data);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: result.error,
        });
        setAnalysisResult({ report: null, sampleData: data, error: result.error });
      } else {
        setAnalysisResult({ report: result.report, sampleData: data, error: null });
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      setAnalysisResult({ report: null, sampleData: data, error: errorMessage });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setFormKey(Date.now());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PageHeader />
        {analysisResult && (
          <div className="text-center mt-8">
            <Button onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start New Analysis
            </Button>
          </div>
        )}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            {!analysisResult && (
              <DataInputForm
                key={formKey}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
              />
            )}
            {analysisResult && (
               <InteractiveMap location={analysisResult?.sampleData} />
            )}
          </div>
          <div className="lg:col-span-3">
            <ReportDisplay result={analysisResult} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
