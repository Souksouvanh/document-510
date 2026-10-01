import { useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';

// แปลง base64 data URL ให้เป็น Blob URL (ใช้ใน iframe ได้เสถียรกว่า)
function dataUrlToBlobUrl(dataUrl) {
    const [meta, base64] = dataUrl.split(',');
    const mime = meta.match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bytes = atob(base64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return URL.createObjectURL(new Blob([arr], { type: mime }));
}

function AttachmentPreview({ doc }) {
    const [blobUrl, setBlobUrl] = useState(null);
    const [textContent, setTextContent] = useState('');

    // ตรวจชนิดไฟล์
    const type = doc.fileType || '';
    const isImage = type.startsWith('image/');
    const isPdf = type === 'application/pdf';
    const isText = type.startsWith('text/') || type === 'application/json';
    const isVideo = type.startsWith('video/');
    const isAudio = type.startsWith('audio/');

    useEffect(() => {
        if (!doc.fileData) return;
        let url;
        try {
            url = dataUrlToBlobUrl(doc.fileData);
            setBlobUrl(url);
            // ถ้าเป็นไฟล์ข้อความ ให้อ่านเนื้อหามาแสดง
            if (isText) {
                fetch(url).then(r => r.text()).then(setTextContent);
            }
        } catch (e) {
            console.error('Preview failed', e);
        }
        // ล้าง Blob URL เมื่อ component ถูกถอดออก เพื่อไม่ให้กินหน่วยความจำ
        return () => url && URL.revokeObjectURL(url);
    }, [doc.fileData, isText]);

    if (!doc.fileData) return null;

    // ลิงก์ดาวน์โหลด (แสดงเสมอ)
    const downloadLink = (
        <a
            href={doc.fileData}
            download={doc.fileName || 'attachment'}
            className="inline-flex items-center gap-2 p-3 rounded-xl border border-green-200 dark:border-green-950/60 bg-green-50/50 dark:bg-green-950/30 text-green-800 dark:text-green-300 hover:bg-green-100 transition-colors text-sm font-medium"
        >
            <FileText size={18} />
            <span>ດາວໂຫຼດເອກະສານແນບ: {doc.fileName || 'ເອກະສານແນບ'}</span>
            <Download size={14} className="ml-1 opacity-75" />
        </a>
    );

    return (
        <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ເອກະສານແນບ
            </span>

            <div className="mt-2 space-y-2">
                {/* รูปภาพ */}
                {isImage && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 p-2 text-center">
                        <img
                            src={doc.fileData}
                            alt={doc.fileName}
                            className="max-h-[70vh] max-w-full rounded-lg mx-auto object-contain"
                        />
                    </div>
                )}

                {/* PDF แสดงใน iframe เต็มความสูงหน้าจอ 75% */}
                {isPdf && blobUrl && (
                    <iframe
                        src={blobUrl}
                        title={doc.fileName}
                        className="w-full h-[75vh] rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
                    />
                )}

                {/* ไฟล์ข้อความ */}
                {isText && (
                    <pre className="max-h-[60vh] overflow-auto p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs whitespace-pre-wrap">
                        {textContent}
                    </pre>
                )}

                {/* วิดีโอ / เสียง */}
                {isVideo && blobUrl && (
                    <video src={blobUrl} controls className="w-full max-h-[70vh] rounded-xl" />
                )}
                {isAudio && blobUrl && <audio src={blobUrl} controls className="w-full" />}

                {/* Word/Excel/PowerPoint และอื่นๆ: เบราว์เซอร์แสดงเองไม่ได้ */}
                {!isImage && !isPdf && !isText && !isVideo && !isAudio && (
                    <p className="text-xs text-slate-500">
                        ບໍ່ສາມາດສະແດງຕົວຢ່າງໄດ້ — ກະລຸນາດາວໂຫຼດ
                    </p>
                )}

                {downloadLink}
            </div>
        </div>
    );
}

export default AttachmentPreview;