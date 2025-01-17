// URL pattern matchers
const urlPatterns = {
    youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    twitter: /^https?:\/\/x\.com\/.+\/status\/.+/,
    image: /\.(jpg|jpeg|png|gif|webp)$/i,
    article: /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/,
    audio: /\.(mp3|wav|ogg|m4a)$/i,
    video: /\.(mp4|webm|ogg|mov)$/i,
  };
  
  export const validateContentType = (type: string, link: string): boolean => {
    switch (type) {
      case 'tweet':
        return urlPatterns.twitter.test(link);
      case 'video':
        // Check for both direct video links and YouTube links
        return urlPatterns.video.test(link) || urlPatterns.youtube.test(link);
      case 'image':
        return urlPatterns.image.test(link);
      case 'article':
        return urlPatterns.article.test(link);
      case 'audio':
        return urlPatterns.audio.test(link);
      default:
        return false;
    }
  };
  
  export const getErrorMessage = (type: string): string => {
    switch (type) {
      case 'tweet':
        return 'Please provide a valid Twitter status URL';
      case 'video':
        return 'Please provide a valid video URL (YouTube or direct video link)';
      case 'image':
        return 'Please provide a valid image URL or upload an image file';
      case 'article':
        return 'Please provide a valid article URL';
      case 'audio':
        return 'Please provide a valid audio URL or upload an audio file';
      default:
        return 'Invalid content type';
    }
  };