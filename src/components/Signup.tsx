// src/components/Signup.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: username,
            fullname: fullname,
            phone: phone,
            password: hashedPassword,
            isAdmin: false,
          },
        ])
        .select('id, fullname, username')
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        console.log('Pendaftaran berhasil:', data as { id: string; fullname: string; username: string });
        localStorage.setItem('user', JSON.stringify({ id: data.id, fullname: data.fullname, username: data.username }));
        navigate('/dashboard');
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
            <label htmlFor="nameInput" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="nameInput"
              name="username"
              placeholder="Ex: johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fullnameInput" className="form-label">Fullname</label>
            <input
              type="text"
              className="form-control"
              id="fullnameInput"
              name="fullname"
              placeholder="John Doe"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneInput" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phoneInput"
              name="phone"
              placeholder="858xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="hidden"
              className="form-control"
              name="isAdmin"
              value="false"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-50"
            name="submit"
            disabled={loading}
          >
            {loading ? 'Mendaftar...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="text-center mt-5 d-flex align-items-center justify-content-center">
        <p className="d-flex">
          Sudah punya akun?
          <Link to="/login" className="nav-link ms-2 text-primary fw-bolder">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
