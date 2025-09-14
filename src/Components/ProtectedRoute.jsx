import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <h3 style={styles.loadingTitle}>🏔️ RockFall AI</h3>
        <p style={styles.loadingText}>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    window.location.href = '/login';
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.redirectMessage}>
          <h3 style={styles.redirectTitle}>🔒 Access Restricted</h3>
          <p style={styles.redirectText}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return children;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#F8FAFC',
    fontFamily: 'Inter, sans-serif'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #3B82F6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingTitle: {
    color: '#1A202C',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px',
    margin: '0 0 8px 0'
  },
  loadingText: {
    color: '#64748B',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0'
  },
  redirectMessage: {
    textAlign: 'center',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E2E8F0'
  },
  redirectTitle: {
    color: '#DC2626',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  redirectText: {
    color: '#64748B',
    fontSize: '14px',
    margin: '0'
  }
};

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
  const spinnerStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = spinnerStyles;
  document.head.appendChild(styleSheet);
}

export default ProtectedRoute;