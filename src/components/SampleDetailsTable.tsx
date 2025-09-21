'use client';

import type { SampleData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

type SampleDetailsTableProps = {
  sampleData: SampleData;
};

export function SampleDetailsTable({ sampleData }: SampleDetailsTableProps) {

  const handleExport = () => {
    const headers = ['Metal', 'Concentration (mg/L)'];
    const rows = sampleData.metals.map(metal => [metal.name, metal.value]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Sample Location,${sampleData.locationName}\n`;
    csvContent += `Coordinates,${sampleData.latitude},${sampleData.longitude}\n`;
    csvContent += `Collection Date,${format(sampleData.collectionDate, 'yyyy-MM-dd')}\n\n`;

    csvContent += headers.join(",") + "\n";
    rows.forEach(rowArray => {
        let row = rowArray.join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sample_data_${sampleData.locationName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Submitted Sample Details</CardTitle>
        <CardDescription>A summary of the data you provided for analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
            <div><strong>Location:</strong> {sampleData.locationName}</div>
            <div><strong>Latitude:</strong> {sampleData.latitude}</div>
            <div><strong>Longitude:</strong> {sampleData.longitude}</div>
            <div><strong>Collection Date:</strong> {format(sampleData.collectionDate, 'PPP')}</div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heavy Metal</TableHead>
              <TableHead className="text-right">Concentration (mg/L)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.metals.map((metal) => (
              <TableRow key={metal.id}>
                <TableCell>{metal.name}</TableCell>
                <TableCell className="text-right font-mono">{metal.value.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export as CSV
        </Button>
      </CardFooter>
    </Card>
  );
}
