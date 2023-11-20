import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ImageCropModal from "./ImageCropModal";
import "./ImageUploader.scss";
import "react-image-crop/dist/ReactCrop.css";

function ImageDropZone({ className }) {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ current: null });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
    // console.log("accepted file", acceptedFiles);

    if (rejectedFiles?.length) {
      setRejectedFiles((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
    // console.log("rejected file", rejectedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    // maxSize: 1024 * 1000,
  });

  function removeFile(name) {
    setFiles((files) => files.filter((file) => file.name !== name));
  }

  function removeRejectedFile(name) {
    setRejectedFiles((files) => files.filter((obj) => obj.file.name !== name));
  }

  function onEditClick(img) {
    setSelectedImage({ current: img });
    setIsEditing(true);
  }

  console.log(selectedImage);

  const previews = files.map((file) => (
    <div className="preview" key={file.name}>
      <div className="preview-inner">
        <img src={file.preview} className="img" alt="" />
      </div>

      <div className="preview-buttons">
        <button
          type="button"
          onClick={() => {
            onEditClick(file.preview);
          }}
        >
          Edit
        </button>
        <button type="button" onClick={() => removeFile(file.name)}>
          Delete
        </button>
      </div>
    </div>
  ));

  const makeClientCrop = async (crop, fullImgWidth, fullImgHeight) => {
    if (selectedImage.current && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(
        selectedImage.current,
        crop,
        "newFile.jpeg",
        fullImgWidth,
        fullImgHeight
      );
      setCroppedImageUrl(croppedImage);
    }
  };

  const getCroppedImg = (file, crop, fileName, fullImgWidth, fullImgHeight) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = file;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / fullImgWidth;
        const scaleY = image.naturalHeight / fullImgHeight;
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            reject(new Error("Canvas is empty"));
            return;
          }
          blob.name = fileName;
          const croppedImageUrl = window.URL.createObjectURL(blob);
          resolve(croppedImageUrl);
        }, "image/jpeg");
      };
      image.onerror = () => {
        reject(new Error("Image loading error"));
      };
    });
  };

  // useEffect(
  //   () => () => {
  //     // Make sure to revoke the Object URL to avoid memory leaks
  //     files.forEach((file) => URL.revokeObjectURL(file.preview));
  //   },
  //   [files]
  // );

  return (
    <>
      <form>
        <div
          {...getRootProps({
            className,
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop some files here, or click to select files</p>
          )}
        </div>
        <h3>Accepted Files</h3>
        <br />
        <div>{previews}</div>
        <h3>Rejected Files</h3>
        <ul>
          {rejectedFiles.map((obj) => (
            <li key={obj.file.name}>
              <div>
                <p>{obj.file.name}</p>
                <button
                  type="button"
                  onClick={() => removeRejectedFile(obj.file.name)}
                >
                  Delete Image
                </button>
              </div>
            </li>
          ))}
        </ul>
        {isEditing && (
          <div className="">
            <ImageCropModal
              selectedImage={selectedImage.current}
              // onCropComplete={onCropComplete}
              // cancelEdit={cancelEdit}
              setSelectedImage={setSelectedImage}
              setIsEditing={setIsEditing}
              makeClientCrop={makeClientCrop}
            />
          </div>
        )}
      </form>

      {croppedImageUrl && (
        <>
          <h3>Cropped Image</h3>
          <div className="preview">
            <div className="preview-inner">
              <img
                src={croppedImageUrl}
                alt="Cropped image"
                className="image"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ImageDropZone;
