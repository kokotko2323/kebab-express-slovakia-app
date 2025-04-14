
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { restaurantInfo } from '@/data/menuData';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useRestaurantStatus } from '@/hooks/useRestaurantStatus';

const Index = () => {
  const { isOpen, customMessage } = useRestaurantStatus();
  
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
      
      {/* Restaurant Status */}
      {!isOpen && customMessage && (
        <div className="mt-4 bg-red-100 border border-red-200 rounded-lg p-3 text-red-700 text-center">
          <p className="font-medium">Reštaurácia je momentálne zatvorená</p>
          {customMessage && <p className="text-sm mt-1">{customMessage}</p>}
        </div>
      )}
      
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
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium w-1/3">Pondelok:</span>
              <span className="w-2/3">{restaurantInfo.openingHours.monday}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium w-1/3">Utorok:</span>
              <span className="w-2/3">{restaurantInfo.openingHours.tuesday}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium w-1/3">Streda:</span>
              <span className="w-2/3">{restaurantInfo.openingHours.wednesday}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium w-1/3">Štvrtok:</span>
              <span className="w-2/3">{restaurantInfo.openingHours.thursday}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium w-1/3">Piatok:</span>
              <span className="w-2/3">{restaurantInfo.openingHours.friday}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium w-1/3">Sobota:</span>
              <span className="w-2/3">{restaurantInfo.openingHours.saturday}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium w-1/3">Nedeľa:</span>
              <span className="w-2/3">{restaurantInfo.openingHours.sunday}</span>
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
          
          <div className="rounded-lg overflow-hidden bg-gray-200 h-auto">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.4289596883445!2d18.604208800000002!3d48.2176141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476add8ffd928399%3A0xa6f647add0fc009e!2sAnkara%20Kebab!5e0!3m2!1sen!2ssk!4v1744628308326!5m2!1sen!2ssk" 
              width="100%" 
              height="300" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Kebab Express Location"
            ></iframe>
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
