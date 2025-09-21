'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FlaskConical, Loader2, MapPin, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { SampleData } from '@/lib/types';

const formSchema = z.object({
  locationName: z.string().min(1, 'Location name is required.'),
  latitude: z.coerce.number().min(-90, "Must be between -90 and 90").max(90, "Must be between -90 and 90"),
  longitude: z.coerce.number().min(-180, "Must be between -180 and 180").max(180, "Must be between -180 and 180"),
  collectionDate: z.date({ required_error: 'A collection date is required.' }),
  metals: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Metal name is required.'),
    value: z.coerce.number().min(0, 'Must be non-negative'),
  })).min(1, 'At least one metal sample is required.'),
});

type DataInputFormProps = {
  onAnalyze: (data: SampleData) => void;
  isLoading: boolean;
};

const defaultMetals = [
  { id: 'As', name: 'Arsenic (As)', value: '' },
  { id: 'Pb', name: 'Lead (Pb)', value: '' },
  { id: 'Cd', name: 'Cadmium (Cd)', value: '' },
  { id: 'Cr', name: 'Chromium (Cr)', value: '' },
];

export function DataInputForm({ onAnalyze, isLoading }: DataInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: '',
      latitude: 0,
      longitude: 0,
      metals: defaultMetals.map(m => ({ ...m, value: 0 })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metals",
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAnalyze(values as SampleData);
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>1. Input Sample Data</CardTitle>
        <CardDescription>Provide the details of your groundwater sample.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., Central Park Well" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.000001" placeholder="e.g., 40.785091" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.000001" placeholder="e.g., -73.968285" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="collectionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Collection Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormLabel>Heavy Metal Concentrations (mg/L)</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`metals.${index}.name`}
                    render={({ field: nameField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Metal Name" {...nameField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`metals.${index}.value`}
                    render={({ field: valueField }) => (
                      <FormItem className="w-28">
                        <FormControl>
                          <Input type="number" step="0.001" placeholder="Value" {...valueField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `custom-${Date.now()}`, name: '', value: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Metal
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Analyze Sample
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
