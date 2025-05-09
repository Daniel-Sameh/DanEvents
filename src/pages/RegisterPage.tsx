
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage = () => {
  const { user, isLoading } = useAuth();

  // If user is already logged in, redirect to home
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="py-8 max-w-md mx-auto">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;
