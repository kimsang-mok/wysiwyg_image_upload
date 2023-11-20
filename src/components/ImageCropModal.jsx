import ReactCrop from "react-image-crop";
import { useState, useRef, useEffect } from "react";
import "./ImageCropModal.scss";
import { makeAspectCrop, centerCrop } from "react-image-crop";

function ImageCropModal({
  selectedImage,
  setSelectedImage,
  setIsEditing,
  makeClientCrop,
}) {
  const [crop, setCrop] = useState();
  const imgContainerRef = useRef(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const onCropComplete = (crop, fullImgWidth, fullImgHeight) => {
    setSelectedImage({ current: null });
    setIsEditing(false);
    makeClientCrop(crop, fullImgWidth, fullImgHeight);
    setCrop();
  };

  const cancelEdit = () => {
    setSelectedImage({ current: null });
    setIsEditing(false);
    setCrop();
  };

  function onImageLoad() {
    const width = imgDimensions.width;
    const height = imgDimensions.height;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "px",
          width: width * 0.8,
        },
        4 / 3,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  useEffect(() => {
    // Function to update the dimensions of the img container
    const updateImgDimensions = () => {
      if (imgContainerRef.current) {
        const width = imgContainerRef.current.clientWidth;
        const height = imgContainerRef.current.clientHeight;
        setImgDimensions({ width, height });
      }
    };

    // Call the updateImgDimensions function initially
    updateImgDimensions();

    // Event listener for window resize
    window.addEventListener("resize", updateImgDimensions);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateImgDimensions);
    };
  }, []);

  const handleOutSideClick = (event) => {
    if (
      imgContainerRef.current &&
      !imgContainerRef.current.contains(event.target) &&
      !event.target.closest(".crop-button")
    ) {
      cancelEdit();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutSideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [imgContainerRef]);

  console.log("adjusted load", crop);

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-body">
          <div className="crop-preview">
            <ReactCrop
              //   onImageLoad={onImageLoad}
              crop={crop}
              aspect={4 / 3}
              onChange={(c) => setCrop(c)}
            >
              <div className="image-container">
                <div className="preview-inner">
                  <img
                    ref={imgContainerRef}
                    className="image"
                    src={selectedImage}
                    alt="Selected"
                    onLoad={onImageLoad}
                  />
                </div>
              </div>
            </ReactCrop>

            <div className="crop-button">
              <button
                type="button"
                onClick={() =>
                  onCropComplete(
                    crop,
                    imgDimensions.width,
                    imgDimensions.height
                  )
                }
              >
                Done
              </button>
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;
