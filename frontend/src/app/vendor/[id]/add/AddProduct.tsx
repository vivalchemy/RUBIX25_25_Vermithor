"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const AddProduct = () => {
    const vendor = localStorage.getItem("vendorId");

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        rating: '',
        description: '',
        imgLink: '',
        timeToArrive: '',
        peopleRequired: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Include vendorId automatically in the API request payload
            const response = await axios.post('/api/items', { ...formData, vendorId: vendor });
            alert('Product added successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product.');
        }
    };

    const handleCategorySelect = (category: string) => {
        setFormData({ ...formData, category });
    };

    const formFields = [
        { label: 'Name', name: 'name', type: 'text', placeholder: 'Product Name' },
        { label: 'Price', name: 'price', type: 'number', placeholder: 'Product Price' },
        { label: 'Rating', name: 'rating', type: 'number', placeholder: 'Rating (1-5)', min: 1, max: 5, step: 0.1 },
        { label: 'Image Link', name: 'imgLink', type: 'url', placeholder: 'Image URL' },
        { label: 'Time to Arrive', name: 'timeToArrive', type: 'number', placeholder: 'Time (in minutes)' },
        { label: 'People Required', name: 'peopleRequired', type: 'number', placeholder: 'Number of People Required' },
    ];

    return (
        <div className="container mx-auto mt-24 p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formFields.map((field) => (
                                <div key={field.name}>
                                    <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                        {field.label}
                                    </Label>
                                    <Input
                                        type={field.type}
                                        name={field.name}
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        value={formData[field.name as keyof typeof formData]}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full"
                                        required
                                        min={field.min}
                                        max={field.max}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full mt-1">
                                        {formData.category || 'Select Category'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => handleCategorySelect('DRAFTED')}>DRAFTED</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleCategorySelect('ARCHIVED')}>ARCHIVED</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleCategorySelect('READY')}>READY</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div>
                            <Label htmlFor="desc" className="text-sm font-medium text-gray-700">
                                Description
                            </Label>
                            <Textarea
                                name="description"
                                id="description"
                                placeholder="Product Description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full"
                                required
                                rows={4}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Add Product
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};