import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { z, ZodIssue } from 'zod';
import { Trash2, CreditCard } from 'lucide-react';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { QuantityInput } from '../components/QuantityInput';
import nigerianStates from '../../data/nigerian-states.json';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  saveAddress: z.boolean().optional(),
  discountCode: z.string().optional(),
  paymentMethod: z.union([z.literal('paystack'), z.literal('flutterwave'), z.literal('cod')]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    saveAddress: false,
    discountCode: '',
    paymentMethod: 'paystack',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'success' | 'error';
  }>({ isOpen: false, status: 'success' });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 100 ? 0 : 9.99;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/signin?redirect=/checkout', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (items.length === 0) {
      setModalState({ isOpen: true, status: 'error' });
      return;
    }

    const isValid = checkoutSchema.safeParse(formData);

    if (!isValid.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      isValid.error.issues.forEach((err: ZodIssue) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const validatedData = isValid.data;

    try {
      // TODO: Replace with actual payment integration
      if (validatedData.paymentMethod === 'paystack') {
        console.log('Paystack payment initialized:', { amount: total, ...validatedData });
      } else if (validatedData.paymentMethod === 'flutterwave') {
        console.log('Flutterwave payment initialized:', { amount: total, ...validatedData });
      } else if (validatedData.paymentMethod === 'cod') {
        console.log('Cash on delivery order placed:', { ...validatedData, items, total });
      }

      clearCart();
      setModalState({ isOpen: true, status: 'success' });
    } catch {
      setModalState({ isOpen: true, status: 'error' });
    }
  };

  const handleCloseModal = () => {
    if (modalState.status === 'success') {
      navigate('/', { replace: true });
    }
    setModalState({ isOpen: false, status: 'success' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl mb-8 text-center">Checkout</h1>

        {items.length === 0 && !modalState.isOpen ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-xl mb-4">Your cart is empty</h2>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 space-y-6 dark:bg-gray-900">
                  <h2 className="text-xl">Delivery Address</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm mb-2">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="streetAddress" className="block text-sm mb-2">
                      Street Address
                    </label>
                    <input
                      id="streetAddress"
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => handleChange('streetAddress', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.streetAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm mb-2">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm mb-2">
                        State
                      </label>
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select state</option>
                        {nigerianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm mb-2">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.saveAddress}
                      onChange={(e) => handleChange('saveAddress', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm">Save address for future orders</span>
                  </label>
                </div>

                <div className="bg-white rounded-2xl p-6 space-y-4 dark:bg-gray-900">
                  <h2 className="text-xl">Payment Method</h2>
                  {errors.paymentMethod && (
                    <p className="text-sm text-red-600">{errors.paymentMethod}</p>
                  )}

                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === 'paystack'
                        ? 'border-black bg-gray-50 dark:bg-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={formData.paymentMethod === 'paystack'}
                      onChange={(e) => handleChange('paymentMethod', e.target.value)}
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <p>Pay with Paystack</p>
                      <p className="text-sm text-gray-500">Secure card payment</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === 'flutterwave'
                        ? 'border-black bg-gray-50 dark:bg-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="flutterwave"
                      checked={formData.paymentMethod === 'flutterwave'}
                      onChange={(e) => handleChange('paymentMethod', e.target.value)}
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-8 h-8 text-orange-600" />
                    <div className="flex-1">
                      <p>Pay with Flutterwave</p>
                      <p className="text-sm text-gray-500">Card, bank transfer & more</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-black bg-gray-50 dark:bg-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => handleChange('paymentMethod', e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                      ₦
                    </div>
                    <div className="flex-1">
                      <p>Pay on Delivery</p>
                      <p className="text-sm text-gray-500">Cash payment when you receive</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 space-y-4 dark:bg-gray-900">
                  <h2 className="text-xl">Order Summary</h2>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex gap-3 pb-4 border-b">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm truncate">{item.productName}</h3>
                          <p className="text-xs text-gray-500">
                            {item.color} / Size {item.size}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <QuantityInput
                              value={item.quantity}
                              onChange={(qty) => updateQuantity(item.variantId, qty)}
                              max={10}
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(item.variantId)}
                              className="text-red-600 hover:text-red-700"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="discountCode" className="block text-sm mb-2">
                      Discount Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="discountCode"
                        type="text"
                        value={formData.discountCode}
                        onChange={(e) => handleChange('discountCode', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter code"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <OrderConfirmationModal
          isOpen={modalState.isOpen}
          status={modalState.status}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
