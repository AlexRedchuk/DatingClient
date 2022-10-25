import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from "react-router-dom";

const UnauthorizedRoute = ({ auth, children }) => {
    if (auth) {
    return <Navigate to="/home" replace />;
    }
    return children;
   };


const mapStateToProps = (state) => {
    return {
        auth: state.auth.isSignedIn
    }
}

export default connect(mapStateToProps, null)(UnauthorizedRoute);