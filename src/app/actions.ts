'use server';

import { generateHMPISummary } from '@/ai/flows/generate-hmpi-summary';
import type { SampleData, Report } from '@/lib/types';
import { z } from 'zod';

const formSchema = z.object({
  locationName: z.string().min(1, 'Location name is required.'),
  latitude: z.coerce.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
  longitude: z.coerce.number().min(-180, "Invalid longitude").max(180, "Invalid longitude"),
  collectionDate: z.date(),
  metals: z.array(z.object({
    id: z.string(),
    name: z.string(),
    value: z.coerce.number().min(0, 'Value must be non-negative'),
  })).min(1, 'At least one metal concentration is required.'),
});

// A simple mock calculation for HMPI.
// A real implementation would use a proper scientific formula.
function calculateIndices(metals: SampleData['metals']) {
  const totalConcentration = metals.reduce((acc, metal) => acc + metal.value, 0);
  const hpi = totalConcentration * 10.5; // Mock formula
  const mi = totalConcentration / metals.length; // Mock formula
  const pli = Math.pow(metals.reduce((acc, m) => acc * (m.value > 0 ? m.value : 1), 1), 1 / metals.length); // Mock formula
  
  return { 
    hpi: parseFloat(hpi.toFixed(2)), 
    mi: parseFloat(mi.toFixed(2)), 
    pli: parseFloat(pli.toFixed(2)) 
  };
}

export async function getAnalysisReport(data: SampleData): Promise<{ report: Report | null, error: string | null }> {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    console.error('Validation errors:', validation.error.flatten().fieldErrors);
    return { report: null, error: 'Invalid input data. Please check your entries.' };
  }
  
  try {
    const { hpi, mi, pli } = calculateIndices(data.metals);
    
    const reportDataForAI = {
      location: data.locationName,
      date: data.collectionDate.toISOString().split('T')[0],
      metalConcentrations: data.metals.map(m => ({ [m.name]: m.value })),
      calculatedIndices: { HPI: hpi, MI: mi, PLI: pli }
    };
    
    const aiResult = await generateHMPISummary({
      jsonData: JSON.stringify(reportDataForAI, null, 2),
    });
    
    const report: Report = {
      summary: aiResult.summary,
      hpi,
      mi,
      pli,
    };
    
    return { report, error: null };
    
  } catch (e) {
    console.error(e);
    return { report: null, error: 'Failed to generate AI analysis. The service may be unavailable.' };
  }
}
