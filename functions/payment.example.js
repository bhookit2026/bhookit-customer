// Firebase Cloud Function / secure backend example.
// Keep payment gateway secrets in environment/secret manager.
//
// createPaymentOrder: validate authenticated user + Firestore order,
// calculate amount from server data, then call your payment gateway.
// verifyPaymentWebhook: verify gateway signature, then update paymentStatus.
//
// Do NOT accept amount/paymentStatus from the browser as trusted data.
// Connect this adapter to Razorpay/UPI after adding your server credentials.