import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
});

export const registerSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
  role: Yup.string().oneOf(['individual', 'organization']).required('Required'),
});

export const expenseSchema = Yup.object({
  date: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  amount: Yup.number().min(0.01, 'Must be > 0').required('Required'),
  description: Yup.string(),
}); 