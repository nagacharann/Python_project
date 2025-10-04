import React, { useState, useEffect, useMemo } from 'react';
import { SaleRecord } from '../types';

interface RecordFormProps {
  record: SaleRecord | null;
  onSave: (record: SaleRecord) => void;
  onClose: () => void;
  sales: SaleRecord[];
}

const RecordForm: React.FC<RecordFormProps> = ({ record, onSave, onClose, sales }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    customerId: '',
    customerName: '',
    productName: '',
    productId: '',
    salesperson: '',
    region: '',
    quantity: '' as number | string,
    unitPrice: '' as number | string,
    discount: '' as number | string,
    image: undefined as string | undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [customerType, setCustomerType] = useState<'new' | 'existing'>('new');


  const existingCustomers = useMemo(() => {
    const customerMap = new Map<string, string>(); // Map<customerName, customerId>
    sales.forEach(sale => {
      if (!customerMap.has(sale.customerName)) {
        customerMap.set(sale.customerName, sale.customerId);
      }
    });
    return Array.from(customerMap, ([name, id]) => ({ name, id })).sort((a, b) => a.name.localeCompare(b.name));
  }, [sales]);

  const totalAmount = useMemo(() => {
    const quantity = Number(formData.quantity) || 0;
    const unitPrice = Number(formData.unitPrice) || 0;
    const discountPercent = Number(formData.discount) || 0;
    return (quantity * unitPrice) * (1 - (discountPercent / 100));
  }, [formData.quantity, formData.unitPrice, formData.discount]);


  useEffect(() => {
    if (record) {
      setFormData({
        date: record.date,
        time: record.time,
        customerId: record.customerId,
        customerName: record.customerName,
        productName: record.productName,
        productId: record.productId,
        salesperson: record.salesperson,
        region: record.region,
        quantity: record.quantity,
        unitPrice: record.unitPrice,
        discount: record.discount * 100,
        image: record.image,
      });
      setImagePreview(record.image);
    } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        setFormData(prev => ({
            ...prev,
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`,
        }));
    }
  }, [record]);

  // Auto-generate/fetch Product ID based on Product Name for NEW records
  useEffect(() => {
    if (record) return;

    const customerName = formData.customerName?.trim().toUpperCase();
    const productName = formData.productName?.trim().toUpperCase();

    if (customerName.length >= 3 && productName.length >= 2) {
      const prefix = customerName.substring(0, 3) + productName.substring(0, 2);
      let maxIndex = 0;
      sales.forEach(sale => {
        if (sale.productId.startsWith(prefix)) {
          const indexStr = sale.productId.substring(prefix.length);
          const index = parseInt(indexStr, 10);
          if (!isNaN(index) && index > maxIndex) {
            maxIndex = index;
          }
        }
      });
      const newIndex = maxIndex + 1;
      const newProductId = `${prefix}${newIndex}`;
      setFormData(prev => ({ ...prev, productId: newProductId }));
    } else {
      setFormData(prev => ({ ...prev, productId: '' }));
    }
  }, [formData.customerName, formData.productName, record, sales]);

  // Auto-generate/fetch Customer ID based on Customer Name for NEW records
  useEffect(() => {
    if (record || customerType === 'existing') return;

    const customerName = formData.customerName?.trim();
    if (!customerName) {
        setFormData(prev => ({ ...prev, customerId: '' }));
        return;
    }

    const upperCaseCustomerName = customerName.toUpperCase();
    const existingCustomer = sales.find(s => s.customerName.toUpperCase() === upperCaseCustomerName);

    if (existingCustomer) {
        setFormData(prev => ({ ...prev, customerId: existingCustomer.customerId }));
    } else {
        const prefix = `CI${upperCaseCustomerName.replace(/[^A-Z0-9]/g, '').substring(0, 5).padEnd(5, 'X')}`;
        let maxIndex = 0;
        sales.forEach(sale => {
            if (sale.customerId.startsWith(prefix)) {
                const indexStr = sale.customerId.substring(prefix.length);
                const index = parseInt(indexStr, 10);
                if (!isNaN(index) && index > maxIndex) {
                    maxIndex = index;
                }
            }
        });
        const newIndex = String(maxIndex + 1).padStart(3, '0');
        const newCustomerId = `${prefix}${newIndex}`;
        setFormData(prev => ({ ...prev, customerId: newCustomerId }));
    }
  }, [formData.customerName, sales, record, customerType]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === 'discount') {
      if (value !== '') {
        const num = Math.round(Number(value));
        if (num > 25) {
          value = '25';
        } else if (num < 0) {
          value = '0';
        } else {
          value = String(num);
        }
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleExistingCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const selectedCustomer = existingCustomers.find(c => c.id === customerId);

    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerName: selectedCustomer.name,
        customerId: selectedCustomer.id,
      }));
    } else {
        setFormData(prev => ({
        ...prev,
        customerName: '',
        customerId: '',
      }));
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData({ ...formData, image: imageUrl });
    }
  };
  
  const handleCustomerTypeChange = (type: 'new' | 'existing') => {
    setCustomerType(type);
    setFormData(prev => ({ ...prev, customerName: '', customerId: ''}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recordToSave: SaleRecord = {
        id: record?.id ?? 0,
        date: formData.date,
        time: formData.time,
        customerId: formData.customerId,
        customerName: formData.customerName,
        productName: formData.productName,
        productId: formData.productId,
        salesperson: formData.salesperson,
        region: formData.region,
        quantity: Number(formData.quantity) || 0,
        unitPrice: Number(formData.unitPrice) || 0,
        discount: (Number(formData.discount) || 0) / 100,
        totalAmount,
        image: formData.image,
    };
    onSave(recordToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">{record ? 'Edit Sale Record' : 'Add New Sale Record'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                <input id="time" type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            
            {/* --- Customer Selection Logic --- */}
            {record ? (
                 <>
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
                        <input id="customerName" name="customerName" value={formData.customerName} readOnly className="w-full bg-gray-900 text-gray-400 rounded p-2 border-gray-700 cursor-not-allowed" />
                    </div>
                     <div>
                        <label htmlFor="customerId" className="block text-sm font-medium text-gray-300 mb-1">Customer ID</label>
                        <input id="customerId" name="customerId" value={formData.customerId} readOnly className="w-full bg-gray-900 text-gray-400 rounded p-2 border-gray-700 cursor-not-allowed" />
                    </div>
                </>
            ) : (
                <>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Customer Type</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center text-white">
                                <input type="radio" name="customerType" value="new" checked={customerType === 'new'} onChange={() => handleCustomerTypeChange('new')} className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500" />
                                <span className="ml-2">New Customer</span>
                            </label>
                            <label className="flex items-center text-white">
                                <input type="radio" name="customerType" value="existing" checked={customerType === 'existing'} onChange={() => handleCustomerTypeChange('existing')} className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500" />
                                <span className="ml-2">Existing Customer</span>
                            </label>
                        </div>
                    </div>
                    {customerType === 'new' ? (
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
                            <input id="customerName" name="customerName" placeholder="e.g., Stark Industries" value={formData.customerName} onChange={handleChange} required className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="existingCustomer" className="block text-sm font-medium text-gray-300 mb-1">Select Existing Customer</label>
                            <select
                                id="existingCustomer"
                                value={formData.customerId}
                                onChange={handleExistingCustomerChange}
                                required
                                className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- Select a customer --</option>
                                {existingCustomers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                     <div>
                        <label htmlFor="customerId" className="block text-sm font-medium text-gray-300 mb-1">Customer ID (Auto-filled)</label>
                        <input id="customerId" name="customerId" placeholder="Will be filled..." value={formData.customerId} readOnly required className="w-full bg-gray-900 text-gray-400 rounded p-2 border-gray-700 cursor-not-allowed" />
                    </div>
                </>
            )}
            
            <div>
                <label htmlFor="salesperson" className="block text-sm font-medium text-gray-300 mb-1">Salesperson</label>
                <input id="salesperson" name="salesperson" placeholder="e.g., Tony Stark" value={formData.salesperson} onChange={handleChange} required className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
             <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-1">Region</label>
                <input id="region" name="region" placeholder="e.g., North America" value={formData.region} onChange={handleChange} required className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                <input id="productName" name="productName" placeholder="e.g., Arc Reactor Core" value={formData.productName} onChange={handleChange} required className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-300 mb-1">Product ID (Auto-generated)</label>
                <input id="productId" name="productId" placeholder="Will be generated..." value={formData.productId} readOnly required className="w-full bg-gray-900 text-gray-400 rounded p-2 border-gray-700 cursor-not-allowed" />
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                <input id="quantity" type="number" name="quantity" placeholder="e.g., 10" value={formData.quantity} onChange={handleChange} required min="0" className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-300 mb-1">Unit Price</label>
                <input id="unitPrice" type="number" name="unitPrice" placeholder="e.g., 50000" value={formData.unitPrice} onChange={handleChange} required min="0" step="0.01" className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-300 mb-1">Discount (%)</label>
                <input id="discount" type="number" name="discount" placeholder="e.g., 10 for 10%" value={formData.discount} onChange={handleChange} min="0" max="25" step="1" className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-300 mb-1">Total Amount (Calculated)</label>
                <input id="totalAmount" type="text" name="totalAmount" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)} readOnly className="w-full bg-gray-900 text-gray-400 rounded p-2 border-gray-700 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
            <div className="flex items-center space-x-4">
              <input type="file" name="image" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-md">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;