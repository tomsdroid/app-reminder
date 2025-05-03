// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="mt-5 container">
            <div className="logoBrand w-100 d-flex align-items-center justify-content-center mb-2">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2621/2621855.png"
                    alt=""
                    width="40"
                />
                <h1 className="display-4 text-uppercase ms-3 fw-bolder">
                    Pil Reminder
                </h1>
            </div>
            <div className="justify-content-center">
                <div className="text-center">
                    <h1>Selamat Datang di Aplikasi Pengingat Obat!</h1>
                    <p className="lead">
                        Kelola dan pantau jadwal minum obat Anda dengan mudah.
                    </p>
                    <div className="mt-4 d-flex">
                        <Link
                            to="/login"
                            className="btn btn-primary me-3 w-50 fw-bolder text-uppercase"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="btn btn-success w-50 fw-bolder text-uppercase"
                        >
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
