import { Suspense } from 'react';
import OrderConfirmation from './ConfirmationPage';

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmation />
    </Suspense>
  );
}