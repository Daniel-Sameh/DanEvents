import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { ImagePlus, Link, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (data: { file?: File; imageUrl?: string }) => void;
  onError: (error: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, onError }) => {
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Just pass the file to parent
    onImageSelected({ file });
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) return;
    onImageSelected({ imageUrl });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadType === 'url' ? 'default' : 'outline'}
          onClick={() => setUploadType('url')}
        >
          <Link className="w-4 h-4 mr-2" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadType === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadType('file')}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {uploadType === 'url' ? (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button type="button" onClick={handleUrlSubmit}>
            Add
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};