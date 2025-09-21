'use server';

/**
 * @fileOverview A flow to generate a summary of the HMPI report using AI.
 *
 * - generateHMPISummary - A function that handles the HMPI report summarization process.
 * - GenerateHMPISummaryInput - The input type for the generateHMPISummary function.
 * - GenerateHMPISummaryOutput - The return type for the generateHMPISummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHMPISummaryInputSchema = z.object({
  jsonData: z.string().describe('The HMPI report data in JSON format.'),
});
export type GenerateHMPISummaryInput = z.infer<typeof GenerateHMPISummaryInputSchema>;

const GenerateHMPISummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the HMPI report.'),
});
export type GenerateHMPISummaryOutput = z.infer<typeof GenerateHMPISummaryOutputSchema>;

export async function generateHMPISummary(input: GenerateHMPISummaryInput): Promise<GenerateHMPISummaryOutput> {
  return generateHMPISummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHMPISummaryPrompt',
  input: {schema: GenerateHMPISummaryInputSchema},
  output: {schema: GenerateHMPISummaryOutputSchema},
  prompt: `You are an environmental science assistant. Based on the following HMPI report data, provide a concise summary (max 150 words) for a non-technical stakeholder. Highlight the overall pollution level, identify the heavy metals of greatest concern, and state the public health implications. Data: {{{jsonData}}}`,
});

const generateHMPISummaryFlow = ai.defineFlow(
  {
    name: 'generateHMPISummaryFlow',
    inputSchema: GenerateHMPISummaryInputSchema,
    outputSchema: GenerateHMPISummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
