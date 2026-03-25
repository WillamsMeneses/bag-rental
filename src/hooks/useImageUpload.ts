import { useRef, useState } from 'react';
import { cloudinaryService } from '@/services/cloudinary.service';

interface UseImageUploadProps {
  multiple?: boolean;
  onUpload: (urls: string[]) => Promise<void>;
}

export const useImageUpload = ({ multiple = false, onUpload }: UseImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => cloudinaryService.uploadImage(f)));
      await onUpload(urls);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return { fileInputRef, uploading, handleClick, handleChange, multiple };
};