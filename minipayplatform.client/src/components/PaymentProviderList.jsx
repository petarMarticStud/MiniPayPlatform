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


    if (loading) return <div className="p-4 text-center text-blue-700 font-semibold bg-blue-50 rounded-lg shadow-md">Loading data...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg font-medium">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="ext-2xl font-bold mb-5 text-indigo-700">Payment Provider</h2>
            <button
                onClick={onCreateNew}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg mb-6 shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
                Add Provider
            </button>

            {providers.length === 0 ? (
                <p>No provider found.</p>
            ) : (
                <div className="overflow-x-auto">
                        <table className="p-4 text-center text-lg text-gray-600 bg-blue-50 rounded-lg border border-blue-200">
                        <thead>
                            <tr>
                                    <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-lg">ID</th>
                                    <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-lg">Name</th>
                                    <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-lg">Währung</th>
                                    <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-lg">Aktiv</th>
                                    <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-lg">Aktionen</th>
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
                                            className="bg-red-5S0 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
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