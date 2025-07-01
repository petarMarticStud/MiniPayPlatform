import PaymentProvider from '../models/PaymentProvider';

const PAYMENT_PROVIDERS_ENDPOINT = '/api/paymentprovider';

const paymentProviderService = {
    getAllProviders: async () => {
        try
        {
            const response = await fetch(PAYMENT_PROVIDERS_ENDPOINT);
            if (!response.ok) {
                throw new Error(`HTTP error!: ${response.status}`);
            }
            const data = await response.json();
            return data.map(p => new PaymentProvider(p.id, p.name, p.description, p.url, p.currency, p.isActive));
        }
        catch (error)
        {
            console.error("Error fetching all providers:", error);
            throw error;
        }
    },
    getProviderById: async (id) => {
        try
        {
            const response = await fetch(`${PAYMENT_PROVIDERS_ENDPOINT}/${id}`);
            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return new PaymentProvider(data.id, data.name, data.description, data.url, data.currency, data.isActive);
        }
        catch (error)
        {
            console.error(`Error fetching provider with ID ${id}:`, error);
            throw error;
        }
    },
    addProvider: async (provider) => {
        try
        {
            const response = await fetch(PAYMENT_PROVIDERS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(provider),
            });
            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return new PaymentProvider(data.id, data.name, data.description, data.url, data.currency, data.isActive);
        }

        catch (error)
        {
            console.error("Error adding provider:", error);
            throw error;
        }
    },

    updateProvider: async (provider) => {
        try
        {
            const response = await fetch(`${PAYMENT_PROVIDERS_ENDPOINT}/${provider.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(provider),
            });
            if (!response.ok)
            {
                throw new Error(`HTTP error!: ${response.status}`);
            }
        }
        catch (error)
        {
            console.error(`Error updating provider with ID ${provider.id}:`, error);
            throw error;
        }
    },

    deleteProvider: async (id) => {
        try
        {
            const response = await fetch(`${PAYMENT_PROVIDERS_ENDPOINT}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok)
            {
                throw new Error(`HTTP error!: ${response.status}`);
            }
        }
        catch (error)
        {
            console.error(`Error deleting provider with ID ${id}:`, error);
            throw error;
        }
    },

    setProviderActiveStatus: async (id, isActive) =>
    {
        try
        {
            const response = await fetch(`${PAYMENT_PROVIDERS_ENDPOINT}/${id}/status?isActive=${isActive}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`HTTP error!: ${response.status}`);
            }
        }
        catch (error)
        {
            console.error(`Error setting status for provider ID ${id}:`, error);
            throw error;
        }
    },
};

export default paymentProviderService;