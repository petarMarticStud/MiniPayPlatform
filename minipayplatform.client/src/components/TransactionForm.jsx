
import React, { useState, useEffect } from 'react';
import transactionService from '../services/TransactionService';
import paymentProviderService from '../services/PaymentProviderService';
import Transaction from '../models/Transaction'; 

function TransactionForm({ transactionId, onSaveSuccess, onCancel }) {
    // Initialize state with a new instance of the Transaction class
    const [transaction, setTransaction] = useState
    (
        new Transaction(0, 0.00, '', 'Pending', new Date().toISOString().slice(0, 16), 0, '', '')
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentProviders, setPaymentProviders] = useState([]);

    useEffect(() => {
        const loadFormData = async () =>
        {
            setLoading(true);
            setError(null);
            try
            {
                // Load all payment providers for the dropdown
                const providers = await paymentProviderService.getAllProviders();
                setPaymentProviders(providers);

                if (transactionId !== 0) {
                    // Load transaction data for editing
                    const data = await transactionService.getTransactionById(transactionId);
                    const loadedTransaction = new Transaction(
                        data.id,
                        data.amount,
                        data.currency,
                        data.status,
                        data.transactionDate ? new Date(data.transactionDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                        data.paymentProviderId,
                        data.description,
                        data.reference
                    );
                    setTransaction(loadedTransaction);
                }

                else
                {
                    // For new transactions: Set the first available provider as default, if any
                    const newTransaction = new Transaction
                    (
                        0, 0.00, '', 'Pending', new Date().toISOString().slice(0, 16), 0, '', ''
                    );

                    if (providers.length > 0) {
                        newTransaction.paymentProviderId = providers[0].id;
                    }
                    setTransaction(newTransaction);
                }
            }
            catch (err)
            {
                setError("Error loading form data: " + err.message);
                console.error("Error loading transaction form data:", err);
            }
            finally
            {
                setLoading(false);
            }
        };

        loadFormData();
    }, [transactionId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTransaction(prev => {
            const updatedTransaction = new Transaction(
                prev.id, prev.amount, prev.currency, prev.status, prev.transactionDate,
                prev.paymentProviderId, prev.description, prev.reference
            );
            updatedTransaction[name] = type === 'checkbox' ? checked : value;
            return updatedTransaction;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Prepare the object for sending to the API
        const transactionToSend = {
            id: transaction.id,
            amount: parseFloat(transaction.amount),
            currency: transaction.currency,
            status: transaction.status,
            transactionDate: new Date(transaction.transactionDate).toISOString(),
            paymentProviderId: parseInt(transaction.paymentProviderId, 10),
            description: transaction.description,
            reference: transaction.reference
        };

        try
        {
            await transactionService.saveTransaction(transactionToSend);
            onSaveSuccess();
        }
        catch (err)
        {
            setError("Error saving transaction: " + err.message);
            console.error("Error saving transaction:", err);
        }
        finally
        {
            setLoading(false);
        }
    };

    if (loading && transactionId !== 0) return <div className="p-4 text-center text-blue-700 font-semibold bg-blue-50 rounded-lg shadow-md">Loading data...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg font-medium">{error}</div>;
    if (paymentProviders.length === 0 && transactionId === 0 && !loading) return <div className="p-4 bg-yellow-100 text-yellow-700 border border-yellow-400 rounded-lg font-medium">Payment providers must exist to create transactions. Please add a provider first.</div>;


    return (
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto my-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
                {transactionId && transactionId !== 0 ? 'Edit Transaction' : 'Create New Transaction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={transaction.amount}
                        onChange={handleChange}
                        required
                        step="0.01"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                    <input
                        type="text"
                        id="currency"
                        name="currency"
                        value={transaction.currency}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={transaction.status}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Transaction Date & Time</label>
                    <input
                        type="datetime-local"
                        id="transactionDate"
                        name="transactionDate"
                        value={transaction.transactionDate}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="paymentProviderId" className="block text-sm font-medium text-gray-700">Payment Provider</label>
                    <select
                        id="paymentProviderId"
                        name="paymentProviderId"
                        value={transaction.paymentProviderId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={paymentProviders.length === 0}
                    >
                        <option value="">-- Select Provider --</option>
                        {paymentProviders.map(provider => (
                            <option key={provider.id} value={provider.id}>
                                {provider.name} ({provider.currency})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={transaction.description}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="reference" className="block text-sm font-medium text-gray-700">Reference (optional)</label>
                    <input
                        type="text"
                        id="reference"
                        name="reference"
                        value={transaction.reference}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading || paymentProviders.length === 0}
                    >
                        {transactionId !== 0 ? 'Save Changes' : 'Create Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TransactionForm;