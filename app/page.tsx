'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';
import { Mail, Phone, Smartphone } from 'lucide-react';

const AUTHORIZED_EMAIL = 'azri.rain@gmail.com';
const AUTHORIZED_PHONE = '01124461610';

type LoginMethod = 'email' | 'phone';
type VerificationStep = 'input' | 'code' | 'device' | 'none';

// Add UUID generation function
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDevice = async () => {
      const deviceId = localStorage.getItem('deviceId');
      if (deviceId) {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('device_id', deviceId)
          .eq('verified', true)
          .single();

        if (data && !error) {
          router.push('/dashboard');
          return;
        }
      }
      setIsChecking(false);
    };

    checkDevice();
  }, [router]);

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if authorized user
      const isAuthorized = loginMethod === 'email' 
        ? email === AUTHORIZED_EMAIL
        : phoneNumber.replace(/\D/g, '') === AUTHORIZED_PHONE.replace(/\D/g, '');

      if (!isAuthorized) {
        throw new Error('Unauthorized access');
      }

      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Verification code:', code);
      
      sessionStorage.setItem('verificationCode', code);
      setVerificationStep('code');
      toast.success(`Verification code sent! (Check console)`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const storedCode = sessionStorage.getItem('verificationCode');
      
      if (verificationCode !== storedCode) {
        throw new Error('Invalid verification code');
      }

      setVerificationStep('device');
      sessionStorage.removeItem('verificationCode');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!deviceName.trim()) {
        throw new Error('Device name is required');
      }

      // Use the new UUID generation function
      const deviceId = generateUUID();
      
      const { error } = await supabase
        .from('devices')
        .insert([{
          device_id: deviceId,
          device_name: deviceName.trim(),
          verified: true,
          last_login: new Date().toISOString()
        }]);

      if (error) throw error;

      localStorage.setItem('deviceId', deviceId);
      toast.success('Device registered successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to register device');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md p-6 space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Welcome to KonMari
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Your Rubbish Pickup Management Solution
          </p>
        </div>

        {verificationStep === 'input' && (
          <form onSubmit={handleInputSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md ${
                  loginMethod === 'email'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md ${
                  loginMethod === 'phone'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Phone className="h-4 w-4" />
                Phone
              </button>
            </div>

            {loginMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="01123456789"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) {
                      setPhoneNumber(value.startsWith('0') ? value : '0' + value);
                    }
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}

        {verificationStep === 'code' && (
          <form onSubmit={handleCodeVerification} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <button
                type="button"
                onClick={() => setVerificationStep('input')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {verificationStep === 'device' && (
          <form onSubmit={handleDeviceRegistration} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Device Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="deviceName"
                  type="text"
                  required
                  placeholder="e.g., My iPhone"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Give this device a name to identify it later
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !deviceName.trim()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register Device'}
            </button>
          </form>
        )}

        {verificationStep === 'none' && (
          <button
            onClick={() => setVerificationStep('input')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        )}
      </main>
    </div>
  );
}
