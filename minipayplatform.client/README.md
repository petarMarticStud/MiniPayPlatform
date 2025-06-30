MiniPay Admin Panel
An internal tool for managing payment providers and simulating payment processes.

🚀 Project Description
The MiniPay Admin Panel is a web-based application designed to centralize the management of various payment providers (like Stripe, PayPal, Klarna) for a growing e-commerce company. Additionally, the tool provides functionality to simulate payment transactions, enabling the testing of provider integrations and endpoint behavior.

This project consists of a Backend (C# .NET 8 REST API) and a Frontend (HTML, CSS, JavaScript, React.js).

✨ Features
Provider Management
 - List all available payment providers.

 - Retrieve details for a specific provider.

 - Add new payment providers with essential information (name, URL, currency, description).

 - Update existing provider information (e.g., URL, status).

 - Activate or deactivate providers dynamically without service redeployment.

 - Remove no longer needed providers.

Payment Simulation
 - Select an active payment provider.

 - Enter amount, currency, and an optional description for the simulated transaction.

 - Send a simulated payment request to the configured provider endpoint.

 - Display the result of the simulated transaction (status, transaction ID, timestamp, message).

🛠️ Tech Stack
Backend
 - Language: C#

 - .NET Version: .NET 8

 - API Type: REST API

 - HTTP Client: HttpClient for external provider calls

Frontend
 - Technologies: HTML, CSS, JavaScript

 - Framework: React.js

Data Storage
 - Storage: Json File

🧪 Tests
	- Navigate to Backend.Tests
