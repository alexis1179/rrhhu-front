import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Styles/Login.css';
import { Button, TextField } from "@mui/material";

// Simulación de autenticación de usuario y contraseña
function auth(user, password) {
    // Lógica de autenticación aquí
    return user === "admin" && password === "1234";
}

// Hook personalizado para manejar el formulario
const useLoginForm = () => {
    const [formData, setFormData] = useState({
        user: "",
        password: "",
        errorEmail: false,
        errorPassword: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            errorEmail: name === "user" ? !value : prevFormData.errorEmail,
            errorPassword: name === "password" ? !value : prevFormData.errorPassword,
        }));
    };

    return [formData, handleChange];
};

// Componente reutilizable para los campos de texto
const TextFieldComponent = ({ label, type, name, error, helperText, onChange }) => (
    <TextField
        className="login-item"
        label={label}
        variant="outlined"
        type={type}
        name={name}
        required
        error={error}
        helperText={helperText}
        onChange={onChange}
    />
);

const Login = () => {
    const navigate = useNavigate();
    const [user, serUser] = useState();
    const [password, setPassword] = useState();
    const [formData, handleChange] = useLoginForm();

    const handleSubmit = () => {
        if (auth(formData.user, formData.password)) {
            navigate('/dashboard');
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                errorEmail: true,
                errorPassword: true
            }));
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <p className="login-item">Sistema Integral de Gestión de Personal y Nómina</p>
                <TextFieldComponent
                    label="Usuario"
                    type="email"
                    name="user"
                    error={formData.errorEmail}
                    helperText={formData.errorEmail ? "Usuario inválido" : ""}
                    onChange={handleChange}
                />
                <TextFieldComponent
                    label="Contraseña"
                    type="password"
                    name="password"
                    error={formData.errorPassword}
                    helperText={formData.errorPassword ? "Contraseña inválida" : ""}
                    onChange={handleChange}
                />
                <Button className="login-item" variant="contained" onClick={handleSubmit}>
                    Iniciar Sesión
                </Button>
            </div>
        </div>
    );
};

export default Login;
