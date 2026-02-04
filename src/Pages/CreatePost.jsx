// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import postAPI from "../api/postApi"; // ✅ posts API
// import Navbar from "../components/Navbar";

// export default function CreatePost() {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handlePost = async () => {
//     if (!image) return alert("Image is required");

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("image", image); // 🔥 multer field name
//       formData.append("caption", caption);

//       await postAPI.post("/", formData); // ✅ /api/posts

//       navigate("/profile"); // or feed page
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Post failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="pt-20 flex justify-center">
//         <div className="bg-[#e5e5e5] p-8 rounded-lg w-[420px] text-center">

//           {/* IMAGE DROP */}
//           <label className="block cursor-pointer">
//             <input
//               type="file"
//               accept="image/*"
//               hidden
//               onChange={handleImageChange}
//             />

//             <div className="bg-white rounded-xl h-[260px] flex items-center justify-center border-dashed border-2">
//               {preview ? (
//                 <img
//                   src={preview}
//                   alt="preview"
//                   className="h-full w-full object-cover rounded-xl"
//                 />
//               ) : (
//                 <div className="text-gray-400">
//                   <div className="text-4xl mb-2">🖼</div>
//                   <p>Drop your image</p>
//                 </div>
//               )}
//             </div>
//           </label>

//           {/* DESCRIPTION */}
//           <div className="mt-6 text-left">
//             <label className="font-semibold">Description</label>
//             <textarea
//               value={caption}
//               onChange={(e) => setCaption(e.target.value)}
//               maxLength={360}
//               placeholder="The start of a wonderful story..."
//               className="w-full mt-2 h-24 rounded-lg p-3 border resize-none"
//             />
//             <p className="text-right text-xs text-gray-400">
//               {caption.length}/360
//             </p>
//           </div>

//           {/* POST BUTTON */}
//           <button
//             onClick={handlePost}
//             disabled={loading}
//             className="mt-6 w-32 h-10 bg-blue-500 text-white rounded-md font-medium"
//           >
//             {loading ? "Posting..." : "Post"}
//           </button>
//         </div>
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X, ChevronLeft } from "lucide-react";
import postAPI from "../api/postApi";

/* -------- IMAGE RESIZE UTILITY -------- */
const resizeImage = (file, maxSize = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => (img.src = e.target.result);
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > height && width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };
  });
};

export default function CreatePost() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const MAX_IMAGES = 5;

  /* -------- IMAGE PICKER -------- */
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      alert(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    const resizedImages = await Promise.all(
      files.map((file) => resizeImage(file))
    );

    setImages((prev) => [...prev, ...resizedImages]);
    setPreviews((prev) => [
      ...prev,
      ...resizedImages.map((file) => URL.createObjectURL(file)),
    ]);
  };

  /* -------- REMOVE IMAGE -------- */
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  /* -------- POST -------- */
  const handlePost = async () => {
    if (images.length === 0) {
      alert("At least one image is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      formData.append("caption", caption);

      const token = localStorage.getItem("token");

      await postAPI.post("/", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ DO NOT set Content-Type
        },
      });

      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>


      <div className="max-w-xl mx-auto bg-white">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={28} />
          </button>
          <h1 className="font-semibold text-lg">Create new post</h1>
          <button
            onClick={handlePost}
            disabled={loading || images.length === 0}
            className="text-blue-500 font-semibold disabled:opacity-30"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        {/* IMAGE PREVIEW */}
        {previews.length > 0 ? (
          <div className="relative bg-black h-80">
            <img
              src={previews[0]}
              className="w-full h-full object-cover"
              alt="preview"
            />
            {previews.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                1/{previews.length}
              </div>
            )}
          </div>
        ) : (
          <label className="h-80 bg-gray-50 flex flex-col items-center justify-center cursor-pointer border-b">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
            <ImagePlus size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Select photos</p>
          </label>
        )}

        {/* THUMBNAILS */}
        {previews.length > 0 && (
          <div className="flex gap-2 p-3 overflow-x-auto border-b">
            {previews.map((src, i) => (
              <div key={i} className="relative flex-shrink-0">
                <img
                  src={src}
                  className="h-16 w-16 object-cover rounded border"
                  alt={`preview-${i}`}
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <label className="h-16 w-16 flex-shrink-0 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
                <ImagePlus size={20} className="text-gray-400" />
              </label>
            )}
          </div>
        )}

        {/* CAPTION */}
        <div className="p-3">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={360}
            placeholder="Write a caption..."
            className="w-full h-24 resize-none outline-none text-sm"
          />
          <div className="text-xs text-gray-400 text-right">
            {caption.length}/360
          </div>
        </div>

        {/* POST BUTTON */}
        <div className="p-3 border-t">
          <button
            onClick={handlePost}
            disabled={loading || images.length === 0}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold disabled:opacity-30"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </>
  );
}
