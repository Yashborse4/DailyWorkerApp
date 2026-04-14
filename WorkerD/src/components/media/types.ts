export interface MediaAsset {
    id: string | number;
    url: string;
    type: 'image' | 'video';
    thumbnail?: string; // For videos
    blurHash?: string; // For images
    caption?: string;
}
