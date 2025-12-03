import {
    createPaymentInitiated,
    processTransaction,
    updatePayment,
    updateOrder,
    createOrderPayment,
    applyPromoCode,
    updatePaymentRequest,
    sendPaymentConfirmationNotification,
} from "@/services/paymentService";

export const savePayment = async (options: any) => {
    const responseObj = { success: false, message: "" };

    // VALIDATIONS
    if (!options.orderId) return { success: false, message: "Order reference missing." };
    if (!options.amount) return { success: false, message: "Invalid amount." };
    if (!options.paymentType) return { success: false, message: "Card Type missing." };
    if (!options.cardHolderName) return { success: false, message: "Card holder name missing." };
    if (!options.cardNumber) return { success: false, message: "Card number missing." };
    if (!options.expirationDate) return { success: false, message: "Expiration date missing." };
    if (!options.cardCode) return { success: false, message: "Card Code / CVV missing." };

    try {
        // STEP 1: Log payment initiated
        const paymentInitiated = {
            customerId: options.customerId,
            paymentAmount: options.amount,
            paymentStatusId: 643,
            orderId: options.orderId,
            transactionId: 0,
            cardType: options.cardTypeName,
            instrumentNumber: options.cardNumber,
            paymentDate: new Date(),
            rejectReason: `Payment for order ${options.orderId} inititiated`,
        };

        const paymentRes = await createPaymentInitiated(paymentInitiated);
        const paymentId = Array.isArray(paymentRes) ? paymentRes[0]?.paymentId : paymentRes?.paymentId;

        // STEP 2: Process Transaction
        const transactionRes = await processTransaction({
            amount: options.amount,
            cardHolderName: options.cardHolderName,
            cardNumber: options.cardNumber,
            expirationDate: options.expirationDate,
            cardCode: options.cardCode,
            orderId: options.orderId,
            customerId: options.customerId,
            invoiceReference: options.invoiceReference,
        });

        const failed =
            !transactionRes ||
            transactionRes.transactionResponse?.responseCode !== "1" ||
            !transactionRes.transactionResponse?.transId;

        const transId = transactionRes?.transactionResponse?.transId;

        responseObj.success = !failed;
        responseObj.message = failed
            ? transactionRes?.transactionResponse?.errors?.[0]?.errorText
                ? `Transaction failed: ${transactionRes.transactionResponse.errors[0].errorText}`
                : "Transaction failed with wrong details"
            : "Transaction successful";

        // STEP 3: Update Payment
        const paymentUpdate = {
            paymentId,
            customerId: options.customerId,
            paymentAmount: options.amount,
            paymentStatusId: failed ? 642 : 641,
            orderId: options.orderId,
            transactionId: transId,
            cardType: options.cardTypeName,
            instrumentNumber: options.cardNumber,
            paymentDate: new Date(),
            rejectReason: responseObj.message,
        };

        await updatePayment(paymentUpdate);

        if (failed || !paymentId) {
            return responseObj;
        }

        // STEP 4: After updating the payment
        await updateOrder(options.orderId, {
            orderId: options.orderId,
            orderStatusId: options.orderStatusId ?? 534,
            additionalAmountCharged: options.additionalAmountCharged,
            additionalAmountChargeReason: options.additionalAmountChargeReason,
            confirmOrderDate: !options.orderStatusId,
            promocodeId: options.promocodeId,
            amountDiscounted: options.discountAmount,
            shippingAddressId: options.shippingAddressId,
            billingAddressId: options.billingAddressId,
        });

        // STEP 4.2: Apply promo code if exists
        if (!failed && options.discountAmount > 0 && options.promocodeId > 0) {
            await applyPromoCode({
                promocodeId: options.promocodeId,
                discount: options.discountAmount,
            });
        }

        // STEP 4.3: Link order & payment
        if (!failed) {
            await createOrderPayment({ paymentId, orderId: options.orderId });
        }

        // STEP 4.4: If payment request exists, update it and send confirmation
        if (options.requestId && !failed) {
            await updatePaymentRequest(options.requestId, {
                paymentId,
                paidStatus: true,
                isActive: false,
            });
            await sendPaymentConfirmationNotification(options.orderId, transId, options.amount);
        }

        return responseObj;

    } catch (err) {
        responseObj.success = false;
        responseObj.message = "Error processing post-payment steps";
        console.error(err);
    }
};