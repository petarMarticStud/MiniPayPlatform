import React, { useState, useEffect } from 'react';
import paymentProviderService from '../services/paymentProviderService';
import PaymentProvider from '../models/PaymentProvider';

function PaymentProviderForm({ providerId, onSaveSuccess, onCancel }) {
    const [provider, setProvider] = useState(new PaymentProvider(0, '', '', '', '', false));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
        if (providerId && providerId !== 0)
        {
            setIsNew(false);
            setLoading(true);
            const fetchProvider = async () => {
                try {
                    const data = await paymentProviderService.getProviderById(providerId);
                    if (data) {
                        setProvider(data);
                    } else {
                        setError(`Provider with ID ${providerId} not found.`);
                    }
                } catch (err) {
                    setError("Error at loading process " + err.message);
                    console.error("Error fetching provider for edit:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProvider();
        }
        else
        {
            setIsNew(true);
            setProvider(new PaymentProvider(0, '', '', '', '', false));
        }
    }, [providerId]);

    const handleChange = (e) =>
    {
        const { name, value, type, checked } = e.target;
        setProvider(prevProvider =>
        ({
            ...prevProvider,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Einfache Validierung
        if (!provider.name || provider.name.trim() === '')
        {
            setError("Name required.");
            setLoading(false);
            return;
        }
        if (!provider.currency || provider.currency.trim() === '')
        {
            setError("Currency required.");
            setLoading(false);
            return;
        }
        if (provider.currency.length !== 3)
        {
            setError("Currency has to be 3-digit ISO-Code  (e.g. USD).");
            setLoading(false);
            return;
        }

        try
        {
            if (isNew)
            {
                await paymentProviderService.addProvider(provider);
            }
            else
            {
                await paymentProviderService.updateProvider(provider);
            }

            onSaveSuccess();
        }

        catch (err)
        {
            setError("Error at saving: " + err.message);
            console.error("Error saving provider:", err);
        }
        finally
        {
            setLoading(false);
        }
    };

    if (loading && !isNew) return <div className="p-4 text-center">Loading form...</div>;

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
                {isNew ? 'Add new provider' : `Edit provider (ID: ${provider.id})`}
            </h2>

            {error && <div className="mb-4 p-3 bg-red-200 text-red-800 rounded text-sm">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={provider.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={provider.description || ''}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">URL:</label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={provider.url || ''}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="currency" className="block text-gray-700 text-sm font-bold mb-2">Currency (e.g. USD):</label>
                    <input
                        type="text"
                        id="currency"
                        name="currency"
                        value={provider.currency}
                        onChange={handleChange}
                        maxLength="3"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={provider.isActive}
                        onChange={handleChange}
                        className="mr-2 leading-tight"
                    />
                    <label htmlFor="isActive" className="text-gray-700 text-sm">Aktiv</label>
                </div>
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PaymentProviderForm;