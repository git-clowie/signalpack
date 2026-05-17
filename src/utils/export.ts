export const downloadAsFile = (filename: string, content: string, type: string = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const nativeShare = async (title: string, text: string, url?: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href,
      });
      return true;
    } catch (err) {
      console.log('Error sharing:', err);
      return false;
    }
  }
  return false;
};

export const sendEmail = (subject: string, body: string) => {
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, '_self');
};

export const shareToWhatsApp = (text: string) => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const a = document.createElement('a');
  a.href = whatsappUrl;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
