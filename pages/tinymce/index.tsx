import { useState, useEffect,useRef } from "react";
import dynamic from "next/dynamic";

// Import Editor chỉ khi chạy trên client
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });

export default function MyEditor() {
  const [content, setContent] = useState(""); // Biến lưu nội dung
  const [isClient, setIsClient] = useState(false); // Kiểm tra client-side
  const textareaRef = useRef<HTMLTextAreaElement>(null);                                                                                                
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div>
      {isClient ? (
       <Editor
       apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
       initialValue={content}
       init={{
         height: 500,
         language: "vi",
          menubar: "file edit view format table tools help",
         branding: false, // Ẩn logo TinyMCE
         plugins: [
           "advlist",
           "autolink",
           "lists",
           "link",
           "image",
           "charmap",
           "preview",
           "anchor",
           "searchreplace",
           "visualblocks",
           "code",
           "fullscreen",
           "insertdatetime",
           "media",
           "table", // ✅ Plugin bảng
           "help",
           "wordcount",
         ],
         toolbar:
         "undo redo | formatselect | fontselect fontsizeselect | " + // ✅ Thêm chọn font & cỡ chữ
         "bold italic underline strikethrough | forecolor backcolor | " + 
         "alignleft aligncenter alignright alignjustify | " +
         "bullist numlist outdent indent | removeformat | " +
         "image | table",
         font_formats: "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times,serif;",
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
           file_picker_types: "image",
           images_upload_handler: (blobInfo, progress) => 
             new Promise((resolve) => {
               const reader = new FileReader();
               reader.readAsDataURL(blobInfo.blob());
               reader.onloadend = () => resolve(reader.result as string);
             }),
            // ✅ Thêm nút chèn bảng
         table_responsive_width: true, // ✅ Kéo giãn bảng
         table_resize_bars: true, // ✅ Hiển thị thanh kéo resize
         table_advtab: true, // ✅ Hiển thị tab nâng cao cho bảng
         table_cell_advtab: true, // ✅ Tùy chỉnh ô trong bảng
         table_row_advtab: true, // ✅ Tùy chỉnh hàng trong bảng
         table_background_color_map: [
           // ✅ Danh sách màu có sẵn để chọn khi bôi màu ô
           { title: "Đen", value: "#000000" },
           { title: "Xám", value: "#808080" },
           { title: "Trắng", value: "#FFFFFF" },
           { title: "Xanh", value: "#007bff" },
           { title: "Đỏ", value: "#dc3545" },
           { title: "Vàng", value: "#ffc107" },
           { title: "Xanh lá", value: "#28a745" },
           { title: "Hồng", value: "#e83e8c" },
         ],
       }}
       onEditorChange={(newContent) => setContent(newContent)}
     />
     
      ) : (
        <p>Đang tải trình chỉnh sửa...</p>
      )}

      <button
        onClick={() => console.log("Nội dung:", content)}
        className="bg-blue-500 text-white p-2 mt-3"
      >
        Xem nội dung
      </button>

      <div className="mt-5 border p-3">
        <h2 className="text-lg font-bold">Nội dung đã lưu:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
}
