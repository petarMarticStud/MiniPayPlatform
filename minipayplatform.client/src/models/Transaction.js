
class Transaction {
    constructor(id, amount, currency, status, transactionDate, paymentProviderId, description, reference) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.transactionDate = transactionDate;
        this.paymentProviderId = paymentProviderId;
        this.description = description;
        this.reference = reference;
    }
}

export default Transaction;