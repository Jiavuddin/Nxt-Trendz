import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css'

function LoginForm() {

    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        showSubmitError: false,
        errorMsg: ''
    });

    const onChangeUsername = event => {
        setLoginData(prevState => ({
            ...prevState,
            username: event.target.value
        }));
    };

    const onChangePassword = event => {
        setLoginData(prevState => ({
            ...prevState,
            password: event.target.value
        }));
    };

    const onSubmitSuccess = jwtToken => {

        navigate('/', { replace: true });

        Cookies.set('jwt_token', jwtToken, {
            expires: 30,
            path: '/',
        });

        sessionStorage.setItem('cart', JSON.stringify([]));
    };

    const onSubmitFailure = errorMsg => {
        setLoginData(prevState => ({
            ...prevState,
            showSubmitError: true,
            errorMsg
        }));
    };

    const submitForm = async event => {

        event.preventDefault();

        const { username, password } = loginData;

        const userDetails = { username, password };

        const url = 'https://apis.ccbp.in/login';

        const options = {
            method: 'POST',
            body: JSON.stringify(userDetails),
        };

        const response = await fetch(url, options);

        const data = await response.json();

        if (response.ok === true) {
            onSubmitSuccess(data.jwt_token);
        }
        else {
            onSubmitFailure(data.error_msg);
        }
    };

    const renderPasswordField = () => {

        const { password } = loginData;

        return (
            <>
                <label className="input-label" htmlFor="password">
                    PASSWORD
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="password-input-field"
                    value={password}
                    onChange={onChangePassword}
                />
            </>
        );
    };

    const renderUsernameField = () => {

        const { username } = loginData;

        return (
            <>
                <label className="input-label" htmlFor="username">
                    USERNAME
                </label>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="username-input-field"
                    value={username}
                    onChange={onChangeUsername}
                />
            </>
        );
    };

    const { showSubmitError, errorMsg } = loginData;

    const jwtToken = Cookies.get('jwt_token');

    if (jwtToken !== undefined) {
        return <Navigate to="/" />
    }

    return (
        <div className="login-form-container">
            <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
                className="login-website-logo-mobile-image"
                alt="website logo"
            />
            <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
                className="login-image"
                alt="website login"
            />
            <form className="form-container" onSubmit={submitForm}>
                <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
                    className="login-website-logo-desktop-image"
                    alt="website logo"
                />
                <div className="input-container">{renderUsernameField()}</div>
                <div className="input-container">{renderPasswordField()}</div>
                <button type="submit" className="login-button">
                    Login
                </button>
                {showSubmitError && <p className="error-message">*{errorMsg}</p>}
            </form>
        </div>
    )
}

export default LoginForm;