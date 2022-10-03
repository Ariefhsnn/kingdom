import React, { useEffect, useState } from "react";

import { useDropzone } from "react-dropzone";

const UploaderBox = (props) => {
  let { files, setFiles } = props;
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },

    multiple: false,
    maxSize: 2000000,
  });

  const thumbs = files?.map((file) => (
    <div key={file?.name}>
      <div className="flex justify-center">
        <img
          className="max-h-auto max-w-[200px] w-[200px] h-auto object-cover object-center flex justify-center"
          src={file?.preview}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () =>
      files?.forEach((element) => {
        URL.revokeObjectURL(element.preview);
      });
  }, []);

  return (
    <section className="">
      <div
        {...getRootProps()}
        className="border-dashed border-[3px] border-gray-300 p-5 flex flex-col justify-center gap-2 bg-gray-50 rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        {files?.length > 0 ? (
          <aside>{thumbs}</aside>
        ) : (
          <>
            <p className="text-gray-400 flex justify-center gap-2 text-sm font-bold">
              {" "}
              Drop your image here or{" "}
              <span className="font-bold text-gray-700">Browse</span>{" "}
            </p>
            <div className="flex flex-col font-semibold ">
              <p className="text-xs text-gray-400 flex justify-center">
                JPG, PNG, SVG accepted
              </p>
              <p className="text-xs text-gray-400 flex justify-center">
                Max. file size 20MB. Max. 1 image.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UploaderBox;
