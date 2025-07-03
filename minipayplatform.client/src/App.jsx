
import React, { useState } from 'react';
import './index.css';
// Import Payment Provider Components
import PaymentProviderList from './components/PaymentProviderList.jsx';
import PaymentProviderForm from './components/PaymentProviderForm.jsx';

// Import Transaction Components
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import TransactionSimulator from './components/TransactionSimulator';

function App() {
    const [activeView, setActiveView] = useState('providers'); // Default view on start

    // --- States for Payment Provider Management ---
    const [selectedProviderId, setSelectedProviderId] = useState(null); // ID of the provider to edit (null for new)
    const [showProviderForm, setShowProviderForm] = useState(false); // Controls PaymentProviderForm visibility
    const [providerListRefreshKey, setProviderListRefreshKey] = useState(0); // Key to force PaymentProviderList reload

    // --- States for Transaction Management ---
    const [showTransactionForm, setShowTransactionForm] = useState(false); // Controls TransactionForm visibility
    // transactionToEditId is currently only for new transactions (value 0),
    // as there's no edit button in the simplified TransactionList
    const [transactionToEditId, setTransactionToEditId] = useState(0);
    const [transactionListRefreshKey, setTransactionListRefreshKey] = useState(0); // Key to force TransactionList reload

    // Handlers for Payment Providers
    const handleProviderEdit = (id) => {
        setSelectedProviderId(id);
        setShowProviderForm(true);
    };

    const handleProviderCreateNew = () => {
        setSelectedProviderId(null); // New ID is null for new creation
        setShowProviderForm(true);
    };

    const handleProviderFormSaveOrCancel = () => {
        setShowProviderForm(false); // Hide the form
        setSelectedProviderId(null); // Reset selected ID
        setProviderListRefreshKey(prevKey => prevKey + 1); // Force PaymentProviderList to reload
    };

    // Handlers for Transactions
    const handleTransactionFormAndListReload = () => {
        setShowTransactionForm(false); // Hide the form
        setTransactionToEditId(0); // Reset ID
        setTransactionListRefreshKey(prevKey => prevKey + 1); // Force TransactionList to reload
    };

    // Handler to show the form for creating a new transaction
    const handleTransactionCreateNew = () => {
        setTransactionToEditId(0); // Ensure it's for a new transaction
        setShowTransactionForm(true); // Show the form
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-800 p-4 text-white">
                <h1 className="text-3xl font-bold text-center">MiniPayPlatform Admin</h1>
                <nav className="mt-4 flex justify-center space-x-4">
                    <button
                        onClick={() => setActiveView('providers')}
                        className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${activeView === 'providers' ? 'bg-blue-600 text-white' : 'bg-blue-700 hover:bg-blue-600 text-blue-100'}`}
                    >
                        Payment Providers
                    </button>
                    <button
                        onClick={() => setActiveView('transactions')}
                        className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${activeView === 'transactions' ? 'bg-blue-600 text-white' : 'bg-blue-700 hover:bg-blue-600 text-blue-100'}`}
                    >
                        Transactions
                    </button>
                </nav>
            </header>

            <main className="container mx-auto p-4">
                {activeView === 'providers' && (
                    <>
                        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Payment Provider Management</h2>
                        {showProviderForm ? (
                            <PaymentProviderForm
                                providerId={selectedProviderId}
                                onSaveSuccess={handleProviderFormSaveOrCancel}
                                onCancel={handleProviderFormSaveOrCancel}
                            />
                        ) : (
                            <PaymentProviderList
                                key={providerListRefreshKey} // Key to force list reload
                                onEditProvider={handleProviderEdit}
                                onCreateNew={handleProviderCreateNew}
                            />
                        )}
                    </>
                )}

                {activeView === 'transactions' && (
                    <>
                        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Transaction Management</h2>
                        {!showTransactionForm && (
                            <div className="text-center mb-6">
                                <button
                                    onClick={handleTransactionCreateNew}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5"
                                >
                                    Add New Transaction
                                </button>
                            </div>
                        )}

                        {showTransactionForm ? (
                            <TransactionForm
                                transactionId={transactionToEditId} // Passes 1 for new transactions
                                onSaveSuccess={handleTransactionFormAndListReload} // Calls our helper function on success
                                onCancel={handleTransactionFormAndListReload}     // Calls our helper function on cancel
                            />
                        ) : (
                            <>
                                {/* Transaction Simulator is always visible when the transaction form is hidden */}
                                <TransactionSimulator onSimulationComplete={handleTransactionFormAndListReload} />

                                {/* Transaction List uses the 'key' prop to force a reload */}
                                <TransactionList
                                    key={transactionListRefreshKey} // This key triggers component remount
                                    refreshKey={transactionListRefreshKey} 
                                />
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;