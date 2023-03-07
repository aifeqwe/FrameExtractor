class FrameExtractor {
    constructor(video) {
      this.video = video;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  
    extract(frameTime) {
      return new Promise((resolve, reject) => {
        this.video.currentTime = frameTime;
        this.video.addEventListener('seeked', () => {
          this.canvas.width = this.video.videoWidth;
          this.canvas.height = this.video.videoHeight;
  
          this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  
          const dataUri = this.canvas.toDataURL('image/png');
          resolve(dataUri);
        });
      });
    }
  }
  
  export default FrameExtractor;