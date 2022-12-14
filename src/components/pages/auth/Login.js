import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { logIn } from "../../../actions/authActions";
import angels from "../../imgs/Angels.png";
import "./Form.scss";
import _ from "lodash";
import { Navigate, useLocation } from "react-router-dom";

const Login = ({ user, logIn }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (formValues) => {
    setErrorMessage(await logIn(formValues));
  };

  if (user?.googleId) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="form_main_container">
      <div className="form_container">
        <LoginForm errorMessage={errorMessage} onSubmit={onSubmit} />
        <img className="angels" src={angels} alt="data error" />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { logIn })(Login);
