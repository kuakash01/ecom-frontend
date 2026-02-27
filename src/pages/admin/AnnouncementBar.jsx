import { useEffect, useState } from "react";
import api from "../../config/apiAdmin";
import TextArea from "../../components/common/form/input/TextArea";
import Label from "../../components/common/form/Label";


export default function AnnouncementPage() {
  const [message, setMessage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await api.get("/announcement");
        if (res.data?.data) {
          const data = res.data.data;
          setMessage(data.message || "");
          setBackgroundColor(data.backgroundColor || "#000000");
          setTextColor(data.textColor || "#ffffff");
          setLink(data.link || "");
          setIsActive(data.isActive || false);
        }
      } catch (err) {
        console.error("Failed to load announcement");
      }
    };

    fetchAnnouncement();
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError(true);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      await api.post("/announcement/save", {
        message,
        backgroundColor,
        textColor,
        link,
        isActive,
      });

      alert("Announcement updated successfully");
    } catch (err) {
      alert("Error saving announcement");
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div className="p-6 space-y-8">

//       {/* Page Title */}
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
//           Announcement Bar Settings
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Manage the announcement bar displayed at the top of the website.
//         </p>
//       </div>

//       {/* Form Section */}
//       <div className="space-y-6">

//         {/* Message */}
//         <div>
//           <Label>Announcement Message</Label>
//           <TextArea
//             placeholder="Enter announcement message"
//             rows={4}
//             value={message}
//             onChange={setMessage}
//             error={error}
//             hint={error ? "Announcement message is required." : ""}
//           />
//         </div>

//         {/* Background Color */}
//         <div>
//           <Label>Background Color</Label>
//           <input
//             type="color"
//             value={backgroundColor}
//             onChange={(e) => setBackgroundColor(e.target.value)}
//             className="mt-2 h-10 w-20 rounded border"
//           />
//         </div>

//         {/* Text Color */}
//         <div>
//           <Label>Text Color</Label>
//           <input
//             type="color"
//             value={textColor}
//             onChange={(e) => setTextColor(e.target.value)}
//             className="mt-2 h-10 w-20 rounded border"
//           />
//         </div>

//         {/* Redirect Link */}
//         <div>
//           <Label>Redirect Link (Optional)</Label>
//           <input
//             type="text"
//             value={link}
//             onChange={(e) => setLink(e.target.value)}
//             placeholder="https://example.com"
//             className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm"
//           />
//         </div>

//         {/* Toggle */}
//         <div className="flex items-center gap-3">
//           <input
//             type="checkbox"
//             checked={isActive}
//             onChange={(e) => setIsActive(e.target.checked)}
//             className="h-4 w-4"
//           />
//           <Label>Enable Announcement Bar</Label>
//         </div>

//         {/* Save Button */}
//         <div>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bg-black text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

return (
  <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">

    {/* Header */}
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
        Announcement Bar Settings
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Control the top announcement displayed across your website.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* LEFT SIDE – FORM */}
      <div className="space-y-6">

        {/* Message */}
        <div>
          <Label>Announcement Message</Label>
          <TextArea
            placeholder="Enter short announcement (single line recommended)"
            rows={3}
            value={message}
            onChange={setMessage}
            error={error}
            hint={
              error
                ? "Announcement message is required."
                : "Keep it short and impactful."
            }
          />
        </div>

        {/* Colors Row */}
        <div className="flex flex-col sm:flex-row gap-6">

          <div>
            <Label>Background</Label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="mt-2 h-12 w-20 rounded-lg border cursor-pointer"
            />
          </div>

          <div>
            <Label>Text Color</Label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="mt-2 h-12 w-20 rounded-lg border cursor-pointer"
            />
          </div>
        </div>

        {/* Redirect */}
        <div>
          <Label>Redirect Link (Optional)</Label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <div>
            <p className="text-sm font-medium dark:text-white">
              Enable Announcement Bar
            </p>
            <p className="text-xs text-gray-500">
              Show this message on the website
            </p>
          </div>

          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-xl hover:opacity-90 transition font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* RIGHT SIDE – LIVE PREVIEW */}
      <div className="space-y-4">

        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Live Preview
        </h2>

        <div
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
          }}
          className="w-full py-3 px-4 rounded-xl shadow-md text-center text-sm font-medium cursor-pointer transition-all duration-300"
        >
          <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
            {message || "Your announcement preview will appear here"}
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Preview shows how it will appear on both mobile and desktop.
          Text is restricted to a single line.
        </p>
      </div>
    </div>
  </div>
);
}