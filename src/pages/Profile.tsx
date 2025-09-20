import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { token, updateProfile } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from API on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setMessage(t('please_login_first', 'profile') || 'Please log in first');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/profile', {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            mobileNumber: userData.mobileNumber || ''
          });
          setMessage('');
        } else if (response.status === 401) {
          setMessage(t('session_expired', 'profile') || 'Session expired');
        } else {
          setMessage(t('failed_to_load_profile', 'profile') || 'Failed to load profile data');
        }
      } catch (err) {
        setMessage(t('server_connection_error', 'profile') || 'Server connection error');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: ''
    };

    if (!formData.firstName.trim()) {
      errors.firstName = t('first_name_required', 'profile') || 'First name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = t('email_required', 'profile') || 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('invalid_email_format', 'profile') || 'Invalid email format';
      isValid = false;
    }

    if (formData.mobileNumber && !/^[0-9+\-\s()]+$/.test(formData.mobileNumber)) {
      errors.mobileNumber = t('invalid_phone_format', 'profile') || 'Invalid phone number format';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    if (!token) {
      setMessage(t('please_login_first', 'profile') || 'Please log in first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        updateProfile(formData);
        setIsEditing(false);
        setMessage(t('profile_updated_successfully', 'profile') || 'Profile updated successfully');
        setTimeout(() => setMessage(''), 3000);
      } else if (response.status === 400) {
        setMessage(t('invalid_data', 'profile') || 'Invalid data');
      } else if (response.status === 401) {
        setMessage(t('session_expired', 'profile') || 'Session expired');
      } else {
        setMessage(t('failed_to_update_profile', 'profile') || 'Failed to update profile');
      }
    } catch (err) {
      setMessage(t('server_connection_error', 'profile') || 'Server connection error');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = () => {
    let isValid = true;
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!passwordData.currentPassword) {
      errors.currentPassword = t('current_password_required', 'profile') || 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = t('new_password_required', 'profile') || 'New password is required';
      isValid = false;
    } else {
      // Check password complexity
      const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
      const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
      const hasNumbers = /\d/.test(passwordData.newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);
      const isLongEnough = passwordData.newPassword.length >= 8;

      if (!hasUpperCase) {
        errors.newPassword = t('password_uppercase', 'profile') || 'Password must include at least one uppercase letter';
        isValid = false;
      } else if (!hasLowerCase) {
        errors.newPassword = t('password_lowercase', 'profile') || 'Password must include at least one lowercase letter';
        isValid = false;
      } else if (!hasNumbers) {
        errors.newPassword = t('password_number', 'profile') || 'Password must include at least one number';
        isValid = false;
      } else if (!hasSpecialChar) {
        errors.newPassword = t('password_special', 'profile') || 'Password must include at least one special character';
        isValid = false;
      } else if (!isLongEnough) {
        errors.newPassword = t('password_length', 'profile') || 'Password must be at least 8 characters long';
        isValid = false;
      }
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t('passwords_not_match', 'profile') || 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    if (!token) {
      setMessage(t('please_login_first', 'profile') || 'Please log in first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/profile/change-password', {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setMessage(t('password_changed_successfully', 'profile') || 'Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
        setTimeout(() => setMessage(''), 3000);
      } else if (response.status === 400) {
        const errorData = await response.json();
        setMessage(errorData.message || t('current_password_incorrect', 'profile') || 'Current password is incorrect');
      } else if (response.status === 401) {
        setMessage(t('session_expired', 'profile') || 'Session expired');
      } else {
        setMessage(t('failed_to_change_password', 'profile') || 'Failed to change password');
      }
    } catch (err) {
      setMessage(t('server_connection_error', 'profile') || 'Server connection error');
      console.error('Error changing password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = (
    <div className="text-xs mt-1 text-muted">
      {t('password_must_contain', 'profile') || 'Password must contain:'}
      <ul className={`list-disc ${isRTL ? 'list-right' : 'list-inside'} mt-1`}>
        <li>{t('password_min_length', 'profile') || 'At least 8 characters'}</li>
        <li>{t('password_uppercase', 'profile') || 'One uppercase letter'}</li>
        <li>{t('password_lowercase', 'profile') || 'One lowercase letter'}</li>
        <li>{t('password_number', 'profile') || 'One number'}</li>
        <li>{t('password_special', 'profile') || 'One special character'}</li>
      </ul>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`container-custom px-4 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-primary">{t('loading', 'profile')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-custom px-4 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <h1 className="text-2xl font-bold text-primary mb-6">{t('profile', 'profile')}</h1>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-bg-primary rounded-lg shadow-md p-6 mb-6">
        <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-xl font-semibold text-primary">{t('personal_information', 'profile')}</h2>
          {!isEditing ? (
            <button
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              {t('edit', 'profile')}
            </button>
          ) : (
            <div className={`space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                className="bg-accent-1 hover:bg-accent-3 text-white px-4 py-2 rounded transition-colors"
                onClick={() => {
                  setIsEditing(false);
                  setFormErrors({ firstName: '', lastName: '', email: '', mobileNumber: '' });
                }}
                disabled={isLoading}
              >
                {t('cancel', 'profile')}
              </button>
              <button
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                {t('save', 'profile')}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">{t('first_name', 'profile')}</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.firstName ? 'border-red-500' : 'border-light'}`}
                  disabled={isLoading}
                />
                {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
              </>
            ) : (
              <p className="px-3 py-2 bg-bg-secondary rounded border-light">{formData.firstName || t('not_specified', 'profile')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">{t('last_name', 'profile')}</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.lastName ? 'border-red-500' : 'border-light'}`}
                  disabled={isLoading}
                />
                {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
              </>
            ) : (
              <p className="px-3 py-2 bg-bg-secondary rounded border-light">{formData.lastName || t('not_specified', 'profile')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">{t('email', 'common')}</label>
            {isEditing ? (
              <>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.email ? 'border-red-500' : 'border-light'}`}
                  disabled={isLoading}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </>
            ) : (
              <p className="px-3 py-2 bg-bg-secondary rounded border-light">{formData.email || t('not_specified', 'profile')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">{t('mobile_number', 'profile')}</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.mobileNumber ? 'border-red-500' : 'border-light'}`}
                  disabled={isLoading}
                />
                {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
              </>
            ) : (
              <p className="px-3 py-2 bg-bg-secondary rounded border-light">{formData.mobileNumber || t('not_provided', 'profile')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-bg-primary rounded-lg shadow-md p-6">
        <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-xl font-semibold text-primary">{t('change_password', 'profile')}</h2>
          {!isChangingPassword ? (
            <button
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
              onClick={() => setIsChangingPassword(true)}
              disabled={isLoading}
            >
              {t('change_password', 'profile')}
            </button>
          ) : (
            <div className={`space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                className="bg-accent-1 hover:bg-accent-3 text-white px-4 py-2 rounded transition-colors"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                disabled={isLoading}
              >
                {t('cancel', 'profile')}
              </button>
              <button
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
                onClick={handleChangePassword}
                disabled={isLoading}
              >
                {t('update', 'profile')}
              </button>
            </div>
          )}
        </div>

        {isChangingPassword && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">{t('current_password', 'profile')}</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${passwordErrors.currentPassword ? 'border-red-500' : 'border-light'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-muted`}
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>}
            </div>

            <div className="md:col-span-2">
              {/* Spacer for alignment */}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">{t('new_password', 'profile')}</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${passwordErrors.newPassword ? 'border-red-500' : 'border-light'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-muted`}
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>}
              {passwordRequirements}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">{t('confirm_password', 'profile')}</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-light'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-muted`}
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;