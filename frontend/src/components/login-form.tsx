import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';

type Role = 'customer' | 'vendor';

export function LoginForm({
  className,
  setLoginState,
  ...props
}: {
  className?: string;
  setLoginState: (loginState: boolean) => void;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>('customer');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = role === 'customer'
        ? 'http://localhost:8080/api/customers/login'
        : 'http://localhost:8080/api/vendors/login';

      const response = await axios.post(url, formData);

      if (response.status === 200 || response.status === 201) {
        // Save user role and ID
        localStorage.setItem('userRole', role);
        localStorage.setItem(
          role === 'customer' ? 'customerId' : 'vendorId',
          role === 'customer' ? response.data.customerId : response.data.vendorId
        );

        // Reset form
        setFormData({ username: '', password: '' });

        toast.success(`Logged in as ${role}`);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      toast.error("Sign Up Failed. Please check your details.");
      console.error(error);
    }
  };

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
          onValueChange={(value) => setRole(value as Role)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="vendor">Vendor</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Button variant="link" className="underline underline-offset-4"
          onClick={() => setLoginState(false)}
        >
          Sign up
        </Button>
      </div>
      </form>
      <ToastContainer />
    </>
  );
}
