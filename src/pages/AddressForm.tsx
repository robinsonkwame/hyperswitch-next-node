import React, { useState } from "react";


const AddressForm = ({ onNext }) => {
    const [formData, setFormData] = useState({
        name: "Jamal Jarad",
        street: "123 Grand Avenue",
        city: "Detroit",
        state: "MI",
        zip: "48201",
        country: "USA",
        email: "jamal@example.com",
        phone: "123-456-7890"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const isFormComplete = React.useMemo(() => {
        return Object.entries(formData).every(([key, value]) => {
            if (key === "phone" || key === "email") return true;
            return value.trim() !== "";
        });
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormComplete) { // Corrected to function call
            onNext(formData);
        } else {
            alert("Please fill in all fields.");
        }
    };
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Jamal Jarad"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                id="street"
                placeholder="123 Grand Avenue"
                type="text"
                name="street"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.street}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  placeholder="Detroit"
                  type="text"
                  name="city"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  id="zip"
                  placeholder="12345"
                  type="text"
                  name="zip"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                placeholder="Michigan"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number (optional)
              </label>
              <input
                id="phone"
                placeholder="123-456-7890"
                type="tel"
                name="phone"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email (optional)
              </label>
              <input
                id="email"
                placeholder="mallik@email.com"
                type="email"
                name="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <button
              type="submit" 
              className={`px-4 py-2 text-white font-bold rounded-md ${isFormComplete ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300'}`} 
              disabled={!isFormComplete}>
                     <ArrowRightIcon className="h-5 w-5" />
            </button>            
          </div>
        </form>
    );
};

const ArrowRightIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default AddressForm;