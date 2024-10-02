import React from 'react';
// import { Player } from '@lottiefiles/react-lottie-player';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import './loadingscreen.css'; // optional: add some styles

function LoadingScreen() {
    return (
        <div className="loading-container">
            {/* <Player
                autoplay
                loop
                src="https://assets10.lottiefiles.com/packages/lf20_p8bfn5to.json" // Example Lottie URL
                style={{ height: '300px', width: '300px' }}
            /> */}
            <div className="loading-container-spinner">
                <DotLottieReact
                    src="https://lottie.host/9fad16df-dcba-490a-b06f-66c67a934521/qgxIWde74O.lottie"
                    loop
                    autoplay
                />
            </div>
            
        </div>
    );
}

export default LoadingScreen;
