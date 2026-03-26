import { useRef, useState } from 'react';
import { cloudinaryService } from '@/services/cloudinary.service';
import { validateImageFile } from '@/utils/file.utils';
import { useToastStore } from '@/stores/toastStore';

interface UseImageUploadProps {
  multiple?: boolean;
  // eager: upload immediately on file select (old behavior)
  // pending: preview locally, upload on flush()
  mode?: 'eager' | 'pending';
  onUpload?: (urls: string[]) => Promise<void>;
}

export const useImageUpload = ({
  multiple = false,
  mode = 'eager',
  onUpload,
}: UseImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { error } = useToastStore();

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Validate all files
    for (const file of files) {
      const err = validateImageFile(file);
      if (err) { error(err); e.target.value = ''; return; }
    }

    if (mode === 'pending') {
      // Single file only in pending mode
      const file = files[0];
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setPendingFile(file);
      e.target.value = '';
      return;
    }

    // eager mode — upload immediately
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => cloudinaryService.uploadImage(f)));
      await onUpload?.(urls);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Call this on form submit to upload the pending file
  const flush = async (): Promise<string | null> => {
    if (!pendingFile) return null;
    setUploading(true);
    try {
      const url = await cloudinaryService.uploadImage(pendingFile);
      setPendingFile(null);
      if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
      return url;
    } finally {
      setUploading(false);
    }
  };

  return { fileInputRef, uploading, handleClick, handleChange, multiple, previewUrl, flush };
};