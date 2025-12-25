import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ImageUpload = ({ value, onChange, label = "Image" }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      onChange(response.data.url);
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.detail || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    // Convert Google Drive links
    let processedUrl = urlInput;
    if (urlInput.includes('drive.google.com')) {
      if (urlInput.includes('/file/d/')) {
        const fileId = urlInput.split('/file/d/')[1].split('/')[0];
        processedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      } else if (urlInput.includes('id=')) {
        const fileId = urlInput.split('id=')[1].split('&')[0];
        processedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    onChange(processedUrl);
    setUrlInput('');
    toast({
      title: "Success",
      description: "Image URL added successfully"
    });
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">Enter URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm text-primary hover:underline">
                  {uploading ? 'Uploading...' : 'Click to upload'}
                </span>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </Label>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter image URL or Google Drive link"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports direct URLs and Google Drive sharing links
                </p>
              </div>
              <Button type="button" onClick={handleUrlSubmit}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
