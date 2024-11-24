'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';  // تأكد من استيراد مكون Image من Next.js

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        // تطبيق خصم على أول 4 منتجات فقط
        const updatedProducts = response.data.map((product, index) => {
          if (index < 4) { // خصم فقط على أول 4 منتجات
            const discount = 0.2; // خصم 20%
            const discountedPrice = (product.price * (1 - discount)).toFixed(2);
            return {
              ...product,
              discountedPrice,
              discount: discount * 100, // خصم كنسبة مئوية
            };
          } else {
            return {
              ...product,
              discountedPrice: product.price.toFixed(2), // السعر الكامل بدون خصم
              discount: 0,
            };
          }
        });
        setProducts(updatedProducts);
        setLoading(false); // بعد تحميل البيانات، قم بتغيير حالة التحميل إلى false
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false); // في حالة حدوث خطأ، قم بإيقاف التحميل
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">جاري تحميل المنتجات...</div>; // رسالة التحميل
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-yellow-400 p-4">
      <h1 className='text-center p-10 text-2xl'>All Products</h1>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <Image 
              src={product.image} 
              alt={product.title} 
              width={500}  // تحديد عرض الصورة
              height={500}  // تحديد ارتفاع الصورة
              className="w-full h-48 p-4 transition-all duration-300 transform hover:scale-105"
              style={{ objectFit: 'contain' }}  // استخدم style لتحديد objectFit بشكل صحيح
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{product.description.slice(0, 100)}...</p>
              <div className="flex items-center justify-between mb-4">
                {product.discount > 0 && (
                  <span className="text-lg text-red-500 line-through">${product.price}</span>
                )}
                <span className="text-xl font-bold text-gray-800">${product.discountedPrice}</span>
              </div>
              {product.discount > 0 && (
                <div className="text-sm text-green-600">{product.discount}% OFF</div>
              )}
              <Link 
                href={`/products/${product.id}`} 
                className="text-center bg-gradient-to-r from-green-500 to-yellow-400 text-dark py-2 px-4 rounded-md w-full mt-2 cursor-pointer transition-all duration-300 hover:from-green-700 hover:to-yellow-500"
              >
                Go to Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
