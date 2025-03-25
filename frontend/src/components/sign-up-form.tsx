import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover
import { useRouter } from 'next/navigation';

export function SignUpForm({
  className,
  setLoginState,
  ...props
}: { className?: string, setLoginState: (loginState: boolean) => void }) {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location_lat: 0,
    location_lon: 0,
    address: '',
    phone: '',
    shopName: '',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          q: query,
          key: process.env.NEXT_PUBLIC_GEOCODING_API,
          limit: 5,
        },
      });
      const results = response.data.results;
      setSuggestions(results.map((result: any) => result.formatted));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectLocation = async (location: string) => {
    try {
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          q: location,
          key: process.env.NEXT_PUBLIC_GEOCODING_API,
        },
      });
      const result = response.data.results[0];
      const coords: [number, number] = [result.geometry.lat, result.geometry.lng];
      setFormData({ ...formData, address: location, location_lat: coords[0], location_lon: coords[1] });
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = role === 'customer'
        ? `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/customers`
        : `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/vendors`;

      const payload = role === 'customer'
        ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          phone: formData.phone,
          location_lat: formData.location_lat,
          location_lon: formData.location_lon
        }
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          shopName: formData.shopName,
          location_lat: formData.location_lat,
          location_lon: formData.location_lon
        };

      const response = await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        // Save user role and ID
        localStorage.setItem('userRole', role);
        localStorage.setItem(
          role === 'customer' ? 'customerId' : 'vendorId',
          role === 'customer' ? response.data.customerId : response.data.vendorId
        );

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          address: '',
          phone: '',
          shopName: '', 
          location_lat: 0,
          location_lon: 0
        });

        toast.success(`Registered as ${role}`);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }

    } catch (error) {
      toast.error("Sign Up Failed. Please check your details.");
      console.error(error);
    }
  };

  const renderAdditionalFields = () => {
    if (role === 'customer') {
      return (
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      )
    }

    if (role === 'vendor') {
      return (
        <>
          <div className="grid gap-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              type="text"
              placeholder="Enter your shop name"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Shop Address</Label>
            <Popover>
              <PopoverTrigger>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter shop address"
                  value={formData.address}
                  onChange={(e) => {
                    handleChange(e);
                    fetchSuggestions(e.target.value);
                  }}
                  required
                />
              </PopoverTrigger>
              <PopoverContent className="max-h-60 overflow-auto w-full p-2">
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectLocation(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )
    }
  }

  return (
    <>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <Tabs
          defaultValue="customer"
          value={role}
          onValueChange={(value) => setRole(value as 'customer' | 'vendor')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="vendor">Vendor</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Popover>
              <PopoverTrigger>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => {
                    handleChange(e);
                    fetchSuggestions(e.target.value);
                  }}
                  required
                />
              </PopoverTrigger>
              <PopoverContent className="max-h-60 overflow-auto w-full p-2">
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectLocation(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          {renderAdditionalFields()}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button variant="link" className="underline underline-offset-4"
            onClick={() => setLoginState(true)}
          >
            Login
          </Button>
        </div>
      </form>
      <ToastContainer />
    </>
  )
}
