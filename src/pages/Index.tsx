
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { restaurantInfo } from '@/data/menuData';
import { Clock, MapPin, Phone } from 'lucide-react';

const Index = () => {
  return (
    <MobileLayout>
      {/* Hero Section */}
      <div className="relative h-64 -mx-4 -mt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=1374&auto=format&fit=crop" 
          alt="Kebab Express" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 text-white z-20">
          <h1 className="text-3xl font-bold drop-shadow-lg">Kebab Express</h1>
          <p className="mt-1 drop-shadow-md">Najlepší kebab v Leviciach</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="mt-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/menu">
            <Button className="w-full h-20 text-lg bg-kebab-primary hover:bg-kebab-primary/90">
              Pozrieť menu
            </Button>
          </Link>
          <Link to="/cart">
            <Button className="w-full h-20 text-lg bg-kebab-secondary hover:bg-kebab-secondary/90">
              Prejsť do košíka
            </Button>
          </Link>
        </div>
        
        {/* Opening Hours */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-3">
            <Clock className="mr-2 text-kebab-primary" size={20} />
            <h2 className="text-lg font-bold">Otváracie hodiny</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between pr-4">
              <span>Pondelok:</span>
              <span className="font-medium">{restaurantInfo.openingHours.monday}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span>Utorok:</span>
              <span className="font-medium">{restaurantInfo.openingHours.tuesday}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span>Streda:</span>
              <span className="font-medium">{restaurantInfo.openingHours.wednesday}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span>Štvrtok:</span>
              <span className="font-medium">{restaurantInfo.openingHours.thursday}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span>Piatok:</span>
              <span className="font-medium">{restaurantInfo.openingHours.friday}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span>Sobota:</span>
              <span className="font-medium">{restaurantInfo.openingHours.saturday}</span>
            </div>
            <div className="flex justify-between pr-4 col-span-2">
              <span>Nedeľa:</span>
              <span className="font-medium">{restaurantInfo.openingHours.sunday}</span>
            </div>
          </div>
        </div>
        
        {/* Contact */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-3">
            <MapPin className="mr-2 text-kebab-primary" size={20} />
            <h2 className="text-lg font-bold">Kde nás nájdete</h2>
          </div>
          
          <p className="text-sm mb-4">{restaurantInfo.address}</p>
          
          <div className="h-40 rounded-lg overflow-hidden bg-gray-200">
            {/* Here would be a map, for now we'll use a placeholder */}
            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
              Mapa
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <Phone size={16} className="text-kebab-primary mr-2" />
            <span>{restaurantInfo.phone}</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
