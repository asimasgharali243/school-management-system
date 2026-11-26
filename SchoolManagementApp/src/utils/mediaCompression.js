import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Compress image using expo-image-manipulator
 */
export const compressImage = async (uri, options = {}) => {
    try {
        const {
            maxWidth = 1200,
            maxHeight = 1200,
            quality = 0.7,
            format = 'jpeg',
        } = options;

        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
                {
                    resize: {
                        width: maxWidth,
                        height: maxHeight,
                    },
                },
            ],
            {
                compress: quality,
                format: ImageManipulator.SaveFormat[format.toUpperCase()] || ImageManipulator.SaveFormat.JPEG,
            }
        );

        return {
            uri: result.uri,
            width: result.width,
            height: result.height,
            size: await getFileSize(result.uri),
        };
    } catch (error) {
        console.error('Image compression error:', error);
        // Return original if compression fails
        return {
            uri,
            size: await getFileSize(uri),
        };
    }
};

/**
 * Get file size in bytes
 */
export const getFileSize = async (uri) => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        return fileInfo.size || 0;
    } catch (error) {
        return 0;
    }
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension
 */
export const getFileExtension = (uri) => {
    const parts = uri.split('.');
    return parts[parts.length - 1].toLowerCase();
};

/**
 * Check if file is a video
 */
export const isVideoFile = (uri) => {
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'm4v'];
    const ext = getFileExtension(uri);
    return videoExtensions.includes(ext);
};

/**
 * Check if file is an image
 */
export const isImageFile = (uri) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic', 'heif'];
    const ext = getFileExtension(uri);
    return imageExtensions.includes(ext);
};

/**
 * Generate thumbnail for video
 */
export const generateVideoThumbnail = async (videoUri) => {
    try {
        // Using expo-image-manipulator to get first frame as thumbnail
        // Note: This is a basic implementation. For production, consider using
        // a dedicated video thumbnail library
        const thumbnail = await ImageManipulator.manipulateAsync(
            videoUri,
            [
                {
                    resize: {
                        width: 400,
                        height: 400,
                    },
                },
            ],
            {
                compress: 0.5,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return thumbnail.uri;
    } catch (error) {
        console.error('Video thumbnail generation error:', error);
        return null;
    }
};

/**
 * Process media files before upload (batch compression)
 */
export const processMediaFiles = async (files, options = {}) => {
    const {
        compressImages = true,
        imageQuality = 0.7,
        maxImageWidth = 1200,
        maxImageHeight = 1200,
        generateThumbnails = true,
    } = options;

    const processedFiles = [];
    
    for (const file of files) {
        try {
            if (isImageFile(file.uri || file.fileName)) {
                if (compressImages) {
                    const compressed = await compressImage(file.uri, {
                        quality: imageQuality,
                        maxWidth: maxImageWidth,
                        maxHeight: maxImageHeight,
                    });
                    processedFiles.push({
                        ...file,
                        uri: compressed.uri,
                        originalSize: file.fileSize || 0,
                        compressedSize: compressed.size,
                        compressed: true,
                    });
                } else {
                    processedFiles.push({
                        ...file,
                        compressed: false,
                    });
                }
            } else if (isVideoFile(file.uri || file.fileName)) {
                // Videos are not compressed on client side to maintain quality
                // Backend should handle video compression
                let thumbnail = null;
                if (generateThumbnails) {
                    thumbnail = await generateVideoThumbnail(file.uri);
                }
                processedFiles.push({
                    ...file,
                    thumbnail,
                    compressed: false,
                });
            } else {
                processedFiles.push(file);
            }
        } catch (error) {
            console.error(`Error processing file ${file.fileName}:`, error);
            processedFiles.push(file);
        }
    }
    
    return processedFiles;
};

/**
 * Calculate total size of all files
 */
export const calculateTotalSize = async (files) => {
    let totalSize = 0;
    for (const file of files) {
        if (file.fileSize) {
            totalSize += file.fileSize;
        } else {
            const size = await getFileSize(file.uri);
            totalSize += size;
        }
    }
    return totalSize;
};