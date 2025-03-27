
interface PreviewIframeProps {
  previewHtml: string;
}

export function PreviewIframe({ previewHtml }: PreviewIframeProps) {
  return (
    <div className="p-0 h-[600px] overflow-auto">
      <iframe
        srcDoc={previewHtml}
        title="PDF Preview"
        className="w-full h-full border-0"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
