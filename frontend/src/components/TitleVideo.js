import React from "react";
import './TitleVideo.css';

const TitleVideo = () => {
    return (
        <div className="title-video-wrapper">
            <div className="title-video-container">
                <h1 className="title-video-heading">Skills</h1>
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
            </div>
        </div>
    );
};

export default TitleVideo;