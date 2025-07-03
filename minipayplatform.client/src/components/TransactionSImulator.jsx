
import React, { useState, useEffect } from 'react';
import transactionService from '../services/TransactionService';
import paymentProviderService from '../services/PaymentProviderService';

const TransactionSimulator = ({ onSimulationComplete }) => {
    const [paymentProviders, setPaymentProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [numberOfTransactionsToSimulate, setNumberOfTransactionsToSimulate] = useState(5);

    // Load payment providers when the component mounts
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const providers = await paymentProviderService.getAllProviders();
                setPaymentProviders(providers);
                if (providers.length === 0) {
                    setError("No payment providers found. Please add some to enable simulation.");
                } else {
                    setError(null); // Clear error if providers are found
                }
            } catch (err) {
                console.error("Failed to fetch payment providers for simulator:", err);
                setError(`Failed to load payment providers: ${err.message}`);
            }
        };
        fetchProviders();
    }, []);

    // Generates a random transaction object
    const generateRandomTransaction = () => {
        if (paymentProviders.length === 0) {
            // This case should ideally be handled by UI disabling, but as a safeguard
            setError("No payment providers available for simulation. Please add some first.");
            return null;
        }

        const randomProvider = paymentProviders[Math.floor(Math.random() * paymentProviders.length)];
        const amount = (Math.random() * 1000 + 1).toFixed(2); // Random amount between 1.00 and 1000.00
        const statuses = ['Completed', 'Pending', 'Failed', 'Refunded'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const descriptions = ['Online Purchase', 'Subscription Fee', 'Service Payment', 'Refund for item'];
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
        const reference = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        return {
            id: 0, 
            amount: parseFloat(amount),
            currency: randomProvider.currency, 
            status: randomStatus,
            transactionDate: new Date().toISOString(),
            paymentProviderId: randomProvider.id,
            description: randomDescription,
            reference: reference,
        };
    };

    const handleSimulate = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        if (paymentProviders.length === 0) {
            setError("Cannot simulate: No payment providers available.");
            setLoading(false);
            return;
        }
        if (numberOfTransactionsToSimulate <= 0 || isNaN(numberOfTransactionsToSimulate)) {
            setError("Please enter a valid number of transactions (greater than 0).");
            setLoading(false);
            return;
        }

        let successfulSimulations = 0;
        let failedSimulations = 0;

        try {
            for (let i = 0; i < numberOfTransactionsToSimulate; i++) {
                const transactionData = generateRandomTransaction();
                if (transactionData) {
                    try {
                        await transactionService.saveTransaction(transactionData);
                        successfulSimulations++;
                    } catch (transactionError) {
                        console.error(`Error saving transaction ${i + 1}:`, transactionError);
                        failedSimulations++;
                    }
                } else {
                    failedSimulations++;
                    console.error("Failed to generate transaction data.");
                }
            }

            if (successfulSimulations > 0) {
                setSuccessMessage(`Successfully simulated ${successfulSimulations} transactions.`);
            }
            if (failedSimulations > 0) {
                setError(`${failedSimulations} transactions failed during simulation. Check console for details.`);
            }
            if (successfulSimulations === 0 && failedSimulations === 0) {
                setError("No transactions were simulated. Check providers and input.");
            }

            // Trigger refresh of the transaction list, even with partial success/failure
            onSimulationComplete();

        } catch (err) {
            // This catch handles errors that occur outside the loop (e.g., during setup)
            console.error("Critical error during simulation setup:", err);
            setError(`Critical error: ${err.message || 'An unknown error occurred during simulation setup.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Transaction Simulator</h3>

            {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
            {successMessage && <p className="text-green-600 mb-4 font-medium">{successMessage}</p>}

            <div className="mb-4">
                <label htmlFor="numTransactions" className="block text-gray-700 text-sm font-bold mb-2">
                    Number of Transactions to Simulate:
                </label>
                <input
                    type="number"
                    id="numTransactions"
                    value={numberOfTransactionsToSimulate}
                    onChange={(e) => setNumberOfTransactionsToSimulate(parseInt(e.target.value) || 0)}
                    min="1"
                    max="100" // Sets a reasonable upper limit
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled={loading}
                />
            </div>

            <button
                onClick={handleSimulate}
                // Disable button when loading, no providers, or invalid number
                disabled={loading || paymentProviders.length === 0 || numberOfTransactionsToSimulate <= 0}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {Ff
                    ? `Simulating ${numberOfTransactionsToSimulate} transactions...`
                    : `Simulate ${numberOfTransactionsToSimulate} Transactions`}
            </button>

            {paymentProviders.length === 0 && !loading && (
                <p className="text-orange-600 mt-4">
                    Please add at least one payment provider to enable transaction simulation.
                </p>
            )}
        </div>
    );
};

export default TransactionSimulator;