// Maps adapter.
// Calculate delivery distance and route using a restricted Maps API key.
// Recommended server flow: validate delivery/order coordinates -> calculate distance ->
// calculate delivery fee -> save trusted fee to Firestore.
// Browser location is only an input and should not be trusted for billing.