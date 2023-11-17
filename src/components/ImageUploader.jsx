import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function ImageDropZone({ className }) {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
    console.log("accepted file", acceptedFiles);

    if (rejectedFiles?.length) {
      setRejectedFiles((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
    console.log("rejected file", rejectedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
  });
  function removeFile(name) {
    setFiles((files) => files.filter((file) => file.name !== name));
  }

  function removeRejectedFile(name) {
    setRejectedFiles((files) => files.filter((obj) => obj.file.name !== name));
  }

  return (
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
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <img
              src={file.preview}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            ></img>
            <button type="button" onClick={() => removeFile(file.name)}>
              Delete Image
            </button>
          </li>
        ))}
      </ul>
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
    </form>
  );
}

export default ImageDropZone;
