class PaymentProvider {
    constructor(id, name, description, url, currency, isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.currency = currency;
        this.isActive = isActive;
    }
}

export default PaymentProvider;