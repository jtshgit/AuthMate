import React from 'react';

const Detail = ({ data }) => {
    if (!data) {
        return (<>loading...</>)
    }
    return (
        <div>
            <div className="tab-pane fade show active" id="account" role="tabpanel">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Public info</h5>
                    </div>
                    <div className="card-body">
                        <center>
                            <div className="">
                                <div className="small-12 medium-2 large-2 columns">
                                    <div className="circle">
                                        <img alt='profile-photo' className="profile" src={process.env.REACT_APP_API_URL + `/proxy-image?url=${encodeURIComponent(data.user.pp)}`} />
                                    </div>
                                    {/* <div className="p-image">
                                        <label for='pupload'>
                                            <img src='/img/cam.png' className="uploadimg" />
                                        </label>
                                        <input id='pupload' className="file-upload" type="file" accept="image/*" />
                                    </div> */}
                                </div>
                            </div>
                        </center>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <h4>{data.user.name}</h4>
                            <p>{data.user.email}</p>
                        </div>
                    </div>
                </div>
            </div></div>
    )
}
export default Detail;
