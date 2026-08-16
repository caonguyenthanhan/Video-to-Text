"use client";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function RichEditor({ value, onChange, className }: RichEditorProps) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet'
  ];

  return (
    <div className={`quill-custom-wrapper ${className || ''}`}>
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
