// src/app/admin/login/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      router.replace('/admin/dashboard');
    }
    setLoading(false);
  };

  const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  };

  const inputBaseClasses = "mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm sm:text-sm";
  const inputColorClasses = "border-[#718096] placeholder-gray-400 text-[#2D3748] bg-white";
  const inputFocusClasses = "focus:outline-none focus:ring-2 focus:ring-[#002A7F] focus:border-[#002A7F]";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-[#F7FAFC] p-4">
      <motion.div 
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.form 
          onSubmit={handleLogin} 
          className="space-y-6"
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            variants={formItemVariants}
            className="text-3xl font-bold text-center text-[#002A7F]"
          >
            Admin Login
          </motion.h2>

          <motion.div variants={formItemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-[#2D3748]">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`${inputBaseClasses} ${inputColorClasses} ${inputFocusClasses}`} placeholder="tu@email.com" />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-[#2D3748]">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={`${inputBaseClasses} ${inputColorClasses} ${inputFocusClasses}`} placeholder="••••••••" />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                key="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, ...shakeAnimation }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 py-3 text-sm text-center text-[#C8102E] bg-[#FEE2E2] border border-[#C8102E] rounded-lg"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

         
          <motion.div variants={formItemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#002A7F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002A7F] disabled:bg-[#A0AEC0] disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {loading ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PulseLoader size={8} color="#FFFFFF" />
                  </motion.div>
                ) : (
                  <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Iniciar Sesión
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}