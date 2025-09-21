'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { MapPin } from 'lucide-react';
import { SampleData } from '@/lib/types';

type InteractiveMapProps = {
  location: SampleData | undefined | null;
};

export function InteractiveMap({ location }: InteractiveMapProps) {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle>Sample Location</CardTitle>
        {location ? (
          <CardDescription>
            {location.locationName} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
          </CardDescription>
        ) : (
          <CardDescription>Location will be shown here.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full relative rounded-md overflow-hidden bg-muted">
          {mapImage && (
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              fill
              className="object-cover"
              data-ai-hint={mapImage.imageHint}
            />
          )}
          {location && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <MapPin className="h-10 w-10 text-red-500 drop-shadow-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
            Map is for illustrative purposes only.
        </p>
      </CardContent>
    </Card>
  );
}
