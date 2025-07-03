const TRANSACTION_ENDPOINT = 'api/transactions';

const transactionService = {

    getAllTransactions: async () => {
        try {
            const response = await fetch(TRANSACTION_ENDPOINT);
            if (!response.ok) {
                throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error in getAllTransactions:", error);
            throw new Error("Failed to fetch all transactions: ", error)
        }
    },

    getTransactionById: async (id) => {
        try {
            const response = await fetch(`${TRANSACTION_ENDPOINT}/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch transaction with ID ${id}: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in getTransactionById (${id}):`, error);
            throw error;
        }
    },

    saveTransaction: async (transactionData) =>
    {
        const method = transactionData.id && transactionData.id !== 0 ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `${TRANSACTION_ENDPOINT}/${transactionData.id}` : TRANSACTION_ENDPOINT;

        try {
            const response = await fetch(url,
                {
                method: method,
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
                });

            if (!response.ok)
            {
                throw new Error(`HTTP error!: ${response.status}`);

            }
            return await response.json();

        }

        catch (error)
        {
            console.error(`Error in saveTransaction (${method}):`, error);
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        try
        {
            const response = await fetch(`${TRANSACTION_ENDPOINT}/${id}`,
            {
                method: 'DELETE',
            });

            if (!response.ok)
            {
                throw new Error(`Failed to delete transaction with ID ${id}: ${response.status}`);
            }

        }

        catch (error)
        {
            console.error(`Error in deleteTransaction (${id}):`, error);
            throw error;
        }
    }
};

export default transactionService;