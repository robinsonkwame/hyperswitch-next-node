import React from 'react';
import {Card, CardBody} from "@nextui-org/card";
import { Input } from "@nextui-org/input";

interface CustomerDetails {
  name: string;
  street: string;
  state: string;
  country: string;
  zipCode: string;
  email: string;
  phone: string;
}

interface AddressComponentProps {
  customerDetails: CustomerDetails;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddressComponent: React.FC<AddressComponentProps> = ({ customerDetails, handleInputChange }) => {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-md">
        <div className="text-lg font-semibold">Customer Details</div>
      <CardBody className="grid gap-4">
        <div className="grid gap-1">
          <Input id="name" placeholder="Enter your name" value={customerDetails.name} onChange={handleInputChange} />
        </div>
        <div className="grid gap-1">
          <Input id="street" placeholder="Street Address" value={customerDetails.street} onChange={handleInputChange} />
        </div>
        <div className="grid gap-1">
          <Input id="state" placeholder="State" value={customerDetails.state} onChange={handleInputChange} />
        </div>
        <div className="grid gap-1">
          <Input id="country" placeholder="Country" value={customerDetails.country} onChange={handleInputChange} />
        </div>
        <div className="grid gap-1">
          <Input id="zipCode" placeholder="Zip Code" value={customerDetails.zipCode} onChange={handleInputChange} />
        </div>
        <div className="grid gap-1">
          <Input id="email" type="email" placeholder="Enter your email" value={customerDetails.email} onChange={handleInputChange} />
        </div>
        <div className="grid gap-1">
          <Input id="phone" type="tel" placeholder="Enter your phone number" value={customerDetails.phone} onChange={handleInputChange} />
        </div>
      </CardBody>
    </Card>
  );
};

export default AddressComponent;