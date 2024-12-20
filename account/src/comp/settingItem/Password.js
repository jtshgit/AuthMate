import React from 'react';

const Password = ({ data }) => {
    const handleChange = () => {
        window.location.href = process.env.REACT_APP_PUBLIC_URL + "/reset";
    }
    return (
        <div>
            <div className="tab-pane fade show active" id="account" role="tabpanel">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Password</h5>
                    </div>
                    <div className="card-body">
                        <button onClick={handleChange} className='btn btn-primary'>Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Password;
