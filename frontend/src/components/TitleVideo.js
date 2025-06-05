import React from "react";
import { Link } from 'react-router-dom';
import './TitleVideo.css';

const TitleVideo = () => {
    return (
        <div className="title-video-wrapper">
            <div className="title-video-container">
                {/* <h1 className="title-video-heading">Sky Skills Assessment</h1> */}
                <div className="title-video-iframe-wrapper">
                <iframe
                    src="https://share.synthesia.io/embeds/videos/9c7aa145-ae11-4fa5-be8c-178e0ec7cb71?language=en"
                    loading="lazy"
                    title="Synthesia video player"
                    allowFullScreen
                    allow="encrypted-media; fullscreen;"
                    className="title-video-iframe"
                ></iframe>

                </div>
                <div className="link-boxes">


                <div className="box">
                    <h2>Assessment</h2>
                    {/* <img src="/icons/3d-cube.png" alt="Assessment" /> */}
                    <Link to="/assessment" className="btn">Start</Link>
                </div>

                <div className="box">
                    <h2>Summary</h2>
                    {/* <img src="/icons/analytics.png" alt="Summary" /> */}
                    <Link to="/assessmentsummary" className="btn">View</Link>
                </div>

               
            </div>
            </div>
        </div>
    );
};

export default TitleVideo;