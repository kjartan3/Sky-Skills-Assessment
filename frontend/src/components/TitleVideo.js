import React from "react";
import { Link } from 'react-router-dom';
import './TitleVideo.css';

const TitleVideo = () => {
    return (
        <div className="title-video-wrapper">
            <div className="title-video-container">
                
                <div className="title-video-iframe-wrapper">
                <iframe
                    src="https://share.synthesia.io/embeds/videos/fb5fee31-511e-4234-9d92-f50b9c4b5e05"
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
                    <p className="helper-text">Click <strong>Start</strong> to launch your self-assessment</p>
                    
                    <Link to="/assessment" className="btn">Start</Link>
                </div>

                <div className="box">
                    <h2>Summary</h2>
                    <p className="helper-text">Click <strong>View</strong> to view your summary results</p>
                    
                    <Link to="/assessmentsummary" className="btn">View</Link>
                </div>
            </div>
            </div>
        </div>
    );
};

export default TitleVideo;