
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { user, isLoading } = useAuth();

  // If user is already logged in, redirect to home
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="py-8 max-w-md mx-auto">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
