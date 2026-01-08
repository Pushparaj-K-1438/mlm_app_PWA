import { useRef, useState } from "react";
import { Upload, Trash2, Video } from "lucide-react";
import Lib from "@/utils/Lib";
export const VITE_BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunk
const getRealFileName = (responsePath = "") => {
  return responsePath;
};

export default function FileUpload({
  label = "",
  name = "name",
  value = "",
  error = "",
  onChange = () => {},
  showFileValue = true,
  setLoading = () => {},
}: any) {
  const [fileName, setFileName] = useState(getRealFileName(value[name]) ?? "");
  const fileRef: any = useRef();
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadFileInChunks = async (rawFile: any) => {
    setFileName(rawFile?.name);
    setProgress(0);
    setUploaded(true);
    setUploading(true);
    setLoading(true);
    setUploadError("");
    const totalChunks: any = Math.ceil(rawFile.size / CHUNK_SIZE);

    for (let i: any = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(rawFile.size, start + CHUNK_SIZE);
      const chunk = rawFile.slice(start, end);

      const formData = new FormData();
      formData.append("videofile", chunk);
      formData.append("filename", rawFile.name);
      formData.append("chunkIndex", i);
      formData.append("totalChunks", totalChunks);

      try {
        let response = await fetch(
          `${VITE_BASE_URL}upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${Lib.getCookies("session-token")}`,
            },
            body: formData,
          }
        );
        const data = await response.json();
        setProgress(Math.round(((i + 1) / totalChunks) * 100));

        if (data.status === "merged") {
          if (showFileValue) {
            setFileName((prv) => getRealFileName(data.stored_filename));
          }
          onChange({
            target: {
              name,
              value: data.stored_filename,
            },
          });
        }
      } catch (err) {
        clearFile(false);
        setUploadError("Upload failed please retry again");
      }
    }
    setUploaded(false);
    setUploading(false);
    setLoading(false);
  };

  const deleteAPI = async () => {
    // await fetch(`https://api.starupworld.com/api/v1/delete`, {
    //   method: "DELETE",
    //   headers: {
    //     Authorization: `Bearer ${Lib.getCookies("session-token")}`,
    //   },
    // });
  };

  const clearFile = (deleteService = true) => {
    if (deleteService) {
      deleteAPI();
    }

    onChange({
      target: {
        name,
        value: "",
      },
    });
    setFileName((prv) => "");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Video Source
      </label>
      {!Boolean(fileName) && (
        <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer">
          <Upload className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Direct Upload
            </label>
            <input
              type="file"
              accept="video/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(event: any) =>
                uploadFileInChunks(event.target.files[0])
              }
              ref={fileRef}
            />

            <p className="text-sm text-red-800 pt-1" role="alert">
              {uploadError || error[name]}
            </p>
          </div>
        </div>
      )}

      {Boolean(fileName) && (
        <div className="mt-3 p-3 border border-gray-300 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            {uploading ? (
              <span className="text-sm font-medium">{fileName}</span>
            ) : (
              <a
                href={Lib.CloudPath(fileName ?? "")}
                target="_blank"
                className="flex"
              >
                <Video className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600 underline">
                  {Lib.getFileName(fileName)}
                </span>
              </a>
            )}

            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => clearFile(true)}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          {uploaded && (
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <span className="text-sm text-gray-600">
            {uploaded
              ? `Uploading: ${progress}%`
              : uploading
              ? "Upload complete"
              : ""}
          </span>
        </div>
      )}
    </div>
  );
}
