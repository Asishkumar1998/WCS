// app/cart/page.tsx
import { Suspense } from 'react';
import OrderMilestonePage from './OrderMilestonePage'; // your current component

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderMilestonePage />
    </Suspense>
  );
}