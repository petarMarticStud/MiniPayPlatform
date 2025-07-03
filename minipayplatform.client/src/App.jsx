import React, { useState } from 'react';
import PaymentProviderList from './components/PaymentProviderList.jsx';
import PaymentProviderForm from './components/PaymentProviderForm.jsx';

function App() {
    const [selectedProviderId, setSelectedProviderId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleEditProvider = (id) => {
        setSelectedProviderId(id);
        setShowForm(true);
    };

    const handleCreateNew = () => {
        setSelectedProviderId(null);
        setShowForm(true);
    };

    const handleSaveSuccess = () => {
        setShowForm(false);
        setSelectedProviderId(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedProviderId(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 p-4 text-white text-center">
                <h1 className="text-3xl font-bold">MiniPayPlatform Admin</h1>
            </header>
            <main className="container mx-auto p-4">
                {showForm ? (
                    <PaymentProviderForm
                        providerId={selectedProviderId}
                        onSaveSuccess={handleSaveSuccess}
                        onCancel={handleCancel}
                    />
                ) : (
                    <PaymentProviderList
                        onEditProvider={handleEditProvider}
                        onCreateNew={handleCreateNew}
                    />
                )}
            </main>
        </div>
    );
}

export default App;