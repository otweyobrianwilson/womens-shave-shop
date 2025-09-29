"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { CheckCircle, Package, Home, ShoppingBag, Eye, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const { clear } = useCart();
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // Clear cart locally after returning from payment
    try {
      clear();
    } catch {}

    // Try to get order information from localStorage or URL params
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const txRef = urlParams.get('tx_ref');
      const status = urlParams.get('status');
      
      if (txRef) {
        setOrderInfo({
          txRef,
          status: status || 'successful',
          timestamp: new Date().toLocaleString()
        });
      }
    } catch {}
  }, [clear]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for your purchase! Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Order Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Order Status</h3>
                <div className="flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-green-600 font-medium">Payment Confirmed</span>
                </div>
              </div>
              
              {orderInfo?.txRef && (
                <div>
                  <h3 className="font-medium text-gray-700">Transaction Reference</h3>
                  <p className="text-gray-900 font-mono text-sm mt-1">{orderInfo.txRef}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-700">Order Date</h3>
                <p className="text-gray-900 mt-1">{orderInfo?.timestamp || new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">What happens next?</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                    Order confirmation email sent
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                    Items prepared for delivery
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                    Delivery scheduled within 24-48 hours
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                    SMS notification with tracking details
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">What would you like to do next?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Home */}
            <Link 
              href="/" 
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <Home className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Go Home</h3>
              <p className="text-sm text-blue-100">Return to homepage</p>
            </Link>

            {/* View Orders */}
            <Link 
              href="/orders" 
              className="group bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              <Eye className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">My Orders</h3>
              <p className="text-sm text-green-100">Track your orders</p>
            </Link>

            {/* Continue Shopping */}
            <Link 
              href="/products" 
              className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <ShoppingBag className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Shop More</h3>
              <p className="text-sm text-purple-100">Continue shopping</p>
            </Link>

            {/* Account */}
            <Link 
              href="/account" 
              className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6 text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
            >
              <Package className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">My Account</h3>
              <p className="text-sm text-orange-100">Manage account</p>
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center mt-8 text-gray-600">
          <p className="mb-2">Need help? Contact our customer support team.</p>
          <p className="text-sm">We're here to help ensure you have the best shopping experience.</p>
        </div>
      </div>
    </main>
  );
}