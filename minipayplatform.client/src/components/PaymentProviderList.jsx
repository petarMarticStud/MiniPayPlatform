import React, { useEffect, useState, useCallback } from 'react';
import paymentProviderService from '../services/paymentProviderService';

function PaymentProviderList({ onEditProvider, onCreateNew }) {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const loadProviders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await paymentProviderService.getAllProviders();
            setProviders(data);
        } catch (err) {
            setError("Error at loading providers: " + err.message);
            console.error("Error fetching providers:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() =>
    {
        loadProviders();
    }, [loadProviders]);

    const handleDelete = async (id) => {
            try {
                await paymentProviderService.deleteProvider(id);
                setProviders(prevProviders => prevProviders.filter(p => p.id !== id));
            }
            catch (err)
            {
                setError("Error at delete process: " + err.message);
                console.error("Error deleting provider:", err);
            }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await paymentProviderService.setProviderActiveStatus(id, !currentStatus);
            setProviders(prevProviders =>
                prevProviders.map(p =>
                    p.id === id ? { ...p, isActive: !currentStatus } : p
                )
            );
        } catch (err) {
            setError("Error at toggle: " + err.message);
            console.error("Error toggling status:", err);
        }
    };


    if (loading) return <div className="p-4 text-center">Loading data...</div>;
    if (error) return <div className="p-4 bg-red-200 text-red-800 rounded">{error}</div>;

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Payment Provider</h2>
            <button
                onClick={onCreateNew}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Add Provider
            </button>

            {providers.length === 0 ? (
                <p>No provider found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b bg-gray-200 text-left">ID</th>
                                <th className="py-2 px-4 border-b bg-gray-200 text-left">Name</th>
                                <th className="py-2 px-4 border-b bg-gray-200 text-left">Währung</th>
                                <th className="py-2 px-4 border-b bg-gray-200 text-left">Aktiv</th>
                                <th className="py-2 px-4 border-b bg-gray-200 text-left">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {providers.map((provider) => (
                                <tr key={provider.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{provider.id}</td>
                                    <td className="py-2 px-4 border-b">{provider.name}</td>
                                    <td className="py-2 px-4 border-b">{provider.currency}</td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="checkbox"
                                            checked={provider.isActive}
                                            onChange={() => handleToggleActive(provider.id, provider.isActive)}
                                            className="form-checkbox h-4 w-4"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => onEditProvider(provider.id)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                                        >
                                            Edir
                                        </button>
                                        <button
                                            onClick={() => handleDelete(provider.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PaymentProviderList;