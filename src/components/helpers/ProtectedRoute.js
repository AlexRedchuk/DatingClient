import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ auth, children }) => {
    if (!auth) {
    return <Navigate to="/" replace />;
    }
    return children;
   };


const mapStateToProps = (state) => {
    return {
        auth: state.auth.isSignedIn
    }
}

export default connect(mapStateToProps, null)(ProtectedRoute);