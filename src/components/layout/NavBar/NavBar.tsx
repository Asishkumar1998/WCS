import { Suspense } from 'react';
import Navbar from './page';

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
    </Suspense>
  );
}