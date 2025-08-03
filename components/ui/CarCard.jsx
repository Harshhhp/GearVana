"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, CarIcon, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { carMakes, bodyTypes } from "@/lib/data";
import {data} from "@/lib/data";
import { featuredCars } from '@/lib/data';

const CarCard = ({ car }) => {
  const [isSaved, setIsSaved] = useState(car.wishlisted);
  const router = useRouter();

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    setIsSaved(prev => !prev);
    // You can optionally add an API call here to persist save state
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition group py-0">
      <div className="relative h-48">
        {car.images && car.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 duration-300 transition-transform"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 ${
            isSaved
              ? "text-red-500 hover:text-red-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
          onClick={handleToggleSave}
        >
          <Heart className={isSaved ? "fill-current text-red-500" : ""} size={20} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className='flex flex-col mb-2'>
          <h3 className='text-lg font-bold line-clamp-1'>
            {car.make} {car.model}
          </h3>
          <span className='text-xl font-bold text-blue-600'>
            ${car.price.toLocaleString()}
          </span>
        </div>

        <div className='text-gray-600 mb-2 flex items-center'>
          <span>{car.year}</span>
          <span className='mx-2'>•</span>
          <span>{car.transmission}</span>
          <span className='mx-2'>•</span>
          <span>{car.fuelType}</span>
        </div>

        <div className='flex flex-wrap gap-1 mb-4'>
          <Badge variant="outline" className="bg-gray-50">
            {car.bodyType}
          </Badge>
          <Badge variant="outline" className="bg-gray-50">
            {car.mileage.toLocaleString()} miles
          </Badge>
          <Badge variant="outline" className="bg-gray-50">
            {car.color}
          </Badge>
        </div>

        <div>
          <Button
            className="flex-1"
            onClick={() => router.push(`/cars/${car.id}`)}
          >
            View Car
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
