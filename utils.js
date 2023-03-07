// تابع برای ساخت یک رشته تصادفی با طول مشخص
export const generateRandomString = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  // تابع برای چک کردن اینکه آیا فایل ورودی یک ویدیو است یا خیر
  export const isVideo = (file) => {
    return file && file.type.startsWith('video/');
  };
  
  // تابع برای تبدیل مدت زمان ویدیو به فرمت "دقیقه:ثانیه"
  export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const leadingZero = (value) => {
      if (value < 10) {
        return `0${value}`;
      }
      return value;
    };
    return `${leadingZero(minutes)}:${leadingZero(remainingSeconds)}`;
  };
  
  // تابع برای تبدیل زمان شروع و پایان به ثانیه
  export const convertToSeconds = (time) => {
    const parts = time.split(':').map(parseFloat);
    return parts[0] * 60 + parts[1];
  };
  
  // تابع برای ساخت یک شیء شبه-promise که یک فایل را به صورت asynchronous می‌خواند
  export const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };