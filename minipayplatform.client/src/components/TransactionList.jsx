
import React, { useEffect, useState, useCallback } from 'react';
import transactionService from '../services/TransactionService';

function TransactionList({ refreshKey }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try
        {
            const data = await transactionService.getAllTransactions();
            // Sort in descending order to get newest date 
            const sortedData = data.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
            setTransactions(sortedData);
        }
        catch (err)
        {
            setError("Error loading transactions: " + err.message);
            console.error("Error fetching transactions:", err);
        }
        finally
        {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        loadTransactions();
    }, [refreshKey, loadTransactions]); // dependency from  refreshKey and loadTransactions


    const handleDelete = async (id) =>
    {
        if (!window.confirm("Are you sure you want to delete this transaction? This action cannot be undone."))
        {
            return;
        }
        try
        {
            await transactionService.deleteTransaction(id);
            setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
        }
        catch (err)
        {
            setError("Error deleting transaction: " + err.message);
            console.error("Error deleting transaction:", err);
        }
    };

    // Helping-function to formate dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) return <div className="p-4 text-center text-blue-700 font-semibold bg-blue-50 rounded-lg shadow-md">Loading transactions...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg font-medium">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-6xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-5 text-center text-indigo-700">All Transactions</h2>

            {transactions.length === 0 ?
            (
                <p className="p-4 text-center text-lg text-gray-600 bg-yellow-50 rounded-lg border border-yellow-200">
                    No transactions have been recorded yet.
                </p>
            ) : (
                <div className="overflow-x-auto border border-blue-200 rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-blue-200">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-lg">ID</th>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Currency</th>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Provider ID</th>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Description</th>
                                <th className="py-3 px-4 border-b border-blue-300 bg-blue-700 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction, index) => (
                                <tr key={transaction.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition duration-150 ease-in-out`}>
                                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.amount.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.currency}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                                            ${transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${transaction.status === 'Failed' ? 'bg-red-100 text-red-800' : ''}
                                            ${transaction.status === 'Refunded' ? 'bg-blue-100 text-blue-800' : ''}
                                        `}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{formatDate(transaction.transactionDate)}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.paymentProviderId}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800 truncate max-w-xs">{transaction.description}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-md text-sm transition duration-200 ease-in-out"
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

export default TransactionList;