// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';

interface UserData {
  id: string;
  password?: string; // Password mungkin tidak selalu ada setelah login
  fullname: string;
  username: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, password, fullname, username')
        .eq('username', username)
        .single();

      if (error) {
        setError('Username tidak ditemukan.');
      } else if (data) {
        const isPasswordMatch = await bcrypt.compare(password, (data as UserData).password || '');

        if (isPasswordMatch) {
          localStorage.setItem('user', JSON.stringify({ id: (data as UserData).id, fullname: (data as UserData).fullname, username: (data as UserData).username }));
          navigate('/dashboard');
        } else {
          setError('Password salah.');
        }
      } else {
        setError('Username tidak ditemukan.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card p-2 w-100 shadow mt-5 p-3">
        <div className="logoBrand w-100 d-flex align-items-center justify-content-center my-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2621/2621855.png"
            alt=""
            width="40"
          />
          <h1 className="display-4 text-uppercase ms-3 fw-bolder">
            Pil Reminder
          </h1>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              name="username"
              placeholder="johndoe"
              aria-describedby="emailHelp"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-50"
            name="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="text-center mt-5 d-flex align-items-center justify-content-center">
        <p className="d-flex">
          Don't have an account?
          <Link to="/signup" className="nav-link ms-2 text-primary fw-bold">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
