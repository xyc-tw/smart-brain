import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2 pb4">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        <div
          className="bounding-box"
          style={{
            top: box.top,
            left: box.left,
            width: box.boxWidth,
            height: box.boxHeight,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
