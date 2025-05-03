// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Drug {
  id: number;
  user_id: string;
  nama_obat: string;
  tipe_obat: string;
  ketentuan_obat: string;
  sehari_berapa: number;
  sekali_berapa: number;
  total_obat: number;
  waktu_pengingat: string;
  created_at: string;
}

interface NewDrug {
  nama_obat: string;
  tipe_obat: string;
  ketentuan_obat: string;
  sehari_berapa: string;
  sekali_berapa: string;
  total_obat: string;
  waktu_pengingat: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<{ id: string; fullname: string; username: string } | null>(null);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newDrug, setNewDrug] = useState<NewDrug>({
    nama_obat: '',
    tipe_obat: '',
    ketentuan_obat: '',
    sehari_berapa: '',
    sekali_berapa: '',
    total_obat: '',
    waktu_pengingat: '07:00',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchDrugs(parsedUser.id);
  }, [navigate]);

  const fetchDrugs = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: drugsData, error: drugsError } = await supabase
        .from('drugs')
        .select('*')
        .eq('user_id', userId);

      if (drugsError) {
        setError(drugsError.message);
      } else {
        setDrugs(drugsData as Drug[]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewDrug({
      nama_obat: '',
      tipe_obat: '',
      ketentuan_obat: '',
      sehari_berapa: '',
      sekali_berapa: '',
      total_obat: '',
      waktu_pengingat: '07:00',
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewDrug((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddDrug = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('drugs')
        .insert([{ ...newDrug, user_id: user!.id }])
        .select();

      if (error) {
        setError(error.message);
      } else if (data && data.length > 0) {
        console.log('Obat berhasil ditambahkan:', data[0] as Drug);
        setDrugs((prevDrugs) => [...prevDrugs, data[0] as Drug]);
        closeModal();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container-fluid bg-primary-subtle rounded">
          <div className="navbar-brand d-flex align-items-center justify-content-between w-100">
            <h1 className="text-uppercase fw-bolder mt-2">
              Hai, {user?.fullname || user?.username}!
            </h1>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </nav>
      {/* List Pengingat */}
      {!drugs || drugs.length === 0 ? (
        <p className="mt-3">Ooops! List Obat Masih Kosong, Yuk Tambah Obat Dulu...</p>
      ) : (
        drugs.map((drug) => (
          <div className="card mt-3 shadow" key={drug.id}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="labelPil d-flex align-items-center justify-content-center">
                <img
                  src="./img/medicine.png"
                  alt="Capsule"
                  id="labelPict"
                  width="25"
                />
                <span className="h3 pt-2 ms-2 text-uppercase fw-bold">{drug.nama_obat}</span>
              </div>
              <div className="rounded bg-secondary-subtle d-flex align-items-center px-3 py-1">
                <img
                  src="./img/capsule.png"
                  alt="Capsule"
                  id="labelPict"
                  width="13.5"
                /><span id="curentPils" className="fs-5 ms-2">{drug.total_obat}</span>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex align-items-center justify-content-between">
                <button type="button" className="btn btn-sm btn-primary">
                  Pil Tersisa
                  <span className="badge text-bg-secondary">{drug.total_obat} pil</span>
                </button>
                <button type="button" className="btn btn-sm btn-primary">
                  Durasi
                  <span className="badge text-bg-secondary">Auto</span>
                </button>
              </div>
              <div>
                <sub className="text-center text-secondary">Pengingat: Auto</sub>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Button trigger modal */}
      <button
        type="button"
        className="btn btn-primary position-fixed shadow"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        style={{ bottom: '3rem', right: '2rem' }}
        onClick={openModal}
      >
        <i className="bi bi-plus-lg fs-2"></i>
      </button>

      {/* Modal */}
      <div
        className={`modal fade ${isModalOpen ? 'show' : ''}`}
        id="staticBackdrop"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Tambahkan Pengingat
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddDrug}>
                <div className="mb-3">
                  <label htmlFor="namaObat" className="form-label">Nama Obat</label>
                  <input
                    type="text"
                    className="form-control"
                    id="namaObat"
                    name="nama_obat"
                    placeholder="Ex: Paracetamol"
                    value={newDrug.nama_obat}
                    onChange={handleInputChange}
                    autoFocus
                    required
                  />
                </div>
                {/* Tipe Obat */}
                <div className="mb-3">
                  <label htmlFor="obatType" className="form-label">Jenis Obat</label>
                  <select
                    className="form-select form-select-md mb-3"
                    aria-label="Large select example"
                    id="obatType"
                    name="tipe_obat"
                    value={newDrug.tipe_obat}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">---</option>
                    <option value="Kapsul">Kapsul</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Sirup">Sirup</option>
                    <option value="Salep">Salep</option>
                  </select>
                </div>
                {/* Syarat Minum Obat */}
                <div className="mb-3">
                  <label htmlFor="syaratObat" className="form-label">Harus diminum saat apa:</label>
                  <select
                    className="form-select form-select-md mb-3"
                    aria-label="Large select example"
                    id="syaratObat"
                    name="ketentuan_obat"
                    value={newDrug.ketentuan_obat}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">---</option>
                    <option value="sebelum makan">Sebelum Makan</option>
                    <option value="setelah makan">Setelah Makan</option>
                    <option value="satu jam sebelum makan">Satu Jam Sebelum Makan</option>
                    <option value="satu jam setelah makan">Satu Jam Setelah Makan</option>
                  </select>
                </div>
                {/* Berapa Kali Sehari */}
                <div className="mb-3">
                  <label htmlFor="xObat" className="form-label">Sehari Berapa Kali</label>
                  <input
                    type="number"
                    className="form-control"
                    id="xObat"
                    name="sehari_berapa"
                    placeholder="Ex: 3"
                    value={newDrug.sehari_berapa}
                    onChange={handleInputChange}
                    autoFocus
                    required
                  />
                </div>
                {/* Berapa Obat Sehari */}
                <div className="mb-3">
                  <label htmlFor="onePilInput" className="form-label">Sekali Berapa Pil</label>
                  <input
                    type="number"
                    className="form-control"
                    id="onePilInput"
                    name="sekali_berapa"
                    placeholder="Ex: 2"
                    aria-describedby="totalObatDesc"
                    value={newDrug.sekali_berapa}
                    onChange={handleInputChange}
                    autoFocus
                    required
                  />
                  <div id="totalObatDesc" className="form-text">
                    Total obat mempengaruhi pengingat otomatis
                  </div>
                </div>
                {/* Total Obat */}
                <div className="mb-3">
                  <label htmlFor="totalObat" className="form-label">Total Obat</label>
                  <input
                    type="number"
                    className="form-control"
                    id="totalObat"
                    name="total_obat"
                    placeholder="Ex: 9"
                    aria-describedby="totalObatDesc"
                    value={newDrug.total_obat}
                    onChange={handleInputChange}
                    autoFocus
                    required
                  />
                  <div id="totalObatDesc" className="form-text">
                    Total obat mempengaruhi pengingat otomatis
                  </div>
                </div>
                {/* Atur Waktu Mulai Minum Obat Obat */}
                <div className="mb-3">
                  <input
                    type="hidden"
                    className="form-control"
                    name="waktu_pengingat"
                    value={newDrug.waktu_pengingat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary w-50 text-uppercase fw-bolder shadow"
                    data-bs-dismiss="modal"
                    onClick={closeModal}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-50 text-uppercase fw-bolder shadow"
                    name="tambahPengingat"
                    disabled={loading}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <><i className="bi bi-plus-lg"></i> Tambah</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
